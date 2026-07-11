"""In-memory room state for real-time collaboration."""

from __future__ import annotations

import copy
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Collaborator:
    sid: str
    name: str
    color: str


@dataclass
class Room:
    id: str
    play: dict[str, Any] | None = None
    collaborators: dict[str, Collaborator] = field(default_factory=dict)
    is_playing: bool = False
    current_time: float = 0.0


class RoomManager:
    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}

    def get_or_create(self, room_id: str) -> Room:
        if room_id not in self._rooms:
            self._rooms[room_id] = Room(id=room_id)
        return self._rooms[room_id]

    def join(self, room_id: str, sid: str, name: str, color: str) -> Room:
        room = self.get_or_create(room_id)
        room.collaborators[sid] = Collaborator(sid=sid, name=name, color=color)
        return room

    def leave(self, room_id: str, sid: str) -> None:
        room = self._rooms.get(room_id)
        if room and sid in room.collaborators:
            del room.collaborators[sid]

    def update_play(self, room_id: str, play: dict) -> None:
        room = self.get_or_create(room_id)
        room.play = copy.deepcopy(play)

    def set_playback(self, room_id: str, is_playing: bool, current_time: float) -> None:
        room = self.get_or_create(room_id)
        room.is_playing = is_playing
        room.current_time = current_time

    def snapshot(self, room: Room) -> dict:
        return {
            "room_id": room.id,
            "play": room.play,
            "collaborators": [
                {"sid": c.sid, "name": c.name, "color": c.color}
                for c in room.collaborators.values()
            ],
            "is_playing": room.is_playing,
            "current_time": room.current_time,
        }


rooms = RoomManager()
