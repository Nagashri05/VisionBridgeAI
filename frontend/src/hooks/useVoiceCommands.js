import { useEffect, useState, useRef } from 'react';

export const useVoiceCommands = (onCommand, langCode = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = false;
      recog.lang = langCode;

      recog.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript.toLowerCase().trim();
          console.log("Heard voice command:", command);
          onCommand(command);
        }
      };

      recog.onerror = (e) => {
         console.error('Speech recognition error', e.error);
         if (e.error === 'not-allowed') {
             setMicError('Permission Denied');
             setIsListening(false);
         } else {
             setMicError(e.error);
         }
      };
      
      recog.onend = () => {
         if (isListening && recognitionRef.current && !micError) {
             try { recognitionRef.current.start(); } catch(e) {}
         } else {
             setIsListening(false);
         }
      };

      recognitionRef.current = recog;
    } else {
        setMicError('Not Supported in Browser');
    }
    
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [onCommand, isListening, langCode, micError]);

  const startListening = () => {
    if (recognitionRef.current && !micError) {
        try { 
            recognitionRef.current.start(); 
            setIsListening(true); 
            setMicError(null);
        } catch(e) {
            console.error(e);
        }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return { isListening, micError, startListening, stopListening };
};
