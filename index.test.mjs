import { jest, test, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { Resampler } from './index.mjs';

function collect(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(c));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

test('downsamples 48kHz stereo to 24kHz mono', async () => {
  const inputPath = path.resolve('input-48k-stereo.s16le');
  const inBuf = fs.readFileSync(inputPath);
  const resampler = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1 });
  const outBuf = await collect(fs.createReadStream(inputPath).pipe(resampler));
  const expected = inBuf.length * (24000 * 1) / (48000 * 2);
  const tolerance = 64; // bytes, up to 32 samples
  expect(Math.abs(outBuf.length - expected)).toBeLessThanOrEqual(tolerance);
});

test('upsamples 24kHz mono to 48kHz stereo', async () => {
  const inputPath = path.resolve('input-24k-mono.s16le');
  const inBuf = fs.readFileSync(inputPath);
  const resampler = new Resampler({ inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2 });
  const outBuf = await collect(fs.createReadStream(inputPath).pipe(resampler));
  const expected = inBuf.length * (48000 * 2) / (24000 * 1);
  const tolerance = 64; // bytes, up to 32 samples
  expect(Math.abs(outBuf.length - expected)).toBeLessThanOrEqual(tolerance);
});
