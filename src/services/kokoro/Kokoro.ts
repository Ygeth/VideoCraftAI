import { KokoroTTS, type TextToSpeechOutput } from "kokoro-js";
import {
  VoiceEnum,
  type kokoroModelPrecision,
  type Voices,
} from "./kokoroConfig";
import { KOKORO_MODEL, logger } from "./kokoroConfig";

export class Kokoro {
  constructor(private tts: KokoroTTS) {}

  async generate(
    text: string,
    voice: Voices,
  ): Promise<{
    audio: ArrayBuffer;
    audioLength: number;
  }> {
    const output: TextToSpeechOutput = await this.tts.generate(text, {
      voice,
    });
    
    const audioBuffer = this.encodeWAV(output.audio, output.sampling_rate);
    const audioLength = output.audio.length / output.sampling_rate;
    
    logger.debug({ text, voice, audioLength }, "Audio generated with Kokoro");

    return {
      audio: audioBuffer,
      audioLength: audioLength,
    };
  }

  private encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, 'WAVE');
    // "fmt " sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // Audio format 1 is PCM
    view.setUint16(22, 1, true); // Num channels
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample
    // "data" sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write the PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  static async init(dtype: kokoroModelPrecision): Promise<Kokoro> {
    const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL, {
      dtype,
      device: "cpu", // only "cpu" is supported in node
    });

    return new Kokoro(tts);
  }

  listAvailableVoices(): Voices[] {
    const voices = Object.values(VoiceEnum) as Voices[];
    return voices;
  }
}
