import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

actor Auction {
    type TokenIdentifier = Nat;
    type AuctionId = Text;

    type AuctionInfo = {
        tokenId : TokenIdentifier;
        startingPrice : Nat;
        highestBid : Nat;
        highestBidder : ?Principal;
        auctionEnded : Bool;
    };

    var auctions : HashMap.HashMap<AuctionId, AuctionInfo> = HashMap.empty();

    public query func getAuctionInfo(auctionId : AuctionId) : async AuctionInfo {
        let exists = containsKey(auctions, auctionId);
        assert (exists, "Auction does not exist");

        return unwrap(get(auctions, auctionId));
    };

   

    func containsKey<K, V>(map: HashMap.HashMap<K, V>, key: K): Bool {
        if (HashMap.get(map, key) == null) {
            return true;
        } else {
            return false;
        }
    }

func get<K, V>(map: HashMap.HashMap<K, V>, key: K): V {
    let value = HashMap.getOpt(map, key);
    if (value == null) {
        panic("Key not found in the map");
    } else {
        return unwrap(value);
    }
}



    public func unwrap<T>(value : ?T) : T {
        if (value == null) {
            panic("Unexpected null value");
        } else {
            return value;
        };
    };
};
