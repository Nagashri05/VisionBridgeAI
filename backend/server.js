require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const targetLanguage = req.body.language || 'English';

    const PROMPT = `You are VisionBridge AI, an advanced real-time mobility and accessibility assistant for blind and visually impaired users.

Analyze the image carefully. Provide accurate, highly-contextual, human-friendly assistance. 
IMPORTANT: YOU MUST OUTPUT ALL RESPONSES STRICTLY IN ${targetLanguage}. Translate all detected context and your explanations into ${targetLanguage}.

========================
YOUR TASKS:
========================
1. SMART HAZARD DETECTION (PRIORITY 1)
   - Identify critical hazards (e.g., vehicles, stairs down, wet floor, fire, broken glass, obstacles right in front).
   - Identify hazard positions accurately: "left", "right", or "center" so the app can trigger directional haptics.

2. AI NAVIGATION GUIDANCE
   - Give spatial navigation instructions (e.g., "Path ahead is clear", "Move slightly left to avoid chair", "Door detected at 2 o'clock").

3. SMART SCENE UNDERSTANDING
   - Provide an intelligent, contextual summary (e.g., "You appear to be in a busy cafe." instead of just "There is a table and people.")

4. ADVANCED OCR & PUBLIC TRANSPORT
   - Read signs, labels, currency, medicines.
   - Summarize long text.
   - Specifically detect public transport details (Bus numbers, train platforms, station signs).

5. ROAD CROSSING & TRAFFIC ASSISTANT
   - The user intends to use this app to cross roads. Analyze the traffic scene carefully.
   - Specifically look for: Pedestrian traffic lights (Red hand vs. White walking figure), crosswalk lines (zebra crossings), and approaching vehicles.
   - If the pedestrian light is RED, or vehicles are moving across the path, say: "Do not cross. Vehicles detected."
   - If the pedestrian light is GREEN/WHITE and the path looks totally clear, say: "Pedestrian light is green. Path appears clear, but please proceed with caution."
   - Prioritize this information at the very beginning of the spoken summary.

========================
OUTPUT FORMAT (STRICT JSON)
========================
Return your response strictly in the following JSON format. The values must be written in ${targetLanguage}.

{
  "criticalHazards": "Extremely brief list of immediate dangers, or 'None'.",
  "hazardDirection": "left, right, center, or none",
  "sceneSummary": "Intelligent contextual summary of the environment.",
  "navigationAssistance": "Spatial guidance and path finding.",
  "detectedText": "Important text, currency, or transit info read from the scene.",
  "objectsAndSurroundings": "Notable objects and their spatial positions.",
  "finalSpokenSummary": "A concise, prioritized spoken summary. Start with hazards if any exist. Keep it natural and easy to hear."
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      },
    };

    const result = await model.generateContent([PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    let jsonString = text;
    if (jsonString.startsWith('\`\`\`json')) {
      jsonString = jsonString.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (jsonString.startsWith('\`\`\`')) {
      jsonString = jsonString.replace(/\`\`\`/g, '').trim();
    }
    
    let parsedData = {};
    try {
        parsedData = JSON.parse(jsonString);
    } catch(e) {
        console.error("Failed to parse JSON response from Gemini:", jsonString);
        parsedData = {
            sceneSummary: "Response could not be parsed correctly.",
            finalSpokenSummary: "I encountered an error parsing the response."
        };
    }

    res.json(parsedData);
  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error.status === 429) {
       return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment.' });
    }
    res.status(500).json({ error: 'Error analyzing image', details: error.message });
  }
});

app.post('/api/sos', (req, res) => {
  // Mock SOS endpoint for emergency mode
  const { latitude, longitude, timestamp } = req.body;
  console.log('🚨 SOS EMERGENCY TRIGGERED 🚨');
  console.log(`Location: Lat ${latitude}, Lng ${longitude}`);
  console.log(`Time: ${timestamp}`);
  // In a real app, this would send an SMS/Email to an emergency contact
  res.json({ success: true, message: 'Emergency contacts notified successfully.' });
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
