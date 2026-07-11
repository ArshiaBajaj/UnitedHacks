import json
import os
import uuid

from google import genai
from google.genai import types

from models import BallTrack, GenerateResponse, Keyframe, Play, PlayerTrack

SYSTEM = """You are Tactix3D, an elite soccer tactics engine used by professional coaches.
Generate realistic soccer plays as JSON. Coordinates use a centered pitch:
- x axis: -52.5 (own goal) to +52.5 (opponent goal), length 105m
- z axis: -34 (left touchline) to +34 (right touchline), width 68m
- y is always 0 for players; ball stays on ground unless specified

Rules:
- duration: 4-15 seconds
- attack team: blue, numbers 1-11, team "attack"
- defense team: red, numbers 1-11, team "defense"  
- Include 6-12 players total (not all 22)
- Each player needs keyframes at t=0 and at least 2 more keyframes showing movement
- Ball keyframes must sync with passes (ball near passer then receiver)
- Movements must be tactically realistic
- Return ONLY valid JSON matching the schema"""


def _kf(t: float, x: float, z: float) -> Keyframe:
    return Keyframe(t=t, x=x, z=z)


DEMO_PLAYS: dict[str, Play] = {}


def _build_demos() -> None:
    counter = Play(
        id="demo-counter",
        name="Winger Cuts Inside — Counter",
        description="Fast break down the left. Winger cuts inside, fullback overlaps, through ball to striker.",
        duration=8.0,
        tags=["counterattack", "winger", "world-cup"],
        players=[
            PlayerTrack(id="a7", team="attack", number=7, role="LW", keyframes=[
                _kf(0, -20, -28), _kf(2, 5, -20), _kf(4, 18, -8), _kf(6, 32, -5), _kf(8, 40, -3),
            ]),
            PlayerTrack(id="a3", team="attack", number=3, role="LB", keyframes=[
                _kf(0, -25, -30), _kf(3, -5, -32), _kf(6, 15, -30), _kf(8, 28, -28),
            ]),
            PlayerTrack(id="a9", team="attack", number=9, role="ST", keyframes=[
                _kf(0, 10, 2), _kf(4, 22, 0), _kf(6, 38, 3), _kf(8, 45, 5),
            ]),
            PlayerTrack(id="a6", team="attack", number=6, role="CM", keyframes=[
                _kf(0, -5, 0), _kf(2, 8, -5), _kf(5, 20, -2), _kf(8, 25, 0),
            ]),
            PlayerTrack(id="a10", team="attack", number=10, role="CAM", keyframes=[
                _kf(0, 0, 10), _kf(3, 12, 8), _kf(6, 25, 12), _kf(8, 30, 10),
            ]),
            PlayerTrack(id="d2", team="defense", number=2, role="RB", keyframes=[
                _kf(0, 15, 25), _kf(4, 20, 15), _kf(8, 35, 8),
            ]),
            PlayerTrack(id="d4", team="defense", number=4, role="CB", keyframes=[
                _kf(0, 25, 5), _kf(4, 30, 2), _kf(8, 42, 4),
            ]),
            PlayerTrack(id="d5", team="defense", number=5, role="CB", keyframes=[
                _kf(0, 22, -8), _kf(4, 28, -5), _kf(8, 40, -2),
            ]),
            PlayerTrack(id="d1", team="defense", number=1, role="GK", keyframes=[
                _kf(0, 48, 0), _kf(8, 46, 2),
            ]),
        ],
        ball=BallTrack(keyframes=[
            _kf(0, -18, -25), _kf(2, 5, -18), _kf(4, 18, -10),
            _kf(5.5, 22, -6), _kf(7, 38, 2), _kf(8, 44, 4),
        ]),
    )

    corner = Play(
        id="demo-corner",
        name="Near-Post Corner Routine",
        description="In-swinging corner to near post flick-on. Far post runner attacks the second ball.",
        duration=6.0,
        tags=["set-piece", "corner", "aerial"],
        players=[
            PlayerTrack(id="a11", team="attack", number=11, role="Corner Taker", keyframes=[
                _kf(0, 52, -34), _kf(1, 52, -33), _kf(6, 52, -34),
            ]),
            PlayerTrack(id="a4", team="attack", number=4, role="Near Post", keyframes=[
                _kf(0, 48, -8), _kf(2, 49, -5), _kf(4, 50, -3), _kf(6, 49, -2),
            ]),
            PlayerTrack(id="a5", team="attack", number=5, role="Far Post", keyframes=[
                _kf(0, 46, 12), _kf(3, 48, 8), _kf(5, 50, 4), _kf(6, 51, 2),
            ]),
            PlayerTrack(id="a9b", team="attack", number=9, role="ST", keyframes=[
                _kf(0, 44, 0), _kf(3, 47, -2), _kf(6, 49, 0),
            ]),
            PlayerTrack(id="d4b", team="defense", number=4, role="CB", keyframes=[
                _kf(0, 47, -4), _kf(3, 48, -3), _kf(6, 49, -1),
            ]),
            PlayerTrack(id="d5b", team="defense", number=5, role="CB", keyframes=[
                _kf(0, 46, 6), _kf(6, 48, 3),
            ]),
            PlayerTrack(id="d1b", team="defense", number=1, role="GK", keyframes=[
                _kf(0, 50, 0), _kf(6, 49, 1),
            ]),
        ],
        ball=BallTrack(keyframes=[
            _kf(0, 52, -34), _kf(1.5, 52, -33), _kf(3, 49, -4),
            _kf(4.5, 49.5, -2), _kf(6, 50, 1),
        ]),
    )

    press = Play(
        id="demo-press",
        name="High Press Trap — Left Side",
        description="Trigger press when ball goes to their left back. Winger cuts passing lane, #9 presses CB, win ball high.",
        duration=7.0,
        tags=["pressing", " gegenpress", "defense"],
        players=[
            PlayerTrack(id="a9c", team="attack", number=9, role="ST", keyframes=[
                _kf(0, 30, 5), _kf(2, 22, 8), _kf(4, 12, 10), _kf(7, 8, 12),
            ]),
            PlayerTrack(id="a11c", team="attack", number=11, role="LW", keyframes=[
                _kf(0, 20, -20), _kf(2, 10, -18), _kf(5, 5, -15), _kf(7, 3, -12),
            ]),
            PlayerTrack(id="a8", team="attack", number=8, role="CM", keyframes=[
                _kf(0, 15, 0), _kf(3, 8, 2), _kf(7, 5, 5),
            ]),
            PlayerTrack(id="d6", team="defense", number=6, role="CDM", keyframes=[
                _kf(0, -10, 0), _kf(3, -8, 2), _kf(7, -5, 5),
            ]),
            PlayerTrack(id="d3", team="defense", number=3, role="LB", keyframes=[
                _kf(0, -25, -28), _kf(2, -22, -26), _kf(4, -18, -22), _kf(7, -15, -18),
            ]),
            PlayerTrack(id="d4c", team="defense", number=4, role="CB", keyframes=[
                _kf(0, -30, -5), _kf(4, -28, -3), _kf(7, -25, 0),
            ]),
        ],
        ball=BallTrack(keyframes=[
            _kf(0, -20, -24), _kf(2, -22, -26), _kf(4, -16, -20),
            _kf(5.5, -10, -12), _kf(7, -5, -8),
        ]),
    )

    DEMO_PLAYS["counterattack"] = counter
    DEMO_PLAYS["corner"] = corner
    DEMO_PLAYS["press"] = press
    DEMO_PLAYS["default"] = counter


