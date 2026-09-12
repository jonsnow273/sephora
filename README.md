# 🤖 Sephora — AI-Based Local Assistant

> **AI-Based Local Assistant with Multilingual Voice-Controlled PC Automation and Activation Steering**

Sephora is a fully local, privacy-first AI assistant that goes far beyond a standard chatbot. It combines a conversational LLM core, voice-activated wake word detection, multilingual speech-to-text, OS-level PC automation, and cutting-edge **activation steering** — giving you fine-grained, explainable control over the model's internal behavior without touching the prompt.

---

## ✨ Key Features

### 1. 🧠 Conversational Core (Chatbot)
- Runs a **local, open-weight LLM** — no cloud API calls, fully private
- Natural multi-turn conversation with persistent history
- Intent classification: automatically distinguishes casual chat from OS automation commands
- Powered by **Mistral 7B Instruct** or **Gemma-2-2B** (swappable via configuration)

### 2. 🖥️ PC Automation Agent
- Control your PC with natural language commands:
  - *"Create a folder called Projects on my Desktop"*
  - *"Open VS Code and write a Python hello world script"*
  - *"Search for all PDF reports from last week"*
- Strict **whitelisted action set** — only pre-approved operations can run
- **Confirmation gate** for destructive actions (deletion, overwriting)
- Safe deletion via system Recycle Bin (`send2trash`), avoiding permanent data loss

### 3. 🎙️ Multilingual Voice Input
- Wake word: **"Hey Sephora"** — runs silently and efficiently in background via `openWakeWord`
- Speech recognition via **OpenAI Whisper** (100% local, runs on GPU/CPU)
- Supports **6 user-defined languages** (configured in `configs/languages.yaml`)
- Automatic language detection — speak naturally in any configured language
- Real-time audio streaming via WebSockets

### 4. 🔬 Activation Steering (Research Core)
- Adjust the assistant's behavior (e.g., *more cautious*, *more concise*, *more detailed*, *more creative*) by **directly modifying internal activations** during the forward pass
- Built on **TransformerLens** for hook access to every layer, attention head, and residual stream
- Interactive visual dashboard (React + Recharts) showing:
  - Active steering vectors and layer targets
  - Real-time strength sliders (`-3.0` to `+3.0`)
  - Side-by-side comparison of unsteered vs. steered outputs
- Fully explainable and mechanistic — not a black box

---

## 🏗️ Architecture & Model Stack (All Free & Local)

