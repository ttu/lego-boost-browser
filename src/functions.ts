import { BoostConnector } from "./boostConnector";
import { Scanner } from "./scanner";
// import { Hub } from "./hub/hub";
import { HubAsync } from "./hub/hubAsync";

let hub: HubAsync;
let color: string;

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

    hub.emitter.on("connect", async evt => {
      await hub.ledAsync("green");
    });
  } catch (e) {
    console.log("Error from connect: " + e);
  }
}

async function changeLed(): Promise<void> {
  if (!hub || hub.connected === false) return;
  color = color === 'pink' ? 'orange' : 'pink';
  await hub.ledAsync(color);
}

async function drive(): Promise<void> {
  if (!hub || hub.connected === false) return;
  await hub.motorTimeMultiAsync(2, 10, 10);
}

async function disconnect(): Promise<void> {
  if (!hub || hub.connected === false) return;
  hub.disconnect();
  await BoostConnector.disconnect();
}

function scan(): void {
  try {
    Scanner.run();
  } catch (e) {
    console.log("Error from scan: " + e);
  }
}

export { connect, scan, changeLed, drive, disconnect };
