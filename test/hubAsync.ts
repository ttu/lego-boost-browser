import assert from 'assert';
import * as mockery from 'mockery';
import * as sinon from 'sinon';

const hubStub = sinon.stub();
const emitterStub = sinon.stub();
emitterStub.prototype.on = () => {};
hubStub.prototype.emitter = emitterStub;

mockery.enable();
mockery.registerAllowable('../src/hub/hubAsync');
mockery.registerMock('./hub', { Hub: hubStub });

import { HubAsync } from '../src/hub/hubAsync';

describe('HubAsync', () => {
  describe('#useMetric', () => {
    it('useMetrics default', () => {
      // const hubAsync = new HubAsync(null, {});
      // hubAsync.afterInitialization();

      // assert.equal(hubAsync.useMetric, true);
    });
  });
});