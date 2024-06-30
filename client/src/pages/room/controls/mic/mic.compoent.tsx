import { Button } from "@mui/material";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

const Mic = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();

  const handleMicChange = async () => {
    if (isMute) {
      microphone.enable();
    } else {
      microphone.disable();
    }
  };

  return (
    <Button
      variant="contained"
      onClick={() => handleMicChange()}
      color={isMute ? "error" : "secondary"}
    >
      {isMute ? "Unmute" : "Mute"}
    </Button>
  );
};

export default Mic;
