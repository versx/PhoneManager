import os from 'node:os';

import { iPhoneService } from '../data';
import { Command } from '../types';

const command: Command = {
  name: 'list',
  execute: async (message, args) => {
    if (!message.guild) return;

    const hostname = os.hostname();
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