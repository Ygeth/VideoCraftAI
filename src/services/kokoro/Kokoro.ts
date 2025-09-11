import { KokoroTTS, type TextToSpeechOutput } from "kokoro-js";
import {
  VoiceEnum,
  type kokoroModelPrecision,
  type Voices,
} from "./kokoroConfig";
import { KOKORO_MODEL } from "./kokoroConfig";

export class Kokoro {
  constructor(private tts: KokoroTTS) {}

  async generate(
    text: string,
    voice: Voices,
  ): Promise<{
    audio: Float32Array;
    sampling_rate: number;
    audioLength: number;
  }> {
    const output: TextToSpeechOutput = await this.tts.generate(text, {
      voice,
    });
    
    const audioLength = output.audio.length / output.sampling_rate;
    
    console.debug({ text, voice, audioLength }, "Audio generated with Kokoro");

    return {
      audio: output.audio,
      sampling_rate: output.sampling_rate,
      audioLength: audioLength,
    };
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
