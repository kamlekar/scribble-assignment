import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GuessForm } from "../components/GuessForm";
import { ResultPanel } from "../components/ResultPanel";
import { Scoreboard } from "../components/Scoreboard";
import { useRoomState } from "../state/roomStore";

export function GamePage() {
  const navigate = useNavigate();
  const { room, participantId } = useRoomState();

  useEffect(() => {
    if (!room) {
      navigate("/", { replace: true });
    }
  }, [navigate, room]);

  if (!room) {
    return null;
  }

  const viewer = room.participants.find((participant) => participant.id === participantId) ?? null;

  return (
    <section className="panel placeholder-page">
      <h1>Game</h1>
      <p>
        Room <strong>{room.code}</strong> is showing the starter game scaffold.
      </p>

      <div className="summary-grid">
        <article className="hero__card">
          <h2>Canvas</h2>
          <div className="canvas-placeholder">Drawing canvas placeholder</div>
          <p>The canvas region is intentionally non-interactive in this starter.</p>
        </article>

        <article className="hero__card">
          <h2>Session</h2>
          <p>Viewer: {viewer?.name ?? "Unknown player"}</p>
          <p>Available roles: {room.roles.join(", ")}</p>
          <p>Available words: {room.availableWords.join(", ")}</p>
        </article>

        <Scoreboard />
        <ResultPanel />
      </div>

      <div className="summary-grid">
        <article className="hero__card">
          <h2>Guess Input</h2>
          <p>This input is a placeholder and does not submit gameplay guesses.</p>
          <GuessForm />
          <div className="button-row">
            <button className="button button--secondary" onClick={() => navigate("/lobby")}>
              Back to Lobby
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
