const webrtc = require("wrtc");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');
const app = express();

app.use(express.static('public'));
// based on examples at https://www.npmjs.com/package/ws 
const WebSocketServer = WebSocket.Server;

let serverOptions = {
    listenPort: 3003,
    useHttps: true,
    // httpsCertFile: '/home/ubuntu/simple_sfu/ssl/cert/ssl.crt',
    // httpsKeyFile: '/home/ubuntu/simple_sfu/ssl/key/ssl.key',
    // httpsCertFile: fs.readFileSync("nolshimung.pem"),
    // httpsKeyFile: fs.readFileSync("nolshimung-key.pem")
    cert: fs.readFileSync("nolshimung.pem"),
    key: fs.readFileSync("nolshimung-key.pem")
};

let webServer = null;
webServer = https.createServer(serverOptions, app);
webServer.listen(serverOptions.listenPort);

let peers = new Map();
let consumers = new Map();

function handleTrackEvent(e, peer, ws) {
    if (e.streams && e.streams[0]) {
        peers.get(peer).stream = e.streams[0];

        const payload = {
            type: 'newProducer',
            id: peer,
            username: peers.get(peer).username
        }
        wss.broadcast(JSON.stringify(payload));
    }
}

function createPeer() {
    let peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: 'turn:3.34.53.247',
                username: 'admin',
                credential: 'jgjg1234'
            },
            // { urls: 'stun:stun01.sipphone.com' },
            // { urls: 'stun:stun.ekiga.net' },
            // { urls: 'stun:stun.fwdnet.net' },
            // { urls: 'stun:stun.ideasip.com' },
            // { urls: 'stun:stun.iptel.org' },
            // { urls: 'stun:stun.rixtelecom.se' },
            // { urls: 'stun:stun.schlund.de' },
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            // { urls: 'stun:stunserver.org' },
            // { urls: 'stun:stun.softjoys.com' },
            // { urls: 'stun:stun.voiparound.com' },
            // { urls: 'stun:stun.voipbuster.com' },
            // { urls: 'stun:stun.voipstunt.com' },
            // { urls: 'stun:stun.voxgratia.org' },
            // { urls: 'stun:stun.xten.com' },
            // {
            //     urls: 'turn:numb.viagenie.ca',
            //     credential: 'muazkh',
            //     username: 'webrtc@live.com'
            // },
            // {
            //     urls: 'turn:192.158.29.39:3478?transport=udp',
            //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            //     username: '28224511:1379330808'
            // },
            // {
            //     urls: 'turn:192.158.29.39:3478?transport=tcp',
            //     credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            //     username: '28224511:1379330808'
            // }
        ]
    });

    return peer;
}

// Create a server for handling websocket calls
const wss = new WebSocketServer({ server: webServer });
let rooms = {};
let users = [{name: 'JG', use:false}, {name:'JG1', use:false}, {name:'JG2',use:false}, {name:'JG3',use:false}, {name:'JG4',use:false}, {name:'JG5',use:false}];

wss.on('connection', function (ws, req) {
    // let peerId = uuidv4();
    let peerId = '';
    for(let i=0; i < users.length; i++){
        if (!users[i].use) {
            peerId = users[i].name
            users[i].use = 1
            break;
        }
    } 
    // const projectId = req.url.split('?')[1].split('/')[0];
    // const id = req.url.split('?')[1].split('/')[1]
    ws.id = peerId;
    ws.on('close', (event) => {
        peers.delete(ws.id);
        consumers.delete(ws.id);
        for(let i=0; i<users.length; i++){
            if (users[i].name == peerId) {
                users[i].use = 0
                break
            }
        }
        // console.log(JSON.stringify(users))
        wss.broadcast(JSON.stringify({
            type: 'user_left',
            id: ws.id
        }));
    });

    // console.log(`peerId : ${peerId}`)
    ws.send(JSON.stringify({ 'type': 'welcome', 'id': peerId }));

    ws.on('message', async function (message) {
        const body = JSON.parse(message);
        switch (body.type) {
            case 'connect':
                // console.log('connect!!!!!!!!!!! ');
                // console.log('uqid = ', body.uqid)
                peers.set(body.uqid, { socket: ws });
                const peer = createPeer();
                peers.get(body.uqid).username = body.username;
                peers.get(body.uqid).peer = peer;
                // console.log(`peer : ${peers.get(body.uqid).peer}`);
                peer.ontrack = (e) => { handleTrackEvent(e, body.uqid, ws) };
                const desc = new webrtc.RTCSessionDescription(body.sdp);
                await peer.setRemoteDescription(desc);
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                // console.log(`connected, id : ${body.username}`)


                const payload = {
                    type: 'answer',
                    sdp: peer.localDescription
                }

                ws.send(JSON.stringify(payload));
                break;
            case 'getPeers':
                let uuid = body.uqid;
                const list = [];
                peers.forEach((peer, key) => {
                    // console.log(`key == uuid ? ${key}, ${uuid}`)
                    if (key != uuid) {
                        const peerInfo = {
                            id: key,
                            username: peer.username,
                        }
                        list.push(peerInfo);
                    }
                });
                // console.log(`getPeers : ${list}`)
                const peersPayload = {
                    type: 'peers',
                    peers: list
                }
                ws.send(JSON.stringify(peersPayload));
                break;
            case 'ice':
                const user = peers.get(body.uqid);
                // for (let k of peers.keys()){
                //     console.log(`ice, user : ${k}`);
                // }
                // console.log('length: ', peers.size);
                if (user.peer)
                    user.peer.addIceCandidate(new webrtc.RTCIceCandidate(body.ice)).catch(e => console.log(e));
                break;
            case 'consume':
                try {
                    let { id, sdp, consumerId } = body;
                    const remoteUser = peers.get(id);
                    const newPeer = createPeer();
                    consumers.set(consumerId, newPeer);
                    const _desc = new webrtc.RTCSessionDescription(sdp);
                    await consumers.get(consumerId).setRemoteDescription(_desc);

                    remoteUser.stream.getTracks().forEach(track => {
                        consumers.get(consumerId).addTrack(track, remoteUser.stream);
                    });
                    const _answer = await consumers.get(consumerId).createAnswer();
                    await consumers.get(consumerId).setLocalDescription(_answer);

                    const _payload = {
                        type: 'consume',
                        sdp: consumers.get(consumerId).localDescription,
                        username: remoteUser.username,
                        id,
                        consumerId
                    }

                    ws.send(JSON.stringify(_payload));
                } catch (error) {
                    console.log(error)
                }

                break;
            case 'consumer_ice':
                if (consumers.has(body.consumerId)) {
                    consumers.get(body.consumerId).addIceCandidate(new webrtc.RTCIceCandidate(body.ice)).catch(e => console.log(e));
                }
                break;
            default:
                wss.broadcast(message);

        }
    });

    ws.on('error', () => ws.terminate());
});

wss.broadcast = function (data) {
    peers.forEach(function (peer) {
        if (peer.socket.readyState === WebSocket.OPEN) {
            peer.socket.send(data);
        }
    });
};


module.exports = wss;