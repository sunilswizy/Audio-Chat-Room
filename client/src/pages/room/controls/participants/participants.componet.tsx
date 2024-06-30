import {
  ParticipantsAudio,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import Participant from "../participant/participant.component";

const Participants = () => {
  const { useParticipants } = useCallStateHooks();

  const participants = useParticipants();

  return (
    <div className="participants-container">
      <ParticipantsAudio participants={participants} />
      {participants.map((p) => (
        <Participant participant={p} key={p.sessionId} />
      ))}
    </div>
  );
};

export default Participants;
