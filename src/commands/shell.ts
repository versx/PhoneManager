import { exec } from 'node:child_process';
import os from 'node:os';

import { Command } from '../types';

const command: Command = {
  name: 'shell',
  execute: async (message, args) => {
    //console.log('message:', message, 'args:', args);
    if (!message.guild) return;

    const arg = args[1];
    if (!arg) {
      await message.channel.send(`No command specified '${arg}'`);
      return;
    }

    const hostname = os.hostname();
    const response = await executeCommand(arg);
    console.log('shell response:', response);
    await message.channel.send(`[${hostname}] Command executed successfully.`);
  },
  permissions: ['Administrator'],
  aliases: [],
};

const executeCommand = (command: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      exec(command, (error, stdout, stderr) => {
        //console.log('stdout:', stdout, 'stderr:', stderr, 'error:', error);
        if (error) {
          console.error(`error: ${error}\nstderr: ${stderr}`);
          return reject(error);
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return reject(stderr);
        }
        resolve(stdout);
      });
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  });
};

export default command;