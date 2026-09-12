# 🗺️ Sephora Project Roadmap

This document outlines the milestones, planned features, and development phases for the Sephora team.

---

## 🎯 Phase 1: Core Foundation & API Bridge (Current)
- [x] Project architecture and directory structure
- [x] Configuration systems (YAML + `.env`)
- [x] FastAPI REST & WebSocket server structure
- [x] React + Tailwind CSS + Vite frontend scaffold
- [ ] Core logging, config loading, and error handling implementation
- [ ] Local LLM loader (Mistral 7B / Gemma 2B via Hugging Face & 4-bit quantization)
- [ ] Basic CLI chat loop

---

## 🎙️ Phase 2: Multilingual Voice & Wake Word
- [ ] Background microphone listener with silence detection
- [ ] openWakeWord engine integration for "Hey Sephora"
- [ ] Local OpenAI Whisper integration (medium / large-v3)
- [ ] Automatic language detection & routing for 6 supported languages
- [ ] WebSocket streaming of audio and real-time transcription to React UI

---

## 🖥️ Phase 3: Safe PC Automation Agent
- [ ] Intent classifier: distinguish natural chat vs. system commands
- [ ] Whitelist registry for safe operations
- [ ] Handlers implementation:
  - File/folder creation, safe deletion (Recycle Bin via `send2trash`)
  - Application launcher & search
  - Code generator & VS Code launcher
- [ ] User confirmation modal & CLI prompt for destructive actions
- [ ] Comprehensive sandbox validation and path restrictions

---

## 🔬 Phase 4: Activation Steering & Mechanistic Interpretability
- [ ] TransformerLens integration with local model weights
- [ ] Extraction of behavioral steering vectors (cautious, concise, detailed, creative)
- [ ] Dynamic forward hook injection at runtime
- [ ] Interactive React Steering Dashboard:
  - Real-time layer activation heatmaps (Recharts)
  - Interactive direction strength sliders (-3.0 to +3.0)
  - Behavior preset switcher & custom vector persistence

---

## 🎨 Phase 5: UI/UX & System Integration
- [ ] Modern dark-theme React interface with responsive layout
- [ ] Markdown rendering & syntax highlighting in chat bubbles
- [ ] Windows System Tray daemon (`pystray`) for seamless background execution
- [ ] End-to-end automated test suite and deployment documentation

---

## 💡 Future Horizons
- Multimodal vision support (local screen analysis for GUI automation)
- Sparse Autoencoder (SAE) feature steering
- Cross-platform support (macOS & Linux desktop automation)
