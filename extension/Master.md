# PrivacyLens MVP

> **Mission**: "AI can understand the user's screen without receiving the user's sensitive information."

PrivacyLens is a proof-of-concept visual dashboard built for hackathon demonstrations. It showcases a perfectly watertight client-side privacy pipeline that prevents sensitive User Data (PII) from ever leaking to third-party LLMs or cloud endpoints.

## 🚀 The Pipeline

PrivacyLens visually executes a 7-stage verifiable pipeline inside the browser.

1. **Screen Capture** 📸
   Securely extracts the active Document Object Model (DOM) directly in memory, ensuring the raw screen buffer never touches a network adapter.
   
2. **Local Vision** 👁️
   Runs a lightweight visual inference model (`MobileNetV3`) natively in the browser via `ONNX Runtime Web` using local `WebGPU` hardware acceleration to classify screen regions.

3. **PII Classification** 🗂️
   Deterministically flags exact DOM signatures to hunt down Personal Identifiable Information (Legal Names, Phone Numbers, Emails, Passwords, and Credit Cards).

4. **Tokenization & Masking** 🔒
   Intercepts detected PII purely in abstract memory, masking sensitive strings with safe proxies (e.g., swapping a real name for "John Doe") without mutating the visually active left-hand panel.

5. **Transmission Gate** 🛡️
   Acts as a strict firewall. It scans the final constructed JSON payload byte-by-byte. If any raw, original PII values managed to slip through the sanitization stage, the Gate blocks the transmission entirely.

6. **Encrypted Edge Payload** ☁️
   Shows off the completely sanitized structural context that is safe to leave the device.

7. **Gemini Cloud Resolution** ✨
   Mocks the AI's response recognizing the structure of the screen context perfectly, proving that AI models can be highly effective purely on sanitized proxy payloads.

## 💻 Tech Stack

- **React 18 & Vite**: Modern, lightning-fast component framework architecture.
- **Tailwind CSS & Framer Motion**: Provides a premium, glassmorphism "VaultTech" aesthetic with fluid mounting animations.
- **ONNX Runtime Web**: Facilitates in-browser Machine Learning using `.onnx` models.
- **WebGPU**: Accelerates tensor computations directly on the local machine graphics hardware.
- **html2canvas & JSZip**: Handles localized DOM extraction and bundles all proof-of-concept artifacts into a single native output download.

## 📥 Artifact Generation
PrivacyLens includes a built-in artifact generator that automatically compiles logs and images of the entire pipeline into `PrivacyLens_Output.zip`, making it incredibly easy to document and prove the pipeline's execution during hackathon judging.

## ⚙️ How to Run
1. Open a terminal in the root `extension` folder.
2. Ensure you have installed packages: `npm install`
3. Run the Vite development server: `npm run dev`
4. Open the displayed `localhost` link in your browser.
5. Interact with the VaultTech mock application on the left, then click **Run Privacy Demo** on the right!
