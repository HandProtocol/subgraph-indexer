import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  AdminAdded,
  AdminRemoved,
  ScoreTypeAdded,
  ScoreTypeRemoved,
  ScoreUpdated,
} from "../generated/Scorer/Scorer";
import { Admin, Score, ScoreType, User } from "../generated/schema";
import { loadOrCreateUser } from "./helper";

export function handleAdminAdded(event: AdminAdded): void {
  let admin = new Admin(event.params.admin.toHex());
  admin.appointedAt = event.block.timestamp;
  admin.save();
}

export function handleAdminRemoved(event: AdminRemoved): void {
  let adminId = event.params.admin.toHex();
  store.remove("Admin", adminId);
}

export function handleScoreTypeAdded(event: ScoreTypeAdded): void {
  let scoreType = new ScoreType(event.params.scoreType);
  scoreType.save();
}

export function handleScoreTypeRemoved(event: ScoreTypeRemoved): void {
  let scoreTypeId = event.params.scoreType;
  // remove score type
  store.remove("ScoreType", scoreTypeId);
}

export function handleScoreUpdated(event: ScoreUpdated): void {
  const user = loadOrCreateUser(event.params.user.toHex(), event);

  let scoreId = `${user.id}-${event.params.scoreType}`;
  let score = Score.load(scoreId);
  if (!score) {
    score = new Score(scoreId);
    score.user = user.id;
    score.scoreType = event.params.scoreType;
    score.value = BigInt.zero();
  }

  // Update score
  let oldScore = score.value;
  score.value = event.params.newScore;
  score.save();

  // Update user's total score
  user.totalScore = user.totalScore.minus(oldScore).plus(score.value);
  user.save();
}
