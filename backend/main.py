import os

import socketio
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from collab import rooms
from generator import generate_play, get_llm_provider, hf_token, list_demos
from models import GenerateRequest, GenerateResponse, Play

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

CORS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
fastapi_app = FastAPI(title="WinStrats API", description="Soccer App for Improvement — AI 3D Strategy Engine")

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@fastapi_app.get("/health")
def health() -> dict:
    provider = get_llm_provider()
    return {
        "status": "ok",
        "llm_provider": provider,
        "huggingface_configured": bool(hf_token()),
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY")),
    }


@fastapi_app.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest) -> GenerateResponse:
    try:
        return generate_play(req.prompt, demo=req.demo)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@fastapi_app.get("/demos", response_model=list[Play])
def demos() -> list[Play]:
    return list_demos()


@sio.event
async def connect(sid, environ):
    pass


@sio.event
async def disconnect(sid):
    for room_id in list(sio.rooms(sid)):
        if room_id != sid:
            rooms.leave(room_id, sid)
            room = rooms.get_or_create(room_id)
            await sio.emit("room_state", rooms.snapshot(room), room=room_id)


@sio.event
async def join_room(sid, data):
    room_id = data.get("room_id", "default")
    name = data.get("name", "Coach")
    color = data.get("color", "#3b82f6")
    await sio.enter_room(sid, room_id)
    room = rooms.join(room_id, sid, name, color)
    await sio.emit("room_state", rooms.snapshot(room), room=room_id)


@sio.event
async def update_play(sid, data):
    room_id = data.get("room_id")
    play = data.get("play")
    if not room_id or not play:
        return
    rooms.update_play(room_id, play)
    room = rooms.get_or_create(room_id)
    await sio.emit("play_updated", {"play": play, "from": sid}, room=room_id, skip_sid=sid)


@sio.event
async def sync_playback(sid, data):
    room_id = data.get("room_id")
    if not room_id:
        return
    is_playing = data.get("is_playing", False)
    current_time = data.get("current_time", 0.0)
    rooms.set_playback(room_id, is_playing, current_time)
    await sio.emit(
        "playback_sync",
        {"is_playing": is_playing, "current_time": current_time, "from": sid},
        room=room_id,
        skip_sid=sid,
    )


@sio.event
async def cursor_move(sid, data):
    room_id = data.get("room_id")
    if not room_id:
        return
    await sio.emit(
        "cursor_update",
        {"sid": sid, "x": data.get("x"), "y": data.get("y"), "name": data.get("name")},
        room=room_id,
        skip_sid=sid,
    )


app = socketio.ASGIApp(sio, fastapi_app)
