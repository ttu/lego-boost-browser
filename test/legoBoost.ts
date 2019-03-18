import * as assert from 'assert';
import * as mockery from 'mockery';
import * as sinon from 'sinon';

const connectorStub = sinon.stub();
connectorStub.prototype.connect = async () => {
  return Promise.resolve({});
};

const hubStub = sinon.stub();
hubStub.prototype.on = () => {};

mockery.enable();
mockery.registerAllowable('../src/legoBoost');
mockery.registerMock('./hub/hubAsync', { HubAsync: hubStub });
mockery.registerMock('./ai/hub-control', { HubControl: hubStub });
mockery.registerMock('./boostConnector', { BoostConnector: connectorStub });

import LegoBoost from '../src/legoBoost';

describe('LegoBoost', () => {
  describe('#deviceInfo', () => {
    it('distance default', () => {
      const boost = new LegoBoost();
      assert.equal(boost.deviceInfo.distance, Number.MAX_SAFE_INTEGER);
    });
  });

  describe('#connect', () => {
    it('connect default', () => {
      const boost = new LegoBoost();
      boost.connect();
      assert.equal(boost.deviceInfo.distance, Number.MAX_SAFE_INTEGER);
    });
  });
});