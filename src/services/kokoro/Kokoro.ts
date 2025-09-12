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
  
  try {
    // The from_pretrained method is designed to be called multiple times;
    // transformers.js will cache the model behind the scenes.
    console.log(`Loading Kokoro model: ${model_id}`);
    const tts = await KokoroTTS.from_pretrained(model_id, {
      dtype: "fp32",
    });

    console.log(`Generating audio with Kokoro for text: "${text.substring(0, 50)}..." and voice: ${voice}`);
    const output: TextToSpeechOutput = await tts.generate(text, {
      voice,
    });
    
    const audioLength = output.audio.length / output.sampling_rate;
    
    console.log(`Audio generated successfully with Kokoro. Duration: ${audioLength.toFixed(2)}s`);

    return {
      audio: output.audio,
      sampling_rate: output.sampling_rate,
      audioLength: audioLength,
    };
  } catch (error) {
    console.error(`Error during Kokoro audio generation for voice "${voice}":`, error);
    // Re-throw the error to be handled by the calling flow
    throw error;
  }
}
