import Result "mo:base/Result";

module {
  public type Auction = {
    startTime : Int;
    endTime : Int;
    creator : Principal;
    topBidder : ?Principal;
    startPrice : Nat;
    endPrice : Nat;
    tokenID : Text;
    lastBidder : ?Principal;
  };

  public type BidTuple = (Principal, Nat);

  public type Error = {
    #insufficientFunds;
    #bidTooLow;
    #invalidID;
    #expiredAuction;
    #failed;
  };

  public type Result = Result.Result<(), Error>;

  public type BiddersQueryResult = Result.Result<[BidTuple], Error>;
  public type AllAuctionBiddersQueryResult = Result.Result<[(Nat, [BidTuple])], Error>;
};