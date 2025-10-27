import assert from 'assert';
import app from '../../src/app';

describe('\'emulator\' service', () => {
  it('registered the service', () => {
    const service = app.service('emulator');

    assert.ok(service, 'Registered the service');
  });
});
