import { StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "../../context/user.context";
import { Navigate, useNavigate } from "react-router-dom";
import "./main.styles.css";
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Room {
  id: string;
  title: string;
  description: string;
  participationLength: number;
  createdBy: string;
}

type CustomCallData = {
  description?: string;
  title?: string;
};

const MainPage = () => {
  const navigate = useNavigate();
  const { client, user, setCall } = useUser();
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [messaging, setMessaging] = useState<any>({
    severity: "success",
    message: "",
  });

  const [availableRooms, setAvailableRooms] = useState<Room[]>();

  useEffect(() => {
    if (client) fetchAvailableRooms();
  }, [client]);

  if (!client) return <Navigate to="login" />;

  const hashRoomName = (roomName: string): string => {
    return roomName.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const fetchAvailableRooms = async () => {
    const callQueryResponse = await client.queryCalls({
      filter_conditions: {
        ongoing: true,
      },
      limit: 4,
      watch: true,
    });

    if (!callQueryResponse) {
      setMessaging({
        severity: "error",
        message: "Error getting the Room",
      });
      return;
    }

    const roomsPromise = callQueryResponse.calls.map(async (call) => {
      const callInfo = await call.get();
      const customData = callInfo.call.custom;
      const { title, description } = (customData || {}) as CustomCallData;
      const participationLength = callInfo.members.length ?? 0;
      const createdBy = callInfo.call.created_by.name ?? "";
      const id = callInfo.call.id ?? "";

      return {
        id,
        title: title ?? "",
        description: description ?? "",
        participationLength,
        createdBy,
      };
    });

    const rooms = await Promise.all(roomsPromise);
    console.log("rooms", rooms);
    setAvailableRooms(rooms);
  };

  const createRoom = async (e: any) => {
    e.preventDefault();

    if (
      !roomName.trim() ||
      !roomDescription ||
      !client ||
      !user ||
      !hashRoomName(roomName)
    ) {
      setMessaging({
        severity: "error",
        message: "please enter valid values",
      });
      setOpen(true);
      return;
    }

    const call = client.call("audio_room", hashRoomName(roomName));
    await call.join({
      create: true,
      data: {
        members: [
          {
            user_id: user.userName,
          },
        ],
        custom: {
          title: roomName,
          description: roomDescription,
        },
      },
    });

    setCall(call);
    navigate("/room");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const joinCall = async (roomId: string) => {
    const call = client.call("audio_room", roomId);

    try {
      await call.join();
      setCall(call);
      navigate("/room");
    } catch (err) {
      setMessaging({
        severity: "error",
        message: "Error Joining the Room, wait until live started",
      });
      setOpen(true);
    }
  };

  return (
    <>
      <StreamVideo client={client}>
        <div className="main-container-login">
          <div className="main-container">
            <h1 className="title">
              Welcome Back, <span> {user?.name} </span>
            </h1>
            <form onSubmit={createRoom}>
              <TextField
                id="roomName"
                value={roomName}
                label="Room Name"
                variant="outlined"
                type="text"
                onChange={(e) => setRoomName(e.target.value)}
              />
              <TextField
                id="roomDescription"
                value={roomDescription}
                label="Room Description"
                variant="outlined"
                type="text"
                onChange={(e) => setRoomDescription(e.target.value)}
              />

              <Button type="submit" variant="contained">
                Create Room
              </Button>
            </form>
          </div>
          {availableRooms?.length ? (
            <>
              <h4>Available Rooms</h4>
              <div className="grid-box">
                {availableRooms.map((room) => {
                  return (
                    <Card
                      sx={{ maxWidth: 345, width: 250, maxHeight: 400 }}
                      key={room.id}
                    >
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {room.title}
                          </Typography>
                          <Typography color="text.secondary">
                            {room.description}
                          </Typography>
                          <div className="other-details-card">
                            <Typography color="text.secondary">
                              Created By: <span>{room.createdBy}</span>
                            </Typography>
                            <Typography color="text.secondary">
                              Participation Count:{" "}
                              <span> {room.participationLength}</span>
                            </Typography>
                          </div>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => joinCall(room.id)}
                        >
                          Join
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <h4>No available Rooms at the moment</h4>
          )}
        </div>
      </StreamVideo>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={messaging.severity}
          variant="filled"
        >
          {messaging.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MainPage;
