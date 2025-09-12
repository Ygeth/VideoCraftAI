import { KokoroTTS, type TextToSpeechOutput } from "kokoro-js";
import {
  type Voices,
} from "./kokoroConfig";

export async function generate(
  text: string,
  voice: Voices,
): Promise<{
  audio: Float32Array;
  sampling_rate: number;
  audioLength: number;
}> {
  const model_id = "onnx-community/Kokoro-82M-ONNX";
  // The from_pretrained method is designed to be called multiple times;
  // transformers.js will cache the model behind the scenes.
  const tts = await KokoroTTS.from_pretrained(model_id, {
    dtype: "fp32",
  });

  const output: TextToSpeechOutput = await tts.generate(text, {
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
