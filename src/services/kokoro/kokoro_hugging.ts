'use server';

import { KokoroTTS, type TextToSpeechOutput } from "kokoro-js";
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
   * @returns Un objeto con el buffer de audio en formato WAV y la duración del audio.
   */
  async generate(
    text: string,
    voice: Voices
  ): Promise<{
    audio: ArrayBuffer;
    audioLength: number;
  }> {
    const output: TextToSpeechOutput = await this.tts.generate(text, {
      voice,
    });

    const audioBuffer = this.encodeWAV(output.audio, output.sampling_rate);
    const audioLength = output.audio.length / output.sampling_rate;
    
    console.log(`Audio generated with KokoroHugging: ${audioLength}s`);

    return {
      audio: audioBuffer,
      audioLength: audioLength,
    };
  }

  /**
   * Codifica los samples de audio PCM en un buffer de formato WAV.
   * @param samples Los datos de audio como Float32Array.
   * @param sampleRate La tasa de muestreo del audio.
   * @returns Un ArrayBuffer que representa el archivo WAV.
   */
  private encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // 1 channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // 16-bit samples
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

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