| Component | Technology / Model | Notes |
|---|---|---|
| **LLM Core** | [Mistral 7B Instruct v0.3](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3) | Best balance of reasoning, coding, and speed (~4GB VRAM in 4-bit) |
| **LLM Alternate (lighter)** | [Gemma-2-2B-IT](https://huggingface.co/google/gemma-2-2b-it) | Fast, low VRAM footprint, excellent for steering research |
| **Speech-to-Text** | [OpenAI Whisper](https://github.com/openai/whisper) (`medium` / `large-v3`) | Free, local, native support for 99+ languages |
| **Wake Word Engine** | [openWakeWord](https://github.com/dscripka/openWakeWord) | Lightweight ONNX model running locally |
| **Activation Steering** | [TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) | Industry standard for mechanistic interpretability |
| **Backend API Bridge** | [FastAPI](https://fastapi.tiangolo.com/) + Uvicorn + WebSockets | High-performance asynchronous REST & token streaming |
| **Frontend UI** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/) | Modern dark-themed dashboard with Recharts & Radix UI |
| **System Tray** | [pystray](https://github.com/moses-palmer/pystray) | Windows system tray integration for background daemon |

---

## 📁 Repository Structure

```
sephora/
├── main.py                        # Central application entry point
├── README.md                      # Project overview (this file)
├── CONTRIBUTING.md                # Multi-developer contribution guide & PR workflow
├── CODE_OF_CONDUCT.md            # Contributor Covenant code of conduct
├── ROADMAP.md                     # Milestones and future roadmap
├── SECURITY.md                    # Safety policies and vulnerability reporting
├── .gitignore                     # Git exclusions (models, audio, env, etc.)
├── requirements.txt               # Backend production dependencies
├── requirements-dev.txt           # Testing & linting tools (pytest, black, ruff)
├── pyproject.toml                 # Build configuration & code standards
├── .env.example                   # Environment variable template
│
├── frontend/                      # Modern React + Vite + Tailwind UI
│   ├── package.json               # Frontend dependencies (React, Recharts, Zustand)
│   ├── vite.config.ts             # Vite configuration with FastAPI proxy
│   ├── tailwind.config.js         # Custom Sephora violet theme palette
│   └── src/
│       ├── components/            # Modular UI (Chat, Steering, Automation, Layout)
│       ├── pages/                 # ChatPage, SteeringDashboard, SettingsPage
│       ├── hooks/                 # WebSocket, Chat, Steering, Voice custom hooks
│       ├── store/                 # Zustand state stores
│       └── types/                 # TypeScript interfaces
│
├── api/                           # FastAPI Backend Server & Streaming
│   ├── server.py                  # FastAPI app entry point
│   ├── routes/                    # REST endpoints (chat, automation, steering, voice)
│   ├── websocket/                 # Live token streaming & microphone audio WS
│   ├── schemas/                   # Pydantic request/response schemas
│   └── middleware/                # CORS and error handling
│
├── core/                          # Shared core foundation
│   ├── config.py                  # YAML and environment configuration loader
│   ├── logger.py                  # Structured logging (loguru)
│   └── constants.py               # Application-wide constants
│
├── llm/                           # Local LLM management
│   ├── loader.py                  # HuggingFace & quantized model loader
│   ├── inference.py               # Generation and streaming pipeline
│   └── tokenizer_wrapper.py       # Tokenizer abstractions
│
├── chatbot/                       # Conversational engine
│   ├── conversation.py            # Multi-turn context & history management
│   ├── intent_classifier.py       # Chat vs. OS command classifier
│   └── response_formatter.py      # Output sanitization & markdown formatting
│
├── automation/                    # Safe PC Automation Subsystem
│   ├── dispatcher.py              # Routes verified commands to handlers
│   ├── whitelist.py               # Validates commands against allowed registry
│   ├── confirmation.py            # Guard for destructive actions
│   ├── sandbox.py                 # File path & process security boundary
│   └── handlers/                  # Modular executors (files, apps, search, code)
│
├── voice/                         # Voice processing pipeline
│   ├── wake_word.py               # "Hey Sephora" openWakeWord engine
│   ├── transcriber.py             # Whisper multilingual STT wrapper
│   ├── language_detector.py       # Language classification
│   └── audio_capture.py           # Real-time microphone audio capture
│
├── steering/                      # Mechanistic Interpretability & Steering
│   ├── hook_manager.py            # TransformerLens forward hook injection
│   ├── direction_finder.py        # Computes steering vectors from contrastive pairs
│   ├── steering_engine.py         # Dynamic runtime activation perturbation
│   └── presets.py                 # Built-in behavior vectors
│
├── ui/                            # Native interface bridges (CLI & Tray)
│   ├── cli.py                     # Rich terminal interactive chat
│   └── tray.py                    # Windows system tray listener
│
├── background/                    # Background daemon management
│   ├── daemon.py                  # Background lifecycle supervisor
│   └── listener.py                # Always-on wake word listener thread
│
├── configs/                       # Externalized YAML configurations
│   ├── sephora_settings.yaml      # Master settings (voice, confirmation, tray)
│   ├── model_config.yaml          # LLM selection, quantization, context size
│   ├── automation_whitelist.yaml  # Allowed PC automation commands
│   └── languages.yaml             # Configured active languages
│
├── docs/                          # In-depth architectural & technical documentation
│   ├── architecture.md            # System architecture & data flow diagrams
│   ├── activation_steering.md     # Mathematical foundations & steering mechanics
│   ├── automation_whitelist.md    # PC automation security & safety guidelines
│   ├── voice_setup.md             # Microphone & wake word configuration guide
│   └── multilingual_support.md    # Guide to multilingual audio & routing
│
├── scripts/                       # Operational utility scripts
│   ├── download_models.py         # Downloads LLM & Whisper weights
│   └── setup_wake_word.py         # Sets up openWakeWord ONNX files
│
└── tests/                         # Comprehensive automated test suite
```

---

## 🤝 Contributing & Team Collaboration

We welcome contributions from everyone on the team! Because multiple engineers are actively developing Sephora across different modules (Frontend, AI/Steering, Voice, PC Automation, and Backend), please read our complete contribution guide:

👉 **[Read the CONTRIBUTING.md guide](CONTRIBUTING.md)**

### Key Highlights for Contributors:
1. **Branching Strategy**: Use `feature/<name>`, `fix/<name>`, or `docs/<name>`. Never commit directly to `main`.
2. **Pull Requests**: Every change must go through a Pull Request with description, test plan, and at least **one peer review**.
3. **Quality Standards**: Run `black .`, `ruff check .`, and `pytest` before opening your PR.
4. **Code of Conduct**: Review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community standards.
5. **Project Roadmap**: Check [ROADMAP.md](ROADMAP.md) to align on active milestones.
6. **Security & Sandbox**: Read [SECURITY.md](SECURITY.md) before writing any PC automation handlers.

---

## 🚀 Quick Start Guide

### Prerequisites
- **OS**: Windows 10/11 (with PowerShell or CMD)
- **Python**: 3.10 or 3.11
- **Node.js**: 18+ and `npm`
- **RAM**: 8 GB minimum (16 GB recommended)
- **GPU (optional but recommended)**: NVIDIA GPU with 6+ GB VRAM for local LLM inference (CPU mode supported)

### 1. Clone & Setup Environment
```bash
git clone https://github.com/your-org/sephora.git
cd sephora

# Python virtual environment
python -m venv venv
venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Setup environment variables
copy .env.example .env
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cd ..
```

### 3. Download Models
```bash
python scripts/download_models.py
python scripts/setup_wake_word.py
```

### 4. Running Sephora

**Option A: Full Web + Voice Application**
```bash
# Terminal 1: Start FastAPI backend
python -m uvicorn api.server:app --reload --port 8000

# Terminal 2: Start React frontend
cd frontend
npm run dev
```
Open your browser at **`http://localhost:5173`**.

**Option B: Terminal CLI Mode (Quick test)**
```bash
python main.py --cli
```

---

## 📚 Detailed Documentation

- [System Architecture](docs/architecture.md)
- [Activation Steering Mechanics](docs/activation_steering.md)
- [Automation Whitelist & Safety Guide](docs/automation_whitelist.md)
- [Voice & Wake Word Setup](docs/voice_setup.md)
- [Multilingual Support Guide](docs/multilingual_support.md)
- [Project Roadmap](ROADMAP.md)
- [Security Policy](SECURITY.md)

---

## 🛡️ Privacy & Safety Commitments
- **100% Local**: No speech, keystrokes, or prompt data leave your machine.
- **Explicit Whitelist Only**: Sephora refuses to run unlisted or arbitrary OS commands.
- **Confirmation Gate**: Any destructive operation (file/directory deletion) mandates explicit user approval.
- **Safe Trash**: File deletion uses the OS Recycle Bin (`send2trash`).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
