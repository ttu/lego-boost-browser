import { BoostConnector } from "./boostConnector";
import { Scanner } from "./scanner";
import { Hub } from "./hub/hub";
// import { HubAsync } from "./hub/hubAsync";

let hub: Hub;

async function connect() : Promise<void> {
  try {
    const characteristic = await BoostConnector.connect();
    hub = new Hub(characteristic);

    hub.emitter.on('distance', (evt) => {
      console.log(evt.type + ": " + evt.data);
    });

    hub.led("pink");
    hub.motorTimeMulti(10, 10, 10);
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
