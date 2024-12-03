import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminAdded,
  AdminRemoved,
  Initialized,
  OwnershipTransferred,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  ScoreTypeAdded,
  ScoreTypeRemoved,
  ScoreUpdated
} from "../generated/Scorer/Scorer"

export function createAdminAddedEvent(admin: Address): AdminAdded {
  let adminAddedEvent = changetype<AdminAdded>(newMockEvent())

  adminAddedEvent.parameters = new Array()

  adminAddedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )

  return adminAddedEvent
}

export function createAdminRemovedEvent(admin: Address): AdminRemoved {
  let adminRemovedEvent = changetype<AdminRemoved>(newMockEvent())

  adminRemovedEvent.parameters = new Array()

  adminRemovedEvent.parameters.push(
    new ethereum.EventParam("admin", ethereum.Value.fromAddress(admin))
  )

  return adminRemovedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createScoreTypeAddedEvent(scoreType: string): ScoreTypeAdded {
  let scoreTypeAddedEvent = changetype<ScoreTypeAdded>(newMockEvent())

  scoreTypeAddedEvent.parameters = new Array()

  scoreTypeAddedEvent.parameters.push(
    new ethereum.EventParam("scoreType", ethereum.Value.fromString(scoreType))
  )

  return scoreTypeAddedEvent
}

export function createScoreTypeRemovedEvent(
  scoreType: string
): ScoreTypeRemoved {
  let scoreTypeRemovedEvent = changetype<ScoreTypeRemoved>(newMockEvent())

  scoreTypeRemovedEvent.parameters = new Array()

  scoreTypeRemovedEvent.parameters.push(
    new ethereum.EventParam("scoreType", ethereum.Value.fromString(scoreType))
  )

  return scoreTypeRemovedEvent
}

export function createScoreUpdatedEvent(
  user: Address,
  scoreType: string,
  newScore: BigInt,
  oldScore: BigInt
): ScoreUpdated {
  let scoreUpdatedEvent = changetype<ScoreUpdated>(newMockEvent())

  scoreUpdatedEvent.parameters = new Array()

  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam("scoreType", ethereum.Value.fromString(scoreType))
  )
  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newScore",
      ethereum.Value.fromUnsignedBigInt(newScore)
    )
  )
  scoreUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "oldScore",
      ethereum.Value.fromUnsignedBigInt(oldScore)
    )
  )

  return scoreUpdatedEvent
}
