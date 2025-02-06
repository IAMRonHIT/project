#!/bin/bash
# Start the frontend in the background
npm run dev:frontend &

# Capture the PID of the frontend process if needed
FRONTEND_PID=$!

# Start the backend (server.py) in the background
python server.py &

# Capture the PID of the backend process if needed
BACKEND_PID=$!

# Optionally, wait for both processes to finish
wait $FRONTEND_PID $BACKEND_PID
