from pydantic import BaseModel, Field
from typing import Literal

Team = Literal["attack", "defense", "neutral"]


class Keyframe(BaseModel):
    t: float = Field(ge=0, description="Time in seconds")
    x: float = Field(description="Pitch length axis (-52.5 to 52.5)")
    z: float = Field(description="Pitch width axis (-34 to 34)")


class PlayerTrack(BaseModel):
    id: str
    team: Team
    number: int = Field(ge=1, le=99)
    role: str
    keyframes: list[Keyframe] = Field(min_length=1)


class BallTrack(BaseModel):
    keyframes: list[Keyframe] = Field(min_length=1)


class Play(BaseModel):
    id: str
    name: str
    description: str
    duration: float = Field(ge=2, le=30)
    tags: list[str] = []
    players: list[PlayerTrack] = Field(min_length=1)
    ball: BallTrack


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=500)
    demo: bool = False


class GenerateResponse(BaseModel):
    play: Play
    ai_summary: str
