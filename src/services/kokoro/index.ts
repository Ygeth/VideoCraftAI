// src/services/kokoro/index.ts

import { Kokoro } from './Kokoro';
import { KokoroHugging } from './kokoro_hugging';
import { kokoroModelPrecision } from "./kokoroConfig";

let precision: kokoroModelPrecision = "fp32";

// Inicializamos Kokoro aquí. El `await` en el nivel superior
// asegura que cualquier módulo que importe `kokoroInstance`
// esperará a que la inicialización se complete.
// export const kokoroInstance = await Kokoro.init(precision);
export const kokoroInstance = await KokoroHugging.init(precision);
