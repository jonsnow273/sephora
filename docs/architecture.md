# 🏛️ Sephora System Architecture

This document describes the high-level architecture, component interactions, and data flow of Sephora.

---

## 📐 High-Level Overview

Sephora is organized into decoupled layers connected via clean interfaces:

```
+-------------------------------------------------------------------------+
|                        Frontend UI (React + Tailwind)                   |
|   - Chat Window          - Steering Dashboard     - Automation Logs     |
+-------------------------------------------------------------------------+
                                     |
                       HTTP REST / WebSockets
                                     |
+-------------------------------------------------------------------------+
|                        FastAPI Backend Server                           |
|   - REST API Routes      - Streaming WebSocket    - State Management    |
+-------------------------------------------------------------------------+
           |                                       |
+----------------------+              +-----------------------------------+
|     Voice Subsystem  |              |       Cognitive Engine            |
| - openWakeWord       |              | - LLM Loader (Mistral / Gemma)    |
| - Whisper STT        |              | - TransformerLens Steering Hooks  |
| - Language Detector  |              | - Conversation History Manager    |
+----------------------+              +-----------------------------------+
           |                                       |
           +-------------------+-------------------+
                               |
                   [ Intent Classification ]
                              / \
               +-------------+   +-------------------------------+
               |                 |                               |
        [ Pure Chat ]     [ Automation Command ]                 |
               |                 |                               |
      (Steered LLM Output) [ Whitelist & Validation ]            |
                                 |                               |
                           [ Confirmation Gate ]                 |
                                 |                               |
                           [ OS Handlers (Files/Apps/Code) ] ----+
```

---

## 🧩 Core Subsystems

### 1. Frontend (`frontend/`)
- Built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**.
- Real-time communication via WebSockets for streaming LLM tokens and live audio input feedback.
- Interactive visualization components for activation steering using **Recharts**.
- State managed through **Zustand** stores (`chatStore`, `steeringStore`, `settingsStore`).

### 2. API Gateway (`api/`)
- Powered by **FastAPI** and **Uvicorn**.
- Provides REST endpoints for CRUD actions and WebSocket endpoints (`/ws/chat`, `/ws/voice`) for bi-directional streaming.
- Implements CORS middleware for development mode and serves production React static assets.

### 3. Local LLM Engine (`llm/`)
- Supports **Mistral 7B Instruct** and **Gemma-2-2B-IT**.
- Loaded via HuggingFace `transformers` and `accelerate`.
- Supports 4-bit/8-bit quantization (`bitsandbytes`) for consumer GPU hardware (4-8 GB VRAM).

### 4. Activation Steering Engine (`steering/`)
- Hooks into intermediate transformer layers using **TransformerLens**.
- Applies steering vectors: `h_steered = h + c * v_direction`, where `c` is steering coefficient.
- Does not edit prompts; directly guides model representation space.

### 5. PC Automation Agent (`automation/`)
- **Intent Classifier**: Categorizes text into chit-chat vs. actionable command.
- **Whitelist Validator**: Rejects any intent not explicitly listed in `configs/automation_whitelist.yaml`.
- **Confirmation Manager**: Prompts the user before executing destructive actions.
- **Handlers**: Modular executors for file operations, application launching, search, and VS Code code generation.

### 6. Voice Pipeline (`voice/`)
- **openWakeWord**: Runs lightweight ONNX model on background thread to detect "Hey Sephora".
- **Audio Capture**: Captures 16kHz audio buffer from the microphone.
- **Whisper Transcriber**: Transcribes speech into text locally with multilingual support.
- **Language Detection**: Automatically tags spoken language.
