
import { KokoroTTS, TextToSpeechOutput } from "kokoro-js";
import {
  VoiceEnum,
  type kokoroModelPrecision,
  type Voices,
  KOKORO_MODEL,
} from "./kokoroConfig";

/**
 * Esta clase implementa la funcionalidad de texto a voz utilizando la librería `kokoro-js`.
 * Sigue el patrón de inicialización y generación de audio basado en el ejemplo proporcionado.
 */
export class KokoroHugging {
  constructor(private tts: KokoroTTS) {}

  /**
   * Genera audio a partir de un texto y una voz específicos.
   * @param text El texto a convertir en audio.
   * @param voice La voz a utilizar para la generación.
   * @returns Un objeto con los datos de audio y la duración.
   */
  async generate(text: string, voice: Voices): Promise<{audio: Float32Array; sampling_rate: number; audioLength: number;}> {
    const output: TextToSpeechOutput = await this.tts.generate(text, {
      voice,
    });
    
    const audioLength = output.audio.length / output.sampling_rate;
    
    console.log(`Audio generated with KokoroHugging: ${audioLength}s`);

    return {
      audio: output.audio,
      sampling_rate: output.sampling_rate,
      audioLength: audioLength,
    };
  }
  
  /**
   * Inicializa y carga el modelo KokoroTTS.
   * @param dtype La precisión del modelo a cargar.
   * @returns Una nueva instancia de la clase KokoroHugging.
   */
  static async init(dtype: kokoroModelPrecision): Promise<KokoroHugging> {
    const tts = await KokoroTTS.from_pretrained(KOKORO_MODEL, {
      dtype,
      device: "cpu",
    });

    return new KokoroHugging(tts);
  }

  /**
   * @returns Una lista de las voces disponibles.
   */
  listAvailableVoices(): Voices[] {
    return Object.values(VoiceEnum) as Voices[];
  }
}
