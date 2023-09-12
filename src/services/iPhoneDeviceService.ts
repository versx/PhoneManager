import { exec } from 'node:child_process';

export type DeviceInfo = {
  name: string;
  uuid: string;
};

export class iPhoneDeviceService {
  public devices: iPhoneDevice[] = [];

  constructor() {
    this.load();
  }
  //constructor(devices: DeviceInfo[]) {
  //  this.devices = devices.map((device: DeviceInfo) => new iPhoneDevice(device.name, device.uuid));
  //}

  async load() {
    const devices = await loadDevices();
    console.log('devices:', devices);
    this.devices = devices.map((device) => new iPhoneDevice(device.name, device.uuid));
  }

  parseDeviceNames(arg: string): string[] {
    let devices: string[] = [];
    if (arg === 'all') {
      devices = this.devices.map((device) => device.name);
    } else if (arg.includes(',')) {
      devices = arg.split(/,\s?/g);
    } else {
      devices = this.devices.filter((device) => device.name === arg).map((device) => device.name); //[arg];
    }
    return devices;
  };
};

export class iPhoneDevice {
  public name: string;
  public uuid: string;
  public port: number;

  constructor(name: string, uuid: string, port: number = 8080) {
    this.name = name;
    this.uuid = uuid;
    this.port = port;
  }
  
  async rebootDevice() {
    try {
      await executeCommand(`idevicediagnostics -u ${this.uuid} restart`);
    } catch (err) {
      console.error('reboot device failed:', err);
    }
  };

  async getScreenshot() {
    try {
      //ideviceimagemounter /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/10.3/DeveloperDiskImage.dmg  /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/10.3/DeveloperDiskImage.dmg.signature
      const destination = `./static/screens/${this.name}.png`;
      const data = await executeCommand(`idevicescreenshot -u ${this.uuid} ${destination}`);
      console.log('screenshot data:', data);
      console.log(`[${this.name}] Screenshot taken, saved to ${destination}`);
      return destination;
    } catch (err) {
      console.error(`[${this.name}] error:`, err);
    }
  };
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

const loadDevices = async (): Promise<DeviceInfo[]> => {
  const devices: DeviceInfo[] = [];
  //const response = await executeCommand('cfgutil --format JSON list');
  const response = await executeCommand('ios-deploy -c');
  const data = response.split('\n');
  let counter = 0;
  for (const device of data) {
    if (device.match(/iPhone|iPad|iPod/g) && !devices.some(d => d.uuid === device.split(' ')[2])) {
      const deviceObj = {
        name: device.split("'")[1],
        uuid: device.split(" ")[2],
      };
      devices.push(deviceObj);
      console.log('Found Device:', deviceObj);
    }
    if (counter >= Object.keys(data).length - 1) {
      //resolve();
    }
    else {
      counter++;
    }
  }
  
  // CfgUtil
  //const output = json.Output;
  //const keys = Object.keys(output);
  //for (const id of keys) {
  //  if (output[id].deviceType.match(/iPhone|iPad|iPod/g)) {
  //    const deviceObj = {
  //      name: output[id].name,
  //      uuid: output[id].UDID,
  //    };
  //    devices.push(deviceObj);
  //    console.log('Found Device:', deviceObj);
  //  }
  //  if (counter >= Object.keys(output).length - 1) {
  //    // resolve();
  //  }
  //  else {
  //    counter++;
  //  }
  //}
  return devices;
};