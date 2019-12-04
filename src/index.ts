import * as fs from "fs";


export const MAX_ALLOWED_SIZE = 10 * 1024 * 1024; // Max 10M

export class ShellScriptReader {

  private filename: string;
  private env: object = new Object();

  private read: boolean = false;

  constructor(filename: string) {
    this.filename = filename;
  }
  public getEnvRaw(key?: string) {
    if (key) {
      return process.env[key];
    }
    return process.env;
  }

  public getEnv(key?: string, filename?: string) {
    if (!filename) {
      filename = this.filename;
    }

    if (filename === this.filename) {
      if (this.read) {
        return this.getObjectKeyValue(this.env, key);
      }
    }
    if (!fs.existsSync(filename)) {
      throw new Error("File not Exist!");
    }
    const fd = fs.openSync(filename, "r");
    const size = fs.fstatSync(fd).size;

    if (size > MAX_ALLOWED_SIZE) {
      // tslint:disable-next-line:no-console
      throw new Error("Exceeding max allowed file size 10M!");
    }

    const lines = fs.readFileSync(filename, "utf-8").split(/\r?\n/);
    const env: object = {};

    // tslint:disable-next-line:only-arrow-functions
    lines.forEach((line) => {
      line = line.trim();
      // tslint:disable-next-line:no-console
      const startWithExport = line.indexOf("export ") !== -1;

      if (startWithExport) {
        let kv = line.substr(7);
        kv = kv.trim();
        const index = kv.indexOf("=");
        let k = "";
        let v = "";
        if (index !== -1) {
          k = line.substr(7).substr(0, index);
          v = line.substr(7).substr(index + 1);
        } else {
          k = kv;
        }
        // by pass `export =`
        if (!k) {
          return;
        }
        const descriptor = Object.getOwnPropertyDescriptor(env, k);
        if (!descriptor) {
          Object.defineProperty(env, k, {
            enumerable: true,
            value: v
          });
        } else {
          descriptor.value = v;
        }
      }
    });

    if (this.filename === filename) {
      this.read = true;
      this.env = env;
    }

    return this.getObjectKeyValue(env, key);
  }

  private getObjectKeyValue(o: object, key: string | undefined) {
    if (key) {
      const descriptor = Object.getOwnPropertyDescriptor(o, key);
      return descriptor ? descriptor.value : undefined;
    }
    return o;
  }

}
