import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../state/roomStore";

export function CreateRoomPage() {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const roomStore = useRoomStore();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      await roomStore.createRoom(playerName);
      navigate("/lobby");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to create room");
    }
  }

  return (
    <section className="panel placeholder-page">
      <h1>Create Room</h1>
      <p>Pick a player name, create a room, and continue into the lobby.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          <span>Player name</span>
          <input
            className="form__input"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Sketch captain"
          />
        </label>
        {error ? <p className="form__error">{error}</p> : null}
        <div className="button-row">
          <button className="button button--primary" type="submit">
            Create and Continue
          </button>
        </div>
      </form>
    </section>
  );
}
