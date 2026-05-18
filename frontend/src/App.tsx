import { AppRoutes } from "./routes";
import { RoomStoreProvider } from "./state/roomStore";
import "./styles/app.css";

export default function App() {
  return (
    <RoomStoreProvider>
      <AppRoutes />
    </RoomStoreProvider>
  );
}
