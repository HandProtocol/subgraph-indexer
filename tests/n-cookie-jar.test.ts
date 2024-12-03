import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { AllowedAmountUpdated } from "../generated/schema"
import { AllowedAmountUpdated as AllowedAmountUpdatedEvent } from "../generated/nCookieJar/nCookieJar"
import { handleAllowedAmountUpdated } from "../src/n-cookie-jar"
import { createAllowedAmountUpdatedEvent } from "./n-cookie-jar-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let user = Address.fromString("0x0000000000000000000000000000000000000001")
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let newAmount = BigInt.fromI32(234)
    let newAllowedAmountUpdatedEvent = createAllowedAmountUpdatedEvent(
      user,
      token,
      newAmount
    )
    handleAllowedAmountUpdated(newAllowedAmountUpdatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AllowedAmountUpdated created and stored", () => {
    assert.entityCount("AllowedAmountUpdated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AllowedAmountUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "user",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AllowedAmountUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "AllowedAmountUpdated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newAmount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
