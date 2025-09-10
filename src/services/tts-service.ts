'use client';

class TTSService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private synthesis: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  speak(text: string, onEnd: () => void): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported in this browser.');
      onEnd();
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'en-EN'; // You can make this configurable
    
    this.utterance.onend = () => {
      onEnd();
    };

    this.utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
      onEnd();
    };
    
    this.synthesis.speak(this.utterance);
  }

  cancel(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

export const ttsService = new TTSService();
