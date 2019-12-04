import * as fs from 'fs';
import * as path from 'path';
import { MAX_ALLOWED_SIZE, ShellScriptReader } from '../src/index';

test('Should have ShellScriptReader available', () => {
  const filename = path.resolve(__dirname, './env');
  const reader = new ShellScriptReader(filename);
  expect(reader.getEnvRaw()).toBeTruthy();
  expect(reader.getEnvRaw('SHELL_SCRIPT_READER')).toBeFalsy();
  process.env.SHELL_SCRIPT_READER = '1';
  const keys = Object.keys(process.env);
  expect(keys.length > 0).toBeTruthy();
  expect(reader.getEnvRaw('SHELL_SCRIPT_READER') === '1').toBeTruthy();
  expect(reader.getEnv('SHELL_SCRIPT_READER') === undefined).toBeTruthy();
  expect(reader.getEnv('ENV') === 'E-SS OS').toBeTruthy();
  expect(reader.getEnv('AAA') === '111').toBeTruthy();
  expect(reader.getEnv('UN') === '').toBeTruthy();
  expect(Object.keys(reader.getEnv()).length === 5).toBeTruthy();
});

test('Should catch `File not Exist!` exception', () => {
  let catched = false;
  const filename = 'aaa';
  const reader = new ShellScriptReader(filename);
  try {
    reader.getEnv('UN');
  } catch (e) {
    expect(e.message === 'File not Exist!').toBeTruthy();
    catched = true;
  }
  expect(catched).toBeTruthy();
  const filename1 = path.resolve(__dirname, './env');
  expect(reader.getEnv('UN', filename1) === '').toBeTruthy();
});

test('Should catch `Exceeding max allowed file size 10M!` exception', () => {
  let catched = false;
  const filename = path.resolve(__dirname, './env1');
  const fd = fs.openSync(filename, 'w+');

  fs.writeSync(fd, Buffer.alloc(MAX_ALLOWED_SIZE + 1));
  fs.closeSync(fd);

  try {
    const reader = new ShellScriptReader(filename);
    reader.getEnv('UN');
  } catch (e) {
    expect(e.message === 'Exceeding max allowed file size 10M!').toBeTruthy();
    catched = true;
  }

  expect(catched).toBeTruthy();
  fs.unlinkSync(filename);
});
