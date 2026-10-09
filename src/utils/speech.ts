// Web Speech Recognition & SpeechSynthesis Utilities

export interface SpeechRecognitionHookOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class VoiceRecognitionManager {
  private recognition: any = null;
  public isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isSupported = true;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (err: any) => void,
    onEnd?: () => void
  ) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const activeText = finalTranscript || interimTranscript;
        if (activeText) {
          onResult(activeText, !!finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn('Could not start recognition:', e);
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }
}

// Spoken Response (SpeechSynthesis) Manager
export class VoiceSpeaker {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    return window.speechSynthesis.getVoices();
  }

  public static stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  public static speak(
    text: string,
    options?: {
      voice?: SpeechSynthesisVoice | null;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (!this.isSupported()) return;

    // Cancel current speech if any
    window.speechSynthesis.cancel();

    // Strip markdown code blocks and syntax symbols for cleaner audio narration
    const cleanText = text
      .replace(/```[\s\S]*?```/g, ' [Code sample provided in message] ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~>]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;

    if (options?.voice) {
      utterance.voice = options.voice;
    } else {
      // Pick best natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) &&
          v.lang.startsWith('en')
      );
      if (naturalVoice) utterance.voice = naturalVoice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
  }
}
