import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./login.styles.css";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../../context/user.context";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const cookie = new Cookies();
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const { setClient, setUser } = useUser();
  const navigate = useNavigate();

  const [messaging, setMessaging] = useState<any>({
    severity: "success",
    message: "",
  });

  useEffect(() => {
    const userName = cookie.get("userName");
    const token = cookie.get("token");
    const name = cookie.get("name");

    if (userName && token && name) {
      setUser({
        userName,
        name,
      });

      const user: User = {
        id: userName,
        name,
      };

      const myClient = new StreamVideoClient({
        apiKey: "xfe2e4bqvhqs",
        user,
        token,
      });

      setClient(myClient);

      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!userName.trim() || !name.trim()) {
      setMessaging({
        severity: "error",
        message: "please enter valid values",
      });
      setOpen(true);
      return;
    }

    const images = [
      "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ];

    const response = await fetch("http://localhost:5000/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName,
        name,
        image: images[Math.floor(Math.random() * images.length)],
      }),
    });

    if (!response.ok) {
      setMessaging({
        severity: "error",
        message: "something went wrong",
      });
      setOpen(true);
      return;
    }

    const responseData = await response.json();

    const user: User = {
      id: userName,
      name,
    };

    const myClient = new StreamVideoClient({
      apiKey: "xfe2e4bqvhqs",
      user,
      token: responseData.token,
    });

    setClient(myClient);
    setUser({
      userName,
      name,
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    cookie.set("token", responseData.token, {
      expires,
    });

    cookie.set("userName", responseData.userName, {
      expires,
    });

    cookie.set("name", responseData.name, {
      expires,
    });

    navigate("/");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="container">
        <div className="main-container">
          <h1 className="title">Welcome to Audio Room</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              id="username"
              value={userName}
              label="Username"
              variant="outlined"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              id="name"
              value={name}
              label="Name"
              variant="outlined"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />

            <Button type="submit" variant="contained">
              Login
            </Button>
          </form>
        </div>
      </div>
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

export default LoginPage;
