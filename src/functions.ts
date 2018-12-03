import { BoostConnector } from "./boostConnector";
import { Scanner } from "./scanner";
import { Hub } from "./hub";

async function connect() : Promise<void> {
  try {
    const characteristic = await BoostConnector.connect();
    this.hub = new Hub(characteristic);
  } catch (e) {
    console.log("Error from connect: " + e);
  }
}

function scan() : void {
  try {
    Scanner.run();
  } catch (e) {
    console.log("Error from scan: " + e);
  }
}

export {
  connect,
  scan
}
