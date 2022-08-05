import React, { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import socket from "./voiceSocket";
import NewAudio from "./NewAudio";
import Footer from "../sidebar/Footer";

const Room = (props) => {
  const currentUser = props.auth.user_email;
  const currentNick = props.auth.user_name;
  console.log('보이스톡 랜더링!!!!!!!!', currentNick, currentUser);
  if (!props.auth) {
    window.location.replace("/signin");
  }

  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: false, audio: true },
  });
  const peersRef = useRef([]);
  const userAudioRef = useRef();
  const userStream = useRef();
  // const roomId = props.match.params.roomId;
  const roomId = props.projectId;
  console.log(`룸이름 : ${roomId}`)
  // const currentUser = u

  // useEffect(() => {
  //   (() => {
  //     window.addEventListener('popstate', exitVoice)
  //     socket.disconnect()
  //   })();
  //   (() => {
  //     window.addEventListener('beforeunload', exitVoice)
  //     socket.disconnect()
  //   })();
  // return (
  //   window.removeEventListener("beforeunload", exitVoice);
  //   window.removeEventListener("popstate", exitVoice);
  // );
  // })
  useEffect(() => {
    // socket.emit("BE-check-user", { roomId: roomId, currentUser });
    // socket.on("FE-error-user-exist", ({ error }) => {
    //   if (!error) {
    //     // const roomName = roomRef.current.value;
    //     // const userName = userRef.current.value;

    //     sessionStorage.setItem("user", currentUser);
    //     // props.history.push(`/room/${roomName}`);
    //   } else {
    //     console.log("User name already exist");
    //     // setErr(error);
    //     // setErrMsg('User name already exist');
    //   }
    // });
    // Connect Camera & Mic
    console.log('유즈이펙트!!!!!!!!', currentNick, currentUser);
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      userAudioRef.current.srcObject = stream;
      userStream.current = stream;
      console.log('BE-join-room 직전!!!!!!!!', currentNick, currentUser);
      socket.emit("BE-join-room", {
        roomId,
        userName: currentUser,
        nickName: currentNick,
      });

      socket.on("FE-user-join", (users) => {
        console.log(`FE-user-join: ${JSON.stringify(users)}`);

        // all users
        const peers = [];
        users.forEach(({ userId, info }) => {
          let { userName, nickName, audio } = info;
          console.log(`내 이름 : ${currentUser}, 상대 이름 : ${userName}`);
          if (userName !== currentUser) {
            const peer = createPeer(userId, socket.id, stream);
            peer.userName = userName;
            peer.nickName = nickName;
            peer.peerID = userId;

            peersRef.current.push({
              peerID: userId,
              peer,
              userName,
            });
            peers.push(peer);

            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { audio },
              };
            });
          }
        });
        console.log(`peers는 : ${JSON.stringify(peers)}`)
        setPeers(peers);        
      });

      socket.on("FE-receive-call", ({ signal, from, info }) => {
        console.log(`FE-receive-call 시작`)
        let { userName, nickName, audio } = info;
        const peerIdx = findPeer(from);

        if (!peerIdx) {
          const peer = addPeer(signal, from, stream);
          peer.nickName = nickName;
          peer.userName = userName;
          peersRef.current.push({
            peerID: from,
            peer,
            userName: userName,
          });
          setPeers((users) => {
            return [...users, peer];
          });
          setUserVideoAudio((preList) => {
            return {
              ...preList,
              [peer.userName]: { audio },
            };
          });
        }
        console.log(`FE-receive-call 끝`)
      });

      socket.on("FE-call-accepted", ({ signal, answerId }) => {
        console.log(`FE-call-accepted 시작`, signal, answerId);
        const peerIdx = findPeer(answerId);
        peerIdx.peer.signal(signal);
        console.log(`FE-call-accepted 끝`, signal, answerId);
      });

      socket.on("FE-user-leave", ({ userId, userName }) => {
        console.log("FE-usr-leave ok", JSON.stringify(userId), JSON.stringify(userName));
        const peerIdx = findPeer(userId);
        if (peerIdx){
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
          peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId);
        }
      });
    });
    return () => {
      socket.emit("BE-leave-room", { roomId, leaver: currentUser });
      socket.off("disconnect");
      // socket.disconnect();
      socket.removeAllListeners();
    };
    // eslint-disable-next-line
  }, []);
  // console.log(socket)
  function createPeer(userId, caller, stream) {
    // const peer = new Peer({
      const peer = new window.SimplePeer({
      initiator: true,
      trickle: true,
      stream,
      config: { 
        iceServers: [
          {
            urls: [
              "turn:eu-0.turn.peerjs.com:3478",
              "turn:us-0.turn.peerjs.com:3478",
            ],
            username: "peerjs",
            credential: "peerjsp",
          },
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
          { url: 'turn:3.36.66.43:3478?transport=udp', username: 'admin', credential: 'admin'},
      ]},
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on("disconnect", () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    // const peer = new Peer({
      const peer = new window.SimplePeer({
      initiator: false,
      trickle: true,
      stream,
      config: { 
        iceServers: [
          {
            urls: [
              "turn:eu-0.turn.peerjs.com:3478",
              "turn:us-0.turn.peerjs.com:3478",
            ],
            username: "peerjs",
            credential: "peerjsp",
          },
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
          { url: 'turn:3.36.66.43:3478?transport=udp', username: 'admin', credential: 'admin'},
      ]},
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-accept-call", { signal, to: callerId });
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    return <NewAudio key={index} peer={peer} number={arr.length} />;
  }

  const toggleCameraAudio = useCallback(() => {
    let flag = true;
    setUserVideoAudio((preList) => {
      try {
        let audioSwitch = preList["localUser"].audio;
        const userAudioTrack = userAudioRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }

        return {
          ...preList,
          localUser: { audio: audioSwitch },
        };
      } catch (e) {
        flag = false;
        console.log(`VoiceToggle err : ${e}`);
      }
    });

    if (flag) socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: "audio" });
  }, [userVideoAudio]);

  const exitVoice = (e) => {
    e.preventDefault();
    e.returnValue = "";
    socket.emit("BE-leave-room", { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/';
  };

  return (
    <>
      <MyVideo ref={userAudioRef} muted></MyVideo>
      {peers && peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
      <Footer toggleCameraAudio={toggleCameraAudio} myNickName={currentNick} currentUser={currentUser} users={peers} />
    </>
  );
};

const MyVideo = styled.audio``;

export default React.memo(Room);
