# WebSocket handler for voice input stream
# WS /ws/voice
# Receives raw audio chunks from the browser microphone,
# passes them through Whisper transcription,
# and emits transcription results back to the frontend.
# Messages:
#   Client -> Server: raw PCM audio bytes
#   Server -> Client: { type: 'transcript', text: '...', language: '...' }
#   Server -> Client: { type: 'wake_word', detected: true }
