import os from 'node:os';

import { iPhoneService } from '../data';
import { Command } from '../types';

const command: Command = {
  name: 'list',
  execute: async (message, args) => {
    if (!message.guild) return;

    const hostname = os.hostname();
    if (args.length === 2) {
      const machineName = args[1];
      if (machineName !== hostname) {
        console.debug('not interested machine for command');
        return;
      }
    }

    const devices = [];
    for (const device of iPhoneService.devices) {
      devices.push(`- ${device.name}`);
    }
    const response = devices.join('\n');
    await message.channel.send(`**${hostname} Devices (${iPhoneService.devices.length} connected)**\n${response}`);
  },
  permissions: ['Administrator'],
  aliases: [],
};

export default command;