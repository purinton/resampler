import { Transform } from 'stream';

/**
 * Options for Resampler
 */
export interface ResamplerOptions {
  /** Input sample rate (e.g. 48000) */
  inRate: number;
  /** Output sample rate (e.g. 24000) */
  outRate: number;
  /** Number of input channels (default: 1) */
  inChannels?: number;
  /** Number of output channels (default: 1) */
  outChannels?: number;
  /** Filter window size for the sinc interpolation (default: 8) */
  filterWindow?: number;
}

/**
 * A high-quality PCM resampler implementing a windowed-sinc filter in pure JavaScript.
 * Processes 16-bit signed little-endian samples (s16le).
 */
export class Resampler extends Transform {
  /**
   * @param options Configuration for sample-rate conversion and channel mapping
   */
  constructor(options: ResamplerOptions);
}
