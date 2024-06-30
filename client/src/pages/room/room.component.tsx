import {
  OwnCapability,
  useCallStateHooks,
  useRequestPermission,
} from "@stream-io/video-react-sdk";
import "./room.styles.css";
import Controls from "./controls/controls.component";
import { useUser } from "../../context/user.context";
import PermissionsRequest from "./controls/permissions/permisstions.component";
import Participants from "./controls/participants/participants.componet";

const RoomPage = () => {
  const { useCallCustomData, useParticipants, useCallCreatedBy } =
    useCallStateHooks();

  const { user } = useUser();

  const custom = useCallCustomData();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();

  const { hasPermission, requestPermission } = useRequestPermission(
    OwnCapability.SEND_AUDIO
  );

  return (
    <div className="main-container-login">
      <div className="main-container">
        <h1 className="title set-height">{custom?.title ?? "Title"}</h1>
        <h3 className="description">{custom?.description ?? "Description"}</h3>
        <p>{participants.length} participants</p>
        <Participants />
        {user?.userName == createdBy?.id && <PermissionsRequest />}
        <Controls
          hasPermission={hasPermission}
          requestPermission={requestPermission}
        />
      </div>
    </div>
  );
};

export default RoomPage;
