# WebSocket handler for streaming chat
# WS /ws/chat
# Streams LLM token output in real-time to the React frontend.
# Messages are sent as JSON:
#   { type: 'token', content: '...' }    - streaming token
#   { type: 'done', content: '' }        - generation complete
#   { type: 'error', content: '...' }    - error message
#   { type: 'command', content: {...} }  - automation command detected
