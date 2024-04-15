import Debug "mo:base/Debug";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import Array "mo:base/Array";
import Error "mo:base/Error";
import List "mo:base/List";
import RBTree "mo:base/RBTree";
import Timer "mo:base/Timer";
import TrieSet "mo:base/TrieSet";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "types";

actor {
	type Auction = Types.Auction;
	type Result = Types.Result;
	type BiddersQueryResult = Types.BiddersQueryResult;
	type BidTuple = Types.BidTuple;
	type BidTupleBuffer = Buffer.Buffer<BidTuple>;
	type AllAuctionBiddersQueryResult = Types.AllAuctionBiddersQueryResult;

	let auctions = HashMap.HashMap<Nat, Auction>(0, Nat.equal, Hash.hash);
	let pastBids = HashMap.HashMap<Nat, BidTupleBuffer>(0, Nat.equal, Hash.hash);
	let balances = HashMap.HashMap<Principal, Nat>(0, Principal.equal, Principal.hash);
	var auctionNum : Nat = 0;

	public query func getAuctions() : async ([(Nat, Auction)]) {
		let hashMapValues = auctions.entries();
		Iter.toArray<(Nat, Auction)>(hashMapValues);
	};

	public query func getAuctionPastBids(auctionID : Nat) : async BiddersQueryResult {
		switch (getAuctionPastBidsAsBuffer(auctionID)) {
			case (?pastBidsBuffer) {
				#ok(Buffer.toArray<BidTuple>(pastBidsBuffer));
			};
			case (null) {
				#err(#invalidID);
			};
		};
	};

	public query func getAllPastBids() : async AllAuctionBiddersQueryResult {
		let allBidsBuffer = Buffer.Buffer<(Nat, [BidTuple])>(pastBids.size());
		for ((key, buffer) in pastBids.entries()) {
			allBidsBuffer.add(key, Buffer.toArray<BidTuple>(buffer));
		};
		#ok(Buffer.toArray<(Nat, [BidTuple])>(allBidsBuffer));
	};

	public query func getBalances() : async ([(Principal, Nat)]) {
		let hashMapValues = balances.entries();
		Iter.toArray<(Principal, Nat)>(hashMapValues);
	};

	public shared (msg) func getMyBalance() : async Nat {
		switch (balances.get(msg.caller)) {
			case (null) 0;
			case (?balance) balance;
		};
	};

	func getBalance(user : Principal) : Nat {
		switch (balances.get(user)) {
			case (null) 0;
			case (?balance) balance;
		};
	};

	func getAuctionPastBidsAsBuffer(auctionID : Nat) : ?BidTupleBuffer {
		switch (pastBids.get(auctionID)) {
			case (null) {
				null;
			};
			case (?pastBids) {
				?pastBids;
			};
		};
	};

	func getAuction(auctionID : Nat) : ?Auction {
		switch (auctions.get(auctionID)) {
			case (null) {
				null;
			};
			case (?auction) {
				?auction;
			};
		};
	};

	public shared (msg) func newUser(balance : Nat) : async Principal {
		balances.put(msg.caller, balance);
		msg.caller;
	};

	public shared (msg) func newAuction(aucDuration : Int, aucStartPrice : Nat, tokenID : Text) : async Nat {
		let auction : Auction = {
			creator = msg.caller;
			endTime = Time.now() + (aucDuration * 10 ** 9);
			endPrice = aucStartPrice;
			startPrice = aucStartPrice;
			startTime = Time.now();
			topBidder = null;
			tokenID = tokenID;
			lastBidder = null;
		};

		let bidBuffer : BidTupleBuffer = Buffer.Buffer<BidTuple>(1);
		bidBuffer.add((msg.caller, aucStartPrice));

		pastBids.put(auctionNum, bidBuffer);
		auctions.put(auctionNum, auction);
		auctionNum += 1;
		auctionNum - 1;
	};

	public shared (msg) func newBid(auctionID : Nat, amount : Nat) : async Result {
		let bidder = msg.caller;
		let bidderBalance = getBalance(bidder);

		switch (getAuction(auctionID)) {
			case (null) {
				return #err(#invalidID);
			};
			case (?auction) {
				if (isAuctionOngoing(auction)) {
					return #err(#expiredAuction);
				};
				if (auction.endPrice > amount) {
					return #err(#bidTooLow);
				} else {
					switch (auction.lastBidder) {
						case (null) {
							let status = await bidBalTransfer(bidder, auction.creator, amount);
							if (Result.isErr(status)) {
								return status;
							};
						};
						case (?lastBidder) {
							var status = await bidBalTransfer(auction.creator, lastBidder, auction.endPrice);
							if (Result.isErr(status)) {
								return status;
							};
							status := await bidBalTransfer(bidder, auction.creator, amount);
							if (Result.isErr(status)) {
								return status;
							};
						};
					};
					auctions.put(auctionID, updateBidder(auction, bidder, amount, auctionID));
					switch (getAuctionPastBidsAsBuffer(auctionID)) {
						case (null) {
							return #err(#failed);
						};
						case (?currentPastBids) {
							pastBids.put(auctionID, updatePastBids(currentPastBids, bidder, amount));
						};
					};
					return #ok();
				};
			};
		};
	};

	func bidBalTransfer(from : Principal, to : Principal, amount : Nat) : async Result {
		if (getBalance(from) < amount) {
			return #err(#insufficientFunds);
		};
		let fromAmount = getBalance(from) - amount;
		let toAmount = getBalance(to) + amount;
		balances.put(from, fromAmount);
		balances.put(to, toAmount);
		return #ok();
	};

	func updateBidder(auction : Auction, bidder : Principal, amount : Nat, auctionNum : Nat) : Auction {
		{
			creator = auction.creator;
			endTime = auction.endTime;
			endPrice = amount;
			startPrice = auction.startPrice;
			startTime = auction.startTime;
			topBidder = ?bidder;
			tokenID = auction.tokenID;
			lastBidder = auction.lastBidder;
		};
	};

	func updatePastBids(auctionPastBids : BidTupleBuffer, bidder : Principal, bid : Nat) : BidTupleBuffer {
		auctionPastBids.add((bidder, bid));
		return auctionPastBids;
	};

	func isAuctionOngoing(auction : Auction) : Bool {
		return auction.endTime < Time.now();
	};

	//Would need structure to update the topBidder's tokens, immediatly auction is completed
	func transferToken(from : Principal, to : Principal, token : Text) : async Result {
		// Working on it
		return #ok();
	};

	//I'm having doubt on the action timer, should it run immediatly an auction is created, countinuesly running and call the completeAuction function if 15 minutes elapsed.

	func auctionCompleted(auction : Auction, bidder : Principal) : async Result {
		var status = await bidBalTransfer(bidder, auction.creator, auction.endPrice);
		if (Result.isErr(status)) {
			return status;
		};
		status := await transferToken(auction.creator, bidder, auction.tokenID);
		if (Result.isErr(status)) {
			return status;
		};
		return #ok();
	};

	public query func getAuctionInfo(auctionId : Nat) : async ?Auction {
		switch (auctions.get(auctionId)) {
			case (null) {
				null;
			};
			case (?auction) {
				?auction;
			};
		};
	};
}