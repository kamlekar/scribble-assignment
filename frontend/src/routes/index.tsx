import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { CreateRoomPage } from "../pages/CreateRoomPage";
import { GamePage } from "../pages/GamePage";
import { JoinRoomPage } from "../pages/JoinRoomPage";
import { LobbyPage } from "../pages/LobbyPage";
import { StartPage } from "../pages/StartPage";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="panel placeholder-page">
      <h1>{title}</h1>
      <p>Screen implementation is added in later phases.</p>
    </section>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="/join-room" element={<JoinRoomPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
