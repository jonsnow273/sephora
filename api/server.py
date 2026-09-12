# Sephora FastAPI Server
# Serves as the bridge between the React frontend and the Python AI backend.
# Routes:
#   REST  /api/chat        - Send messages, get responses
#   REST  /api/automation  - PC automation commands
#   REST  /api/steering    - Activation steering controls
#   REST  /api/voice       - Voice status and config
#   REST  /api/settings    - Read/write app settings
#   WS    /ws/chat         - Streaming chat via WebSocket
#   WS    /ws/voice        - Voice stream from mic
