import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import MainPage from "./pages/main/main.component";
import LoginPage from "./pages/login/login.component";
import RoomPage from "./pages/room/room.component";
import MainLayout from "./layouts/main.layout";
import { StreamCall } from "@stream-io/video-react-sdk";
import { useUser } from "./context/user.context";

function App() {
  const { call } = useUser();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/room"
          element={
            call ? (
              <StreamCall call={call}>
                {" "}
                <RoomPage />{" "}
              </StreamCall>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
