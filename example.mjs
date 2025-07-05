import { fs, path } from '@purinton/common';
import { Resampler } from '@purinton/resampler';

async function run() {
    // Downsample: 48kHz stereo -> 24kHz mono
    const input48Stereo = path(import.meta, 'input-48k-stereo.s16le');
    const output24Mono = path(import.meta, 'output-24k-mono.s16le');
    const resamplerDown = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1 });
    console.log('Resampling 48kHz stereo → 24kHz mono...');
    await new Promise((resolve, reject) => {
        fs.createReadStream(input48Stereo)
            .pipe(resamplerDown)
            .pipe(fs.createWriteStream(output24Mono))
            .on('finish', resolve)
            .on('error', reject);
    });
    console.log('Downsample complete:', output24Mono);

    // Upsample: 24kHz mono -> 48kHz stereo
    const input24Mono = path(import.meta, 'input-24k-mono.s16le');
    const output48Stereo = path(import.meta, 'output-48k-stereo.s16le');
    const resamplerUp = new Resampler({ inRate: 24000, outRate: 48000, inChannels: 1, outChannels: 2 });
    console.log('Resampling 24kHz mono → 48kHz stereo...');
    await new Promise((resolve, reject) => {
        fs.createReadStream(input24Mono)
            .pipe(resamplerUp)
            .pipe(fs.createWriteStream(output48Stereo))
            .on('finish', resolve)
            .on('error', reject);
    });
    console.log('Upsample complete:', output48Stereo);

    // Downsample with volume control: 48kHz stereo -> 24kHz mono, half volume
    const output24MonoQuiet = path(import.meta, 'output-24k-mono-quiet.s16le');
    const resamplerDownQuiet = new Resampler({ inRate: 48000, outRate: 24000, inChannels: 2, outChannels: 1, volume: 0.5 });
    console.log('Resampling 48kHz stereo → 24kHz mono at half volume...');
    await new Promise((resolve, reject) => {
        fs.createReadStream(input48Stereo)
            .pipe(resamplerDownQuiet)
            .pipe(fs.createWriteStream(output24MonoQuiet))
            .on('finish', resolve)
            .on('error', reject);
    });
    console.log('Downsample (quiet) complete:', output24MonoQuiet);
}

run().catch(err => console.error(err));
