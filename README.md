# Lego Boost in Browser

Control Lego Boost from the browser without any installations.

## Web Bluetooth API

Application uses [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) to communicate with Lego Boost.

Web Bluetooth API works with **Windows, Mac, Linux** and **Android** devices with **Chrome** and **Opera** browsers. Unfortunately Apple iOS doesn't support Web Bluetooth.

[Supported devices](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)

## Start

```sh
$ npm run build:browser
```

Open `index.html` from the root

## Build distributable

```sh
$ npm run build
```

## Example Application

React Application for controlling Lego Boost from the browser with Web Bluetooth API

[Lego Boost App](https://github.com/ttu/lego-boost-app)

## Credits

Communication and control code is ported from these libraries:

- Node module for controlling Lego Boost: https://github.com/hobbyquaker/node-movehub
  - [hub.ts](./src/hub.ts)
- Async implementation of Node module: https://github.com/ttu/node-movehub-async
  - [hubAsync.ts](./src/hubAsync.ts)
- Node application for controlling Lego Boost: https://github.com/ttu/lego-boost-ai
  - [hubControl.ts](./src/ai/hubControl.ts)
- Angular application: https://github.com/BenjaminDobler/ng-lego-boost
- The buffer module from node.js, for the browser: https://github.com/feross/buffer

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

LEGO and BOOST are Trademarks from The LEGO Company, which do not support this project.

Project maintainers are not responsible for any damage on your LEGO BOOST devices - use it at your own risk.

## License

Licensed under the [MIT](https://github.com/ttu/lego-boost-browser/blob/master/LICENSE) License.
