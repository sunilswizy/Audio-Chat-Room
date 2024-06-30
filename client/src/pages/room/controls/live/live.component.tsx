import { Button } from "@mui/material";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

const Live = () => {
  const { useIsCallLive } = useCallStateHooks();
  const call = useCall();
  const isLive = useIsCallLive();

  const handleLiveAction = async () => {
    if (isLive) {
      call?.stopLive();
    } else {
      call?.goLive();
    }
  };

  return (
    <Button
      variant="contained"
      color={isLive ? "error" : "secondary"}
      onClick={handleLiveAction}
    >
      {isLive ? "Stop Live" : "Go Live"}
    </Button>
  );
};

export default Live;
