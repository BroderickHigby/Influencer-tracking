#!/bin/sh


cd frontend
killall node -9
npm start

cd x-terminal-emulator -e cd ..
cd backend
python3 be_rest_api.py
