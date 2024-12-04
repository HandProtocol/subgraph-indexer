// helper functions

import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { GlobalStats, TokenBalance, User } from "../generated/schema";

export function loadOrCreateUser(
  userAddress: string,
  event: ethereum.Event
): User {
  let user = User.load(userAddress);
  if (!user) {
    user = new User(userAddress);
    user.totalScore = BigInt.zero();
    user.createdAt = event.block.timestamp;
    user.save();
  }
  return user;
}

export function loadOrCreateTokenBalance(token: string): TokenBalance {
  let tokenBalance = TokenBalance.load(token);
  if (!tokenBalance) {
    tokenBalance = new TokenBalance(token);
    tokenBalance.token = token;
    tokenBalance.amount = BigInt.zero();
    tokenBalance.save();
  }
  return tokenBalance;
}

export function loadOrCreateGlobalStats(): GlobalStats {
  let globalStats = GlobalStats.load("global");
  if (!globalStats) {
    globalStats = new GlobalStats("global");
    globalStats.totalClaimed = BigInt.zero();
    globalStats.uniqueClaimers = BigInt.zero();
    globalStats.save();
  }
  return globalStats;
}
