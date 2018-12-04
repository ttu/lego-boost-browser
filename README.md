# Lego Boost in Browser

> Work in progress

Control Lego Boost staigth from the browser without any installations.

Uses [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API). Works with Chrome and Opera.

## Start

```sh
$ npm run build:browser
# Open index.html
```

### Notes

`hubAsync.ts` is copy from [movehub-async.js](https://github.com/ttu/node-movehub-async/blob/master/movehub-async.js).

`ai`-implementation is copy from [lego-boost-ai](https://github.com/ttu/lego-boost-ai).

#### Links

* https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web
* https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
* https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html#browserify


###### Testers

* https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
* https://googlechrome.github.io/samples/web-bluetooth/notifications.html
* https://googlechrome.github.io/samples/web-bluetooth/notifications-async-await.html

## Credits

Node module for controlling Lego Boost: https://github.com/hobbyquaker/node-movehub

Async implementation of Node module: https://github.com/ttu/node-movehub-async

Angular implementation: https://github.com/BenjaminDobler/ng-lego-boost

Buffer: https://github.com/feross/buffer