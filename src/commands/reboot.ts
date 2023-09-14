import os from 'node:os';

import { iPhoneService } from '../data';
import { Command } from '../types';

const command: Command = {
  name: 'reboot',
  execute: async (message, args) => {
    //console.log('message:', message, 'args:', args);
    if (!message.guild) return;

    const arg = args[1];
    if (!arg) {
      await message.channel.send(`Device not found '${arg}'`);
      return;
    }

    let reboots = 0, fails = 0;
    const hostname = os.hostname();
    const deviceNames: string[] = iPhoneService.parseDeviceNames(arg);
    for (const device of iPhoneService.devices) {
      if (!deviceNames.includes(device.name)) {
        continue;
      }
      try {
        await device.rebootDevice();
        await message.channel.send(`[${device.name}] Rebooted successfully.`);
        reboots++;
      } catch (err: any) {
        fails++;
        console.error('error:', err.message);
        await message.channel.send(`[${device.name}] Failed to reboot.`);
      }
    }

    console.log(reboots + ' devices rebooted successfully and ' + fails + ' failed.');
    if (fails > 0) {
      await message.channel.send(`[${hostname}] ${reboots} devices rebooted successfully and ${fails} failed.`);
    } else {
      await message.channel.send(`[${hostname}] ${reboots} devices rebooted successfully.`);
    }
  },
  permissions: ['Administrator'],
  aliases: [],
};

export default command;