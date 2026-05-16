# VisionBridge AI 2.0 👁️🌉

VisionBridge AI is a next-generation mobility and accessibility assistant for the blind and visually impaired. It utilizes the power of the Google Gemini AI vision model to provide real-time, highly contextual audio feedback of a user's surroundings.

## 🚀 Key Features

*   **Continuous Scanning Mode**: Automatically captures and analyzes the environment every few seconds. Uses a smart motion-detection algorithm to save API costs by only scanning when the scene changes.
*   **Voice Commands**: Completely hands-free control. Say "Scan", "Repeat", "Emergency", or "Language" to control the app without touching the screen.
*   **Zero-Touch Localization**: Automatically detects the user's mobile system language and instantly boots up with native spoken UI instructions (Supports 11 languages).
*   **Emergency SOS Mode**: Activate by shouting "Emergency" or holding two fingers on the screen. Sends GPS coordinates and an emergency alert to the backend.
*   **Smart Hazard Alarms**: Emits specific audible tones and directional haptic vibrations (left/right) when detecting priority hazards like stairs or vehicles.
*   **Multi-Gesture Engine**: Double-tap to scan manually, long-press to cycle languages blindly.

## 💻 Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
*   **Backend**: Node.js, Express, Multer
*   **AI Engine**: Google Generative AI (Gemini 2.5 Flash)
*   **Browser APIs**: `SpeechRecognition`, `SpeechSynthesis`, `navigator.vibrate`, `navigator.geolocation`, `MediaDevices`

## 🛠️ Installation & Setup

1.  **Clone the repository** and navigate to the project root.
2.  **Backend Setup**:
    *   Navigate to the `backend` directory: `cd backend`
    *   Install dependencies: `npm install`
    *   Create a `.env` file in the `backend` directory and add your API key:
        `GEMINI_API_KEY=your_gemini_api_key_here`
    *   Start the server: `npm start`
3.  **Frontend Setup**:
    *   Open a new terminal and navigate to the `frontend` directory: `cd frontend`
    *   Install dependencies: `npm install`
    *   Build the frontend for production: `npm run build`
4.  **Launch**:
    *   The backend Express server automatically serves the built frontend.
    *   Open your browser and navigate to `http://localhost:5000`.

## 📱 Mobile Testing

To test the application on your mobile device:
1. Ensure your phone and development computer are on the **same Wi-Fi network**.
2. Find your computer's local IP address (e.g., `192.168.1.x`).
3. On your mobile browser, navigate to `http://192.168.1.x:5000`.
4. Grant camera and microphone permissions.

---
*Built with an accessibility-first philosophy.*
