import { iPhoneService } from '../data';
import { Command } from '../types';

const command: Command = {
  name: 'screen',
  execute: async (message, args) => {
    if (!message.guild) return;

    const arg = args[1];
    if (!arg) {
      await message.channel.send(`Device not found '${arg}'`);
      return;
    }

    const deviceNames: string[] = iPhoneService.parseDeviceNames(arg);
    for (const device of iPhoneService.devices) {
      if (!deviceNames.includes(device.name)) {
        continue;
      }
      setTimeout(async () => {
        const screenshot = await device.getScreenshot();
        if (!screenshot) {
          console.warn('Failed to get screenshot for device', device.name);
          await message.channel.send(`[${device.name}] Failed to get screenshot.`);
          return;
        }
    
        await message.channel.send({
          content: `**Device Screenshot** (${device.name})`,
          files: [screenshot],
        });
      }, 2 * 1000);
    }
  },
  permissions: ['Administrator'],
  aliases: [],
};

export default command;