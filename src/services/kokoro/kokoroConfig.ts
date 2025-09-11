// af -> AmericanFemale (af/am)
// ef -> EspañaFemale (ef/em)
export enum VoiceEnum {
    af_heart = "af_heart",
    af_alloy = "af_alloy",
    af_aoede = "af_aoede",
    af_bella = "af_bella",
    af_jessica = "af_jessica",
    af_kore = "af_kore",
    af_nicole = "af_nicole",
    af_nova = "af_nova",
    af_river = "af_river",
    af_sarah = "af_sarah",
    af_sky = "af_sky",
    am_adam = "am_adam",
    am_echo = "am_echo",
    am_eric = "am_eric",
    am_fenrir = "am_fenrir",
    am_liam = "am_liam",
    am_michael = "am_michael",
    am_onyx = "am_onyx",
    am_puck = "am_puck",
    am_santa = "am_santa",
    bf_emma = "bf_emma",
    bf_isabella = "bf_isabella",
    bm_george = "bm_george",
    bm_lewis = "bm_lewis",
    bf_alice = "bf_alice",
    bf_lily = "bf_lily",
    bm_daniel = "bm_daniel",
    bm_fable = "bm_fable",
  }

export type kokoroModelPrecision = "fp32" | "fp16" | "q8" | "q4" | "q4f16";
export type Voices = `${VoiceEnum}`;
export const KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
