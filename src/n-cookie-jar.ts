import {
  Deposit,
  Withdraw,
  Claimed,
  AllowedAmountUpdated,
  RoundUpdated,
} from "../generated/nCookieJar/nCookieJar";
import { Donation, Round, Allocation, ClaimedToken } from "../generated/schema";
import { RoundMetadata as RoundMetadataTemplate } from "../generated/templates";
import { BigInt, ipfs, json } from "@graphprotocol/graph-ts";
import {
  loadOrCreateGlobalStats,
  loadOrCreateTokenBalance,
  loadOrCreateUser,
} from "./helper";

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

export function handleClaimed(event: Claimed): void {
  let user = loadOrCreateUser(event.params.claimant.toHex(), event);
  let tokenBalance = loadOrCreateTokenBalance(event.params.token.toHex());
  let globalStats = loadOrCreateGlobalStats();

  let allocationId =
    user.id +
    "-" +
    event.params.token.toHex() +
    "-" +
    event.transaction.hash.toHex();
  let allocation = Allocation.load(allocationId);
  if (allocation) {
    allocation.status = "CLAIMED";
    allocation.save();
  }

  let claimedTokenId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let claimedToken = new ClaimedToken(claimedTokenId);
  claimedToken.user = user.id;
  claimedToken.token = event.params.token.toHex();
  claimedToken.amount = event.params.amount;
  claimedToken.timestamp = event.block.timestamp;
  claimedToken.round = "current"; // Replace with logic to fetch current round
  claimedToken.save();

  tokenBalance.amount = tokenBalance.amount.minus(event.params.amount);
  tokenBalance.save();

  globalStats.totalClaimed = globalStats.totalClaimed.plus(event.params.amount);
  globalStats.save();
}

export function handleAllowedAmountUpdated(event: AllowedAmountUpdated): void {
  let user = loadOrCreateUser(event.params.user.toHex(), event);

  let allocationId = user.id + "-" + event.params.token.toHex() + "-current"; // Replace with current round logic
  let allocation = Allocation.load(allocationId);
  if (!allocation) {
    allocation = new Allocation(allocationId);
    allocation.user = user.id;
    allocation.token = event.params.token.toHex();
    allocation.amount = BigInt.zero();
    allocation.status = "PENDING";
    allocation.round = "current"; // Replace with current round logic
    allocation.timestamp = event.block.timestamp;
  }

  allocation.amount = event.params.newAmount;
  allocation.save();
}

export function handleRoundUpdated(event: RoundUpdated): void {
  let roundId = event.transaction.hash.toHex();
  let ipfsMetadataURI = event.params.metadataURI;

  let round = new Round(roundId);
  round.start = event.params.start;
  round.end = event.params.end;
  round.metadataURI = event.params.metadataURI;
  round.createdAt = event.block.timestamp;

  // Extract CID from the IPFS URI
  let ipfsHash = ipfsMetadataURI.replace("ipfs://", "");

  RoundMetadataTemplate.create(ipfsHash);

  round.save();
}

export function handleWithdraw(event: Withdraw): void {
  let tokenBalance = loadOrCreateTokenBalance(event.params.token.toHex());
  tokenBalance.amount = tokenBalance.amount.minus(event.params.amount);
  tokenBalance.save();
}
