import { Transform } from 'stream';

function sinc(x) {
  if (x === 0) return 1;
  return Math.sin(Math.PI * x) / (Math.PI * x);
}

function lanczosWindow(x, a) {
  return Math.abs(x) > a ? 0 : sinc(x / a);
}

export class Resampler extends Transform {
  constructor({ inRate, outRate, inChannels = 1, outChannels = 1, filterWindow = 8 }) {
    super();
    this.inRate = inRate;
    this.outRate = outRate;
    this.inChannels = inChannels;
    this.outChannels = outChannels;
    this.filterWindow = filterWindow;
    this.ratio = inRate / outRate;
    this.phase = filterWindow;
    this.buffers = Array.from({ length: inChannels }, () => []);
  }

  _transform(chunk, encoding, callback) {
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    const samples = chunk.length / 2 / this.inChannels;
    for (let i = 0; i < samples; i++) {
      for (let ch = 0; ch < this.inChannels; ch++) {
        const val = view.getInt16((i * this.inChannels + ch) * 2, true);
        this.buffers[ch].push(val / 32768);
      }
    }

    const outSamples = [];
    while (this.phase + this.filterWindow <= this.buffers[0].length) {
      const pos = this.phase;
      const i0 = Math.floor(pos);
      const channelVals = [];
      for (let ch = 0; ch < this.inChannels; ch++) {
        let sum = 0;
        for (let k = i0 - this.filterWindow + 1; k <= i0 + this.filterWindow; k++) {
          const x = pos - k;
          const bufVal = this.buffers[ch][k] || 0;
          sum += bufVal * sinc(x) * lanczosWindow(x, this.filterWindow);
        }
        channelVals.push(sum);
      }
      if (this.inChannels === 2 && this.outChannels === 1) {
        outSamples.push((channelVals[0] + channelVals[1]) / 2);
      } else if (this.inChannels === 1 && this.outChannels === 2) {
        outSamples.push(channelVals[0], channelVals[0]);
      } else {
        outSamples.push(...channelVals.slice(0, this.outChannels));
      }

      this.phase += this.ratio;
    }

    const drop = Math.floor(this.phase) - this.filterWindow;
    if (drop > 0) {
      this.buffers.forEach(buf => buf.splice(0, drop));
      this.phase -= drop;
    }

    const outBuf = Buffer.allocUnsafe(outSamples.length * 2);
    for (let i = 0; i < outSamples.length; i++) {
      const s = Math.max(-1, Math.min(1, outSamples[i]));
      outBuf.writeInt16LE(Math.round(s * 32767), i * 2);
    }
    this.push(outBuf);
    callback();
  }

  _flush(callback) {
    const pad = this.filterWindow;
    this.buffers.forEach(buf => {
      for (let i = 0; i < pad; i++) buf.push(0);
    });
    this._transform(Buffer.alloc(0), 'buffer', () => { });
    callback();
  }
}
