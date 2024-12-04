import { json, Bytes, dataSource } from "@graphprotocol/graph-ts";
import { RoundMetadata } from "../generated/schema";

export function handleRoundMetadata(content: Bytes): void {
  let roundMetadata = new RoundMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    const image = value.get("image");
    const name = value.get("name");
    const description = value.get("description");
    const externalURL = value.get("external_url");

    if (name && image && description && externalURL) {
      roundMetadata.name = name.toString();
      roundMetadata.image = image.toString();
      roundMetadata.external_url = externalURL.toString();
      roundMetadata.description = description.toString();
    }

    roundMetadata.save();
  }
}
