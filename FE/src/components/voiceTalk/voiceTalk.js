// import { randomUUID } from 'crypto';
import React, { useState, useEffect, useRef } from 'react';
import { useBeforeunload } from "react-beforeunload";
import Peer from 'simple-peer';
import styled from 'styled-components';
import socket from './voiceSocket';
import NewAudio from './NewAudio';
import Footer from '../sidebar/Footer'

const Room = (props) => {
  const person = ["영지", "윤혁", "원영", "준규", "박서준규", "남주혁", "공주", "왕자", "강동원영", "놀멍쉬멍", "쉬멍놀멍"];
  const man = person[parseInt(Math.random()*10)];
  const currentUser = sessionStorage.getItem('user_email') ? sessionStorage.getItem('user_email') : man;
  const currentNick = sessionStorage.getItem('myNickname') ?sessionStorage.getItem('myNickname') : man;

  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const peersRef = useRef([]);
  const userAudioRef = useRef();
  const userStream = useRef();
  // const roomId = props.match.params.roomId;
  const roomId = props.projectId
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
    socket.emit('BE-check-user', { roomId: roomId, currentUser })
    socket.on('FE-error-user-exist', ({ error }) => {
      if (!error) {
        // const roomName = roomRef.current.value;
        // const userName = userRef.current.value;

        sessionStorage.setItem('user', currentUser);
        // props.history.push(`/room/${roomName}`);
      } else {
        console.log('User name already exist');
        // setErr(error);
        // setErrMsg('User name already exist');
      }
    });
    // Connect Camera & Mic
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        userAudioRef.current.srcObject = stream;
        userStream.current = stream;
        socket.emit('BE-join-room', { roomId, userName: currentUser, nickName: currentNick });

        socket.on('FE-user-join', (users) => {
          console.log(`FE-user-join ${users}`)
        
          // all users
          const peers = [];
          users.forEach(({ userId, info }) => {
            let { userName, nickName, audio } = info;
            
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

          setPeers(peers);
        });

        socket.on('FE-receive-call', ({ signal, from, info }) => {
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
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('FE-user-leave', ({ userId, userName }) => {
          console.log('FE-usr-leave ok', JSON.stringify(userName))
          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();
          setPeers((users) => {
            users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
            return [...users];
          });
          peersRef.current = peersRef.current.filter(({ peerID }) => peerID !== userId );
        });
      });

    return () => {
      socket.emit('BE-leave-room', { roomId, leaver: currentUser });
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);
  
  

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    return (
        <NewAudio key={index} peer={peer} number={arr.length} />
    );
  }


  const toggleCameraAudio = () => {
    setUserVideoAudio((preList) => {
      let audioSwitch = preList['localUser'].audio;
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
    });

    socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: 'audio' });
  };

  const exitVoice = (e) => {
    e.preventDefault();
    e.returnValue = "";
    socket.emit('BE-leave-room', { roomId, leaver: currentUser });
    // sessionStorage.removeItem('user');
    // window.location.href = '/';
  };

  return (
    
        <>
          {console.log('보이스톡에서 : ', peers)}
          <MyVideo
            ref={userAudioRef}
            muted
            
          ></MyVideo>
        {peers &&
          peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
        <Footer toggleCameraAudio={toggleCameraAudio} myNickName={currentNick} users={peers}/>

        </>        
  );
};

const MyVideo = styled.audio``;

export default Room;