_build_demos()


def match_demo(prompt: str) -> Play | None:
    p = prompt.lower()
    if any(w in p for w in ["corner", "set piece", "set-piece", "cross"]):
        return DEMO_PLAYS["corner"].model_copy(deep=True)
    if any(w in p for w in ["press", "gegenpress", "trap", "win ball"]):
        return DEMO_PLAYS["press"].model_copy(deep=True)
    if any(w in p for w in ["counter", "winger", "cut inside", "break", "fast"]):
        return DEMO_PLAYS["counterattack"].model_copy(deep=True)
    return None


def generate_play(prompt: str, demo: bool = False) -> GenerateResponse:
    if demo:
        play = match_demo(prompt) or DEMO_PLAYS["default"]
        play = play.model_copy(deep=True)
        play.id = str(uuid.uuid4())[:8]
        return GenerateResponse(
            play=play,
            ai_summary=f"Generated demo play: {play.name}. {play.description}",
        )

    matched = match_demo(prompt)
    if matched and not os.getenv("GEMINI_API_KEY"):
        play = matched.model_copy(deep=True)
        play.id = str(uuid.uuid4())[:8]
        return GenerateResponse(
            play=play,
            ai_summary=f"AI-matched tactical pattern: {play.name}",
        )

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        play = DEMO_PLAYS["default"].model_copy(deep=True)
        play.id = str(uuid.uuid4())[:8]
        return GenerateResponse(
            play=play,
            ai_summary="Demo mode — add GEMINI_API_KEY for custom AI generation.",
        )

    client = genai.Client(api_key=api_key)
    user_prompt = f"""Create a soccer play for: "{prompt}"

Return JSON:
{{
  "name": "...",
  "description": "...",
  "duration": 8.0,
  "tags": ["..."],
  "players": [{{"id":"a7","team":"attack","number":7,"role":"LW","keyframes":[{{"t":0,"x":0,"z":0}}]}}],
  "ball": {{"keyframes":[{{"t":0,"x":0,"z":0}}]}}
}}"""

    response = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.0-flash"),
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM,
            response_mime_type="application/json",
            temperature=0.5,
        ),
    )

    raw = response.text
    if not raw:
        raise ValueError("Empty AI response")

    data = json.loads(raw)
    data["id"] = str(uuid.uuid4())[:8]
    play = Play.model_validate(data)
    return GenerateResponse(
        play=play,
        ai_summary=f"AI generated '{play.name}' — {play.description}",
    )


def get_demo_play(play_id: str) -> Play | None:
    for p in DEMO_PLAYS.values():
        if p.id == play_id:
            return p.model_copy(deep=True)
    return None


def list_demos() -> list[Play]:
    return [DEMO_PLAYS["counterattack"], DEMO_PLAYS["corner"], DEMO_PLAYS["press"]]
