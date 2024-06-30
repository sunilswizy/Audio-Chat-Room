import { Avatar, StreamVideoParticipant } from "@stream-io/video-react-sdk";

interface ParticipantProps {
  participant: StreamVideoParticipant;
}

const Participant = (props: ParticipantProps) => {
  return (
    <div>
      <Avatar
        imageSrc={props.participant.image}
        style={{
          width: 80,
          height: 80,
          borderRadius: 50,
          boxShadow: props.participant.isSpeaking
            ? "0 0px 1px 2px green"
            : "none",
        }}
      />
      <p>{props.participant.name}</p>
    </div>
  );
};

export default Participant;
