[![Build Status](https://travis-ci.org/calidion/shell-script-reader.svg?branch=master)](https://travis-ci.org/calidion/shell-script-reader.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/calidion/shell-script-reader/badge.svg?branch=master)](https://coveralls.io/github/calidion/shell-script-reader?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# Shell Script Reader

Shell Script Reader provides a way to read user customized shell script where a lot of enviromental vairables are defined.

So you can easily share your shell variables with your node.js scripts.

Instead of using a central process.env, you can use your enviromental variables more respectively for each projects.

# Install

```
npm install --save shell-script-reader
```

# Usage

## Import

```ts
import { ShellScriptReader } from "shell-script-reader";
```

## Initialize

```ts
import * as path from "path";
const filename = path.resolve(__dirname, "./env");
const reader = new ShellScriptReader(filename);
```

`env` file example:

```bash
export AAA=111
export BBB=sosoisidoeod
export ENV=E-SS OS
export UN=
export UN=aaasossos=aaa
export AAAAA
export
export

# SHELL COMMENTS
wget https://www.google.com
```

We will have an env object:

```ts
    { AAA: '111',
      BBB: 'sosoisidoeod',
      ENV: 'E-SS OS',
      UN: '',
      AAAAA: '' }
```

## Read process.env

It provide access to process.env for convience sake.

```ts
const value = reader.getEnvRaw("KEY_NAME");
```

## Read Script Variables

```ts
const value = reader.getEnv("KEY_NAME");
```

For `./env` script will defined above:

```ts
const value = reader.getEnv("AAA");
// '111'
const value = reader.getEnv("BBB");
// 'sosoisidoeod'
```

If no key is provided, the whole object will be return:

```ts
const value = reader.getEnv();
// { AAA: '111',
//   BBB: 'sosoisidoeod',
//   ENV: 'E-SS OS',
//   UN: '',
//   AAAAA: '' }
```

# License

The MIT License (MIT)
