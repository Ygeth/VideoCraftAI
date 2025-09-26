# VideoCraft AI 🎬

VideoCraft AI es una aplicación web construida con Next.js y Genkit que utiliza el poder de la inteligencia artificial para generar videos "faceless" (sin mostrar el rostro) para plataformas como TikTok, Instagram Reels y YouTube Shorts. La aplicación te permite transformar una historia o idea en un video completo, generando el guion, las imágenes, la narración y el video final de forma automatizada.

## 📄 ToDo
- Dividir la generacion de escenas en jobs. Story, ArtStyle, Titulo y thumbnail, Texto para redes sociales,..
- Generacion de Thumbnail con Gemini:  https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/use-cases/video-thumbnail-generation/video_thumbnail_generation.ipynb
- 


## ✨ Características Principales

- **Generación de Guiones con IA**: A partir de una simple historia o idea, la IA crea un guion completo dividido en escenas.
- **Inspiración de Contenido**: Obtiene ideas de historias populares desde Reddit para inspirar tus creaciones.
- **Generación de Escenas, Imagen y Audio**: Cada escena del guion tiene un *prompt* de imagen detallado. Puedes generar imágenes únicas para cada una usando modelos como **Seedream4**, **Imagen 4** o **Gemini**.
- **Narración con Voces Sintéticas**: Convierte el texto del narrador de cada escena en audio usando **Gemini TTS** o el modelo autoalojado **Kokoro**.
- **Animación de Video con IA**: Anima las imágenes estáticas para crear clips de video dinámicos utilizando el modelo **Veo3**.
- **Panel de Administración**: Un entorno de pruebas (`/admin`) para experimentar de forma aislada con cada uno de los flujos de IA (generación de guion, imágenes, audio, video, etc.).
- **Interfaz Intuitiva**: Un asistente paso a paso que te guía desde la idea inicial hasta el video final.

## 🚀 Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Orquestación de IA**: [Genkit](https://firebase.google.com/docs/genkit)
- **Modelos de IA**:
    - **Texto**: Google Gemini
    - **Imagen**: Google Imagen 4, Gemini, Seedream4
    - **Video**: Google Veo3
    - **Audio**: Google Gemini TTS, Kokoro TTS
- **UI**: [React](https://react.dev/), [Shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Generación de Video Programática**: [Remotion](https://www.remotion.dev/) (en desarrollo)

## 🔧 Instalación y Ejecución en Local

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 20 o superior)
- [npm](https://www.npmjs.com/) (generalmente incluido con Node.js)
- [Git](https://git-scm.com/)

### 1. Clonar el Repositorio

Abre una terminal y clona el repositorio del proyecto en tu máquina.

```bash
# Reemplaza <URL_DEL_REPOSITORIO> con la URL de tu repositorio de Git
git clone <URL_DEL_REPOSITORIO>
```

### 2. Navegar al Directorio del Proyecto

```bash
cd VideoCraft-AI 
# O el nombre que tenga la carpeta de tu proyecto
```

### 3. Instalar las Dependencias

Instala todas las librerías y paquetes necesarios para el proyecto.

```bash
npm install
```

### 4. Configurar las Variables de Entorno

Para que la aplicación pueda conectarse a los servicios de IA de Google, necesitas una clave de API.

1.  Crea un archivo llamado `.env` en la raíz del proyecto.
2.  Abre el archivo y añade tu clave de API de Gemini:

    ```env
    GEMINI_API_KEY="AIzaSy...tu_clave_aqui"
    ```

    Puedes obtener una clave de API desde [Google AI Studio](https://aistudio.google.com/app/apikey).

### 5. Ejecutar el Servidor de Desarrollo

Una vez que todo está configurado, puedes iniciar la aplicación.

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Next.js. Por defecto, la aplicación estará disponible en `http://localhost:9002`.

### 6. Ejecutar los Flujos de Genkit (Opcional)

Si quieres depurar los flujos de IA de forma independiente o ver los logs detallados de Genkit, puedes ejecutar el servidor de Genkit en paralelo.

```bash
npm run genkit:dev
```

Esto iniciará el inspector de Genkit, generalmente en `http://localhost:4000`.

##  Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo de Next.js.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor de producción de Next.js.
- `npm run lint`: Ejecuta el linter de código.
- `npm run genkit:dev`: Inicia el servidor de desarrollo de Genkit.
