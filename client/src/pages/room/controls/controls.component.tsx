import { Button } from "@mui/material";
import Live from "./live/live.component";
import Mic from "./mic/mic.compoent";

interface ControlsProps {
  hasPermission: boolean;
  requestPermission: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  hasPermission,
  requestPermission,
}) => {
  return (
    <div className="controls-container">
      {hasPermission ? (
        <>
          <Mic />
          <Live />
        </>
      ) : (
        <Button onClick={requestPermission}> &#9995; </Button>
      )}
    </div>
  );
};

export default Controls;
