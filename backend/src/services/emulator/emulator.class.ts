import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { OCPPClient } from '../../ocppClient';

interface Data {}

interface ServiceOptions {}

let client: OCPPClient | null = null;

export class Emulator implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: any) {
    const { action, serverUrl, chargePointId } = data;

    if (action === 'connect') {
      client = new OCPPClient(serverUrl, chargePointId);
      client.connect((msg) => {
        console.log('Received from CSMS:', msg);
      });
      return { status: 'connected' };
    }

    if (action === 'bootNotification' && client) {
      client.sendBootNotification();
      return { status: 'bootNotification sent' };
    }

    return { status: 'unknown action' };
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
