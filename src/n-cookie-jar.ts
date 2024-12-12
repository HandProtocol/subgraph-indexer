import {
  Deposit,
  Withdraw,
  Claimed,
  AllowedAmountUpdated,
  RoundUpdated,
} from "../generated/nCookieJar/nCookieJar";
import {
  Donation,
  Round,
  CurrentRound,
  AllocatedToken,
} from "../generated/schema";
import { RoundMetadata as RoundMetadataTemplate } from "../generated/templates";
import { BigInt } from "@graphprotocol/graph-ts";
import {
  CURRENT_ROUND_ID,
  getCurrentRound,
  loadOrCreateGlobalStats,
  loadOrCreateTokenBalance,
  loadOrCreateUser,
} from "./helper";
import { log } from "@graphprotocol/graph-ts";
// event handlers

export function handleDeposit(event: Deposit): void {
  let user = loadOrCreateUser(event.params.depositor.toHex(), event);
  let tokenBalance = loadOrCreateTokenBalance(event.params.token.toHex());

  let donationId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let donation = new Donation(donationId);
  donation.user = user.id;
  donation.token = event.params.token.toHex();
  donation.amount = event.params.amount;
  donation.timestamp = event.block.timestamp;
  donation.save();

  tokenBalance.amount = tokenBalance.amount.plus(event.params.amount);
  tokenBalance.save();
}

export function handleRoundUpdated(event: RoundUpdated): void {
  let roundId = event.transaction.hash.toHex();
  let ipfsMetadataURI = event.params.metadataURI;

  let round = new Round(roundId);
  round.start = event.params.start;
  round.end = event.params.end;
  round.createdAt = event.block.timestamp;

  // Extract CID from the IPFS URI
  let ipfsHash = ipfsMetadataURI.replace("ipfs://", "");
  round.metadata = ipfsHash;

  log.warning("ipfsHash: {} ", [ipfsHash]);

  RoundMetadataTemplate.create(ipfsHash);

  round.save();

  // also save this round at round id CURRENT_ROUND_ID

  // Update the CurrentRound entity to reflect the most recent round
  let currentRound = CurrentRound.load(CURRENT_ROUND_ID);
  if (currentRound == null) {
    currentRound = new CurrentRound(CURRENT_ROUND_ID); // Static ID for CurrentRound
  }
  currentRound.round = round.id; // Set the new round as current
  currentRound.updatedAt = event.block.timestamp; // Update the timestamp
  currentRound.save();
}

export function handleAllowedAmountUpdated(event: AllowedAmountUpdated): void {
  let user = loadOrCreateUser(event.params.user.toHex(), event);
  let currentRound = getCurrentRound();

  let allocatedTokenId =
    user.id + "-" + event.params.token.toHex() + "-" + currentRound.round;
  let allocatedToken = AllocatedToken.load(allocatedTokenId);

  let newAmount = event.params.newAmount;

  if (!allocatedToken) {
    allocatedToken = new AllocatedToken(allocatedTokenId);
    allocatedToken.user = user.id;
    allocatedToken.token = event.params.token.toHex();
    allocatedToken.amount = newAmount;
    allocatedToken.round = currentRound.round;
    allocatedToken.claimedAmount = BigInt.zero();
  }

  if (
    allocatedToken.claimedAmount.gt(BigInt.zero()) &&
    allocatedToken.amount.equals(allocatedToken.claimedAmount)
  ) {
    // this mean now we are adding more amount to already claimed one for a address in this round
    allocatedToken.amount = allocatedToken.amount.plus(newAmount);
  } else {
    allocatedToken.amount = newAmount;
  }

  allocatedToken.timestamp = event.block.timestamp;

  allocatedToken.save();

  let globalStats = loadOrCreateGlobalStats();
  globalStats.timesAlloted = globalStats.timesAlloted.plus(BigInt.fromI32(1));

  globalStats.save();
}

export function handleClaimed(event: Claimed): void {
  let user = loadOrCreateUser(event.params.claimant.toHex(), event);
  let tokenBalance = loadOrCreateTokenBalance(event.params.token.toHex());
  let globalStats = loadOrCreateGlobalStats();

  let currentRound = getCurrentRound();

  let allocatedTokenId =
    user.id + "-" + event.params.token.toHex() + "-" + currentRound.round;

  let allocatedToken = AllocatedToken.load(allocatedTokenId);
  if (!allocatedToken) {
    throw new Error(
      "Can't claim if amount isn't allocated for the current round"
    );
  }
  allocatedToken.claimedAmount = allocatedToken.claimedAmount.plus(
    event.params.amount
  );
  allocatedToken.claimedTimeStamp = event.block.timestamp;

  allocatedToken.save();

  tokenBalance.amount = tokenBalance.amount.minus(event.params.amount);
  tokenBalance.save();

  globalStats.timesClaimed = globalStats.timesClaimed.plus(BigInt.fromI32(1));
  globalStats.save();
}

export function handleWithdraw(event: Withdraw): void {
  let tokenBalance = loadOrCreateTokenBalance(event.params.token.toHex());
  tokenBalance.amount = tokenBalance.amount.minus(event.params.amount);
  tokenBalance.save();
}
