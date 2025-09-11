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

const defaultLogLevel = 'info';

// Simple logger implementation to avoid extra dependencies
const createLogger = (level: string) => {
    const levels: { [key: string]: number } = {
        'debug': 1,
        'info': 2,
        'warn': 3,
        'error': 4,
    };
    const currentLevel = levels[level] || levels['info'];
    return {
        debug: (obj: any, msg?: string) => {
            if (currentLevel <= levels['debug']) console.debug(msg, obj);
        },
        info: (obj: any, msg?: string) => {
            if (currentLevel <= levels['info']) console.log(msg, obj);
        },
        warn: (obj: any, msg?: string) => {
            if (currentLevel <= levels['warn']) console.warn(msg, obj);
        },
        error: (obj: any, msg?: string) => {
            if (currentLevel <= levels['error']) console.error(msg, obj);
        }
    };
};


// Create the global logger
export const logger = createLogger(process.env.LOG_LEVEL || defaultLogLevel);

export type kokoroModelPrecision = "fp32" | "fp16" | "q8" | "q4" | "q4f16";
export type Voices = `${VoiceEnum}`;
export const KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";
