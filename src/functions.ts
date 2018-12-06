import { BoostConnector } from "./boostConnector";
import { Scanner } from "./scanner";
// import { Hub } from "./hub/hub";
import { HubAsync } from "./hub/hubAsync";

let hub: HubAsync;

async function connect(): Promise<void> {
  try {
    const characteristic = await BoostConnector.connect();
    hub = new HubAsync(characteristic);

    hub.emitter.on("disconnect", async evt => {
      await BoostConnector.reconnect();
    });

    hub.emitter.on("distance", evt => {
      console.log(evt.type + ": " + evt.data);
    });

    hub.emitter.on("connect", evt => {
      hub.led("pink");
      hub.motorTimeMulti(2, 10, 10);
    });
  } catch (e) {
    console.log("Error from connect: " + e);
  }
}

async function changeLed(): Promise<void> {
  if (!hub) return;
  await hub.ledAsync('green');
}

async function drive(): Promise<void> {
  if (!hub) return;
  await hub.motorAngleMultiAsync(2, 10, 10);
}

function scan(): void {
  try {
    Scanner.run();
  } catch (e) {
    console.log("Error from scan: " + e);
  }
}

export { connect, scan, changeLed, drive };
