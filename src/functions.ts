import { BoostConnector } from "./boostConnector";
import { Scanner } from "./scanner";

async function connect() : Promise<void> {
  try {
    const characteristic = await BoostConnector.connect();
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
