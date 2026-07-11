# Tactix3D ⚽

**Figma meets ChatGPT for sports strategy.**

Tactix3D is an AI-powered web application that lets coaches, players, and fans create, visualize, and collaborate on soccer strategies in an interactive **3D stadium**. Describe a play in natural language — *"Run a counterattack with the winger cutting inside"* — and watch it animate instantly. Share a live link and edit together in real time.

Built for **UnitedHacks 2026 · Sport Track · World Cup**.

## Demo (no API key needed)

1. Start backend + frontend (below)
2. Click **"Open Tactics Board"** or any quick prompt
3. Hit **Play** — watch the 3D animation
4. Switch cameras: Broadcast · Tactical · Sideline · Free orbit
5. Click **Share** — copy link for live collaboration

## Quick Start

**Terminal 1 — Backend:**
```bash
./start-backend.sh
```

**Terminal 2 — Frontend:**
```bash
./start-frontend.sh
```

Open **http://localhost:5173**

## Features

| Feature | Description |
|---|---|
| **AI Play Generation** | Natural language → animated 3D play (Gemini) |
| **3 Demo Plays** | Counterattack, corner routine, high press |
| **3D Stadium** | Floodlights, stands, striped pitch, player capsules |
| **4 Camera Modes** | Broadcast, tactical top-down, sideline, free orbit |
| **Timeline Scrubber** | Scrub through the play frame-by-frame |
| **Manual Edit Mode** | Drag players on the pitch to reposition |
| **Live Collaboration** | Share link → multiple users sync via WebSocket |
| **Playback Sync** | Play/pause synced across all collaborators |

## Real AI Generation

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Create `backend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.0-flash
   ```
3. Type any custom tactic in the AI panel

Without an API key, smart demo matching still works for common prompts.

## Tech Stack

| Layer | Tech |
|---|---|
| 3D Engine | Three.js, React Three Fiber, Drei |
| Frontend | React 19, TypeScript, Tailwind v4, Framer Motion, Zustand |
| Backend | FastAPI, Python Socket.IO |
| AI | Google Gemini 2.0 Flash (structured JSON plays) |
| Collab | WebSocket rooms with play + playback sync |

## Architecture

```
Natural Language Prompt
        ↓
   Gemini AI / Demo Engine
        ↓
  Play JSON (players + ball keyframes)
        ↓
  Three.js 3D Animation + Socket.IO sync
        ↓
  Shared link → Live collaboration
```

## 2-Minute Judge Demo Script

1. *"Coaches still draw plays on whiteboards. We built Figma for tactics."*
2. Click quick prompt: **"Winger cuts inside counterattack"**
3. Watch 3D players animate — switch to **Tactical** camera
4. Scrub timeline — show ball movement synced with players
5. Toggle **Edit mode** — drag a winger
6. Click **Share** — open link in second tab, show live sync
7. *"Gemini generates any play from plain English. World Cup coaches would use this."*

## Devpost Copy

**Inspiration:** Whiteboard coaching is outdated. We wanted anyone to describe a tactic and see it come alive.

**What it does:** AI generates 3D animated soccer plays from natural language. Collaborate live via share link.

**How we built it:** React Three Fiber stadium, FastAPI + Gemini for play JSON, Socket.IO for real-time sync.

**Challenges:** Keyframe interpolation, WebSocket state sync, getting AI to output valid tactical coordinates.

**Accomplishments:** Full 3D stadium, 3 demo plays, 4 cameras, drag-edit, live collab — in one hackathon.

**What's next:** AR on-field overlay, video export, multi-sport (basketball, football), AI opponent reactions.

**Built with:** three.js, react, fastapi, python, gemini, socket.io, tailwindcss, typescript

## License

MIT — UnitedHacks 2026
