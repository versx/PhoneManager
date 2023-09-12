import { iPhoneService } from '../data';
import { Command } from '../types';

const command: Command = {
  name: 'test',
  execute: async (message, args) => {
    //console.log('message:', message, 'args:', args);
    if (!message.guild) return;

    const arg = args[1];
    if (!arg) {
      await message.channel.send(`Device not found '${arg}'`);
      return;
    }

    const deviceNames: string[] = iPhoneService.parseDeviceNames(arg);
    for (const device of iPhoneService.devices) {
      //await device.connect();

      /*
      const features: any = await device.features();
      console.log('features:', features);

      const keys = Object.keys(features);
      for (const key of keys) {
        const feature = features[key];
        console.log('feature:', feature);
        await message.channel.send('feature: ' + key + ' = ' + feature);
      }
      */

      //const properties = await device.properties();
      //console.log('properties:', properties);

      //const packages: any = await device.packages();
      //console.log('packages:', packages);
      //await message.channel.send(packages.join('\n'));
    }
  },
  permissions: ['Administrator'],
  aliases: [],
};

export default command;