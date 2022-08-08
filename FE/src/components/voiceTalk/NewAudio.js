import React, { useEffect, useRef } from "react";
import styled from "styled-components";
const NewAudio = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on("track", (track, stream) => {});
  }, [peer]);

  return <Audio playsInline autoPlay ref={ref} />;
};

const Audio = styled.audio``;

export default NewAudio;