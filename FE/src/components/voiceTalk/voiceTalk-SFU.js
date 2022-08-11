import React from "react";
import { useAuth } from "../auth/Auth";

const _EVENTS = {
    onLeave: "onLeave",
    onJoin: "onJoin",
    onCreate: "onCreate",
    onStreamStarted: "onStreamStarted",
    onStreamEnded: "onStreamEnded",
    onReady: "onReady",
    onScreenShareStopped: "onScreenShareStopped",
    exitRoom: "exitRoom",
    onConnected: "onConnected",
    onRemoteTrack: "onRemoteTrack",
  };
  

  class Sfu extends React.Component{
    // componentWillUnmount(){
    //     return 'no'
    //     this.handleClose();
    // }
    // componentDidMount(){
    //     return 'no'
    //     this.handleClose();
    // }
    constructor(options) {
        super(options);
      const defaultSettings = {
        port: 3005,
        configuration: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" },
            {
                urls: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
          ],
        },
      };
    // window.addEventListener("beforeunload", (event) => {
    //     return 'no'
    //     this.handleClose();
    // });
    // window.onbeforeunload = function() {
    //     return 'no'
    //     this.handleClose();
    // }
    // window.onpopstate = function(event) {
    //     return 'no'
    //     this.handleClose();
    // }
      this.settings = Object.assign({}, defaultSettings, options);
      this._isOpen = false;
      this.eventListeners = new Map();
      this.connection = null;
      this.consumers = new Map();
      this.clients = new Map();
      this.localPeer = null;
      this.localUUID = null;
      this.localStream = null;
      this.projectId = options; 
      
      const auth = useAuth();
      console.log(JSON.stringify(auth.user))
      this.username = auth.user.username;

      Object.keys(_EVENTS).forEach((event) => {
        this.eventListeners.set(event, []);
      })
      this.initWebSocket();
      this.trigger(_EVENTS.onReady);

    }
  
    initWebSocket() {
      console.log('SFu 진입 !!!!!!!!!!', this.projectId);
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";

      const url = `${protocol}://${process.env.REACT_APP_SERVER_IP}:${3005}`;
      this.connection = new WebSocket(url);
      this.connection.onmessage = (data) => this.handleMessage(data); 
      this.connection.onclose = () => this.handleClose();
      this.connection.onopen = (event) => {
        this.trigger(_EVENTS.onConnected, event);
        this._isOpen = true;
      };
    }
  
    on(event, callback) {
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).push(callback);
      }
    }
  
    trigger(event, args = null) {
      if (this.eventListeners.has(event)) {
        this.eventListeners
          .get(event)
          .forEach((callback) => callback.call(this, args));
      }
    }
  
    static get EVENTS() {
      return _EVENTS;
    }
  
    get IsOpen() {
      return this._isOpen;
    }
  
    findUserAudio(username) {
      return document.querySelector(`#remote_${username}`);
    }
  
    async handleRemoteTrack(stream, username) {
      const userAudio = this.findUserAudio(username);
      if (userAudio) {
        userAudio.srcObject.addTrack(stream.getTracks()[0]);
      } else {
        const audio = document.createElement("audio");
        audio.id = `remote_${username}`;
        audio.srcObject = stream;
        audio.autoplay = true;
        audio.muted = username == this.username;
        audio.hidden = true;
        // const div = document.createElement("div");
        // div.id = `user_${username}`;
        // div.classList.add("videoWrap");
  
        // const nameContainer = document.createElement("div");
        // nameContainer.classList.add("display_name");
        // const textNode = document.createTextNode(username);
        // nameContainer.appendChild(textNode);
        // div.appendChild(nameContainer);
        // div.appendChild(video);
        // document.querySelector(".videos-inner").appendChild(div);
  
        this.trigger(_EVENTS.onRemoteTrack, stream);
      }
    }
  
    async handleIceCandidate({ candidate }) {
      if (candidate && candidate.candidate && candidate.candidate.length > 0) {
        // console.log(`candidata : ${candidate}, uqid : ${this.localUUID}`);
        const payload = {
          projectId: this.projectId,
          // projectId: this.localUUID,
          type: "ice",
          ice: candidate,
          uqid: this.localUUID,
        };
        this.connection.send(JSON.stringify(payload));
      }
    }
  
    handleConsumerIceCandidate(e, id, consumerId) {
      const { candidate } = e;
      if (candidate && candidate.candidate && candidate.candidate.length > 0) {
        const payload = {
          projectId: this.projectId,
          // projectId: this.localUUID,
          type: "consumer_ice",
          ice: candidate,
          uqid: id,
          consumerId,
        };
        this.connection.send(JSON.stringify(payload));
      }
    }
  
    handleConsume({ sdp, id, consumerId }) {
      const desc = new RTCSessionDescription(sdp);
      this.consumers
        .get(consumerId)
        .setRemoteDescription(desc)
        .catch((e) => console.log(e));
    }
  
    async createConsumeTransport(peer) {
      const consumerId = this.uuidv4();
      const consumerTransport = new RTCPeerConnection(
        this.settings.configuration
      );
      this.clients.get(peer.id).consumerId = consumerId;
      consumerTransport.id = consumerId;
      consumerTransport.peer = peer;
      this.consumers.set(consumerId, consumerTransport);
      this.consumers
        .get(consumerId)
        .addTransceiver("video", { direction: "recvonly" });
      this.consumers
        .get(consumerId)
        .addTransceiver("audio", { direction: "recvonly" });
      const offer = await this.consumers.get(consumerId).createOffer();
      await this.consumers.get(consumerId).setLocalDescription(offer);
  
      this.consumers.get(consumerId).onicecandidate = (e) =>
        this.handleConsumerIceCandidate(e, peer.id, consumerId);
  
      this.consumers.get(consumerId).ontrack = (e) => {
        this.handleRemoteTrack(e.streams[0], peer.username);
      };
  
      return consumerTransport;
    }
  
    async consumeOnce(peer) {
      const transport = await this.createConsumeTransport(peer);
      const payload = {
        projectId: this.projectId,
        // projectId: this.localUUID,
        type: "consume",
        id: peer.id,
        consumerId: transport.id,
        sdp: await transport.localDescription,
      };
  
      this.connection.send(JSON.stringify(payload));
    }
  
    async handlePeers({ peers }) {
      if (peers.length > 0) {
        for (const peer in peers) {
          this.clients.set(peers[peer].id, peers[peer]);
          await this.consumeOnce(peers[peer]);
        }
      }
    }
  
    handleAnswer({ sdp }) {
      const desc = new RTCSessionDescription(sdp);
      this.localPeer.setRemoteDescription(desc).catch((e) => console.log(e));
    }
  
    async handleNewProducer({ id, username }) {
      if (id === this.localUUID) return;
  
      this.clients.set(id, { id, username });
  
      await this.consumeOnce({ id, username });
    }
  
    handleMessage({ data }) {
      const message = JSON.parse(data);

        console.log(message)
      switch (message.type) {
        case "welcome":
          // console.log(`message.id : ${JSON.stringify(message)}`);
          this.localUUID = message.id;
          break;
        case "answer":
          this.handleAnswer(message);
          break;
        case "peers":
          this.handlePeers(message);
          break;
        case "consume":
          this.handleConsume(message);
          break;
        case "newProducer":
          this.handleNewProducer(message);
          break;
        case "user_left":
          this.removeUser(message);
          break;
      }
    }
    
    removeUser({ id }) {
      const { username, consumerId } = this.clients.get(id);
      console.log(`close ${username, consumerId}`);
      this.consumers.delete(consumerId);
      this.clients.delete(id);
      document.querySelector(`#remote_${username}`)?.srcObject.getTracks().forEach(track => track.stop());
        document.querySelector(`#user_${username}`)?.remove();

    }
  
    async connect() {
      //Produce media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
    //   this.handleRemoteTrack(stream, username.value);
      // console.log('------', sessionStorage.getItem("myNickname"));
      
      this.handleRemoteTrack(stream, this.username);
  
      this.localStream = stream;
  
      this.localPeer = this.createPeer();
  
      this.localStream
        .getTracks()
        .forEach((track) => this.localPeer.addTrack(track, this.localStream));
  
      await this.subscribe();
    }
  
    createPeer() {
      this.localPeer = new RTCPeerConnection(this.configuration);
      this.localPeer.onicecandidate = (e) => this.handleIceCandidate(e);
      //peer.oniceconnectionstatechange = checkPeerConnection;
      this.localPeer.onnegotiationneeded = () => this.handleNegotiation();
      return this.localPeer;
    }
  
    async subscribe() {
      // Consume media
      await this.consumeAll();
    }
  
    async consumeAll() {
      const payload = {
        projectId: this.projectId,
        // projectId: this.localUUID,
        type: "getPeers",
        uqid: this.localUUID,
      };
  
      this.connection.send(JSON.stringify(payload));
    }
  
    async handleNegotiation(peer, type) {
      console.log("*** negoitating ***");
      const offer = await this.localPeer.createOffer();
      await this.localPeer.setLocalDescription(offer);
      
      this.connection.send(
        JSON.stringify({
          type: "connect",
          projectId: this.projectId,
          // projectId: this.localUUID,
          sdp: this.localPeer.localDescription,
          uqid: this.localUUID,
          username: this.username || this.localUUID,
        })
      );
    }
  
    handleClose() {
      this.connection = null;
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => track.stop());
      }
      this.clients = null;
      this.consumers = null;
    }
  
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }
    render() {
        return(
            
          <div>

          </div>
        )
      }
  }
  
  export default Sfu;
