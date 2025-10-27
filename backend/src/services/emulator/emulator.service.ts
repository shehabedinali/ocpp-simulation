// Initializes the `emulator` service on path `/emulator`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Emulator } from './emulator.class';
import hooks from './emulator.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'emulator': Emulator & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/emulator', new Emulator(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('emulator');
  service.eventNames().push('message');
  service.publish(() => app.channel('anonymous'));
  service.hooks(hooks);
}
