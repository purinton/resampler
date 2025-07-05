# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/resampler [![npm version](https://img.shields.io/npm/v/@purinton/resampler.svg)](https://www.npmjs.com/package/@purinton/resampler)[![license](https://img.shields.io/github/license/purinton/resampler.svg)](LICENSE)[![build status](https://github.com/purinton/resampler/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/resampler/actions)

> A pure JavaScript, high-quality PCM audio resampler for Node.js. Converts s16le PCM between arbitrary sample rates and channel layouts (mono/stereo) with windowed-sinc filtering. Includes built-in volume control.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ESM Example](#esm-example)
  - [CommonJS Example](#commonjs-example)
- [API](#api)
- [TypeScript](#typescript)
- [License](#license)

## Features

- Pure JavaScript, no native dependencies
- High-quality windowed-sinc resampling
- Arbitrary input/output sample rates (e.g. 48kHz ↔ 24kHz)
- Channel mixing: stereo→mono (average), mono→stereo (duplicate)
- Streams API: drop-in replacement for ffmpeg pipes in Node.js
- Supports s16le PCM (signed 16-bit little-endian)
- Built-in output volume control
- TypeScript type definitions included

## Installation

```bash
npm install @purinton/resampler
```

## Usage

### ESM Example

```js
import { Resampler } from '@purinton/resampler';
import fs from 'fs';

// Downsample 48kHz stereo to 24kHz mono
const resampler = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1 });
fs.createReadStream('input-48k-stereo.s16le')
  .pipe(resampler)
  .pipe(fs.createWriteStream('output-24k-mono.s16le'));

// Downsample with half volume
const resamplerQuiet = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1, volume: 0.5 });
fs.createReadStream('input-48k-stereo.s16le')
  .pipe(resamplerQuiet)
  .pipe(fs.createWriteStream('output-24k-mono-quiet.s16le'));
```

### CommonJS Example

```js
const { Resampler } = require('@purinton/resampler');
const fs = require('fs');

// Upsample 24kHz mono to 48kHz stereo
const resampler = new Resampler({ inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2 });
fs.createReadStream('input-24k-mono.s16le')
  .pipe(resampler)
  .pipe(fs.createWriteStream('output-48k-stereo.s16le'));

// Upsample with lower volume
const resamplerQuiet = new Resampler({ inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2, volume: 0.2 });
fs.createReadStream('input-24k-mono.s16le')
  .pipe(resamplerQuiet)
  .pipe(fs.createWriteStream('output-48k-stereo-quiet.s16le'));
```

## API

### Resampler(options)

Creates a Transform stream that resamples s16le PCM audio.

#### Options

- `inRate` (number): Input sample rate (e.g. 48000)
- `outRate` (number): Output sample rate (e.g. 24000)
- `inChannels` (number, default 1): Number of input channels (1=mono, 2=stereo)
- `outChannels` (number, default 1): Number of output channels (1=mono, 2=stereo)
- `filterWindow` (number, default 8): Sinc filter window size (higher = better quality, more CPU)
- `volume` (number, default 1.0): Output volume multiplier (0.0 = silence, 1.0 = unchanged, >1.0 = amplify)

#### Example

```js
const resampler = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1, volume: 0.5 });
```

Pipe PCM data through the resampler:

```js
inputStream.pipe(resampler).pipe(outputStream);
```

## TypeScript

Type definitions are included:

```ts
import { Resampler, ResamplerOptions } from '@purinton/resampler';

const resampler: Resampler = new Resampler({
  inRate: 48000,
  outRate: 24000,
  inChannels: 2,
  outChannels: 1,
  volume: 0.5,
});
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub](https://github.com/purinton/resampler)
- [npm](https://www.npmjs.com/package/@purinton/resampler)
- [Discord](https://discord.gg/QSBxQnX7PF)
