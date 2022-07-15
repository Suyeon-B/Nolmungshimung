import React, {Component} from 'react';
import {OpenVidu} from 'openvidu-browser'
import axios from 'axios';
// import './App.css';
import UserVideoComponent from './UserVideoComponent';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mySessionId: 'SessionA',
            myId: 'publisher1',
            myPassword: 'pass',
            mySubscribers: [],
            myToken: undefined,
            session: undefined,
            publisher: undefined,
            mainStreamManager: undefined
        };
        this.OV = undefined;
    }

    componentDidMount() {
        axios.get(`https://${process.env.REACT_APP_SERVER_IP}:8443/voicetalk/users`)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error)
            });
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    connServer = () => {
        this.OV = new OpenVidu();
        this.setState({
            session: this.OV.initSession()
        }, () => {
            const {myId, myPassword, mySessionId, session} = this.state;
            axios.post(`https://${process.env.REACT_APP_SERVER_IP}:8443/voicetalk/connect`, {
                params: {
                    id: myId,
                    password: myPassword,
                    sessionId: mySessionId
                }
            })
                .then(response => {
                    const {sessionName, token, userName} = response.data;

                    this.setState({
                        mySessionId: sessionName,
                        myToken: token
                    });

                    session.connect(token, {clientData: userName})
                        .then(() => {

                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined, // The source of audio. If undefined default microphone
                                videoSource: undefined, // The source of video. If undefined default webcam
                                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                                resolution: '640x480', // The resolution of your video
                                frameRate: 30, // The frame rate of your video
                                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                                mirror: false, // Whether to mirror your local video or not
                            });

                            session.publish(publisher);
                            this.setState({
                                publisher: publisher,
                                mainStreamManager: publisher
                            });
                        })
                        .catch((err) => {
                            console.log(`error ${err}`)
                        });


                    // Stream Created Event
                    session.on('streamCreated', (event) => {
                        let subscriber = session.subscribe(event.stream, undefined);
                        let subscribers = this.state.mySubscribers;
                        subscribers.push(subscriber);
                        this.setState({
                            mySubscribers: subscribers
                        });
                    });

                    // On every Stream destroyed...
                    session.on('streamDestroyed', (event) => {
                        // Remove the stream from 'subscribers' array
                        console.log("streamDestoryed");

                        this.deleteSubscriber(event.stream.streamManager);
                    });
                })
                .catch(response => console.log(response))
        })
    };


    /**
     * @description Send events to the server
     * */
    onbeforeunload = () => {
        const {myToken, mySessionId} = this.state;
        const params = {"token": myToken, "sessionName": mySessionId};

        axios.post(`https://${process.env.REACT_APP_SERVER_IP}:8443/voicetalk/leaveSession`, {params : params})
            .then(response => {
                this.leaveSession();
            })
            .catch(error => {
                console.error(error)
            });
    };


    /**
     * @description Delete streamManager from mySubscribers;
     * */
    deleteSubscriber = (streamManager) => {
        let subscribers = this.state.mySubscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.setState({
                mySubscribers: subscribers
            });
        }
    }

    /**
     * @description Switch selected element to main Video.
     *
     * @param {Object} stream - selected Video Stream
     * */
    handleMainVideoStream = (stream) => {
        if (this.state.mainStreamManager !== stream) {
            this.setState({
                mainStreamManager: stream
            })
        }
    };


    /**
     * @description leaveSession , initial state
     * */
    leaveSession = () => {

        // disconnect session
        let {session} = this.state;
        if (session) {
            session.disconnect();
        }

        // default settings
        this.OV = null;
        this.setState({
            mySessionId: 'SessionA',
            myId: 'publisher1',
            myPassword: 'pass',
            mySubscribers: [],
            publisher: undefined,
            mainStreamManager: undefined
        });
    };

    /**
     * @description Input element setState Event
     *
     * @param {Object} e - onChange Event
     */
    onChange = (e) => {
        const {name, value} = e.target;
        this.setState({
            [name]: value
        })
    };

    render() {
        const {publisher, myId, myPassword, mySessionId, mainStreamManager, mySubscribers} = this.state;
        return (
            <div className="container">
                {publisher === undefined ? (
                    <div id="join">
                        <div id="img-div">
                            <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo"/>
                        </div>
                        <div id="join-dialog" className="jumbotron vertical-center">
                            <h1> Join a video session </h1>
                            <form className="form-group">
                                <p>
                                    <label>Id: </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="myId"
                                        name="myId"
                                        value={myId}
                                        onChange={this.onChange}

                                    />
                                </p>
                                <p>
                                    <label> Password: </label>
                                    <input
                                        className="form-control" type="text" id="myPassword" name="myPassword"
                                        value={myPassword}  onChange={this.onChange}  required/>
                                </p>
                                <p>
                                    <label> Session: </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="mySessionId"
                                        name="mySessionId"
                                        onChange={this.onChange}
                                        value={mySessionId}
                                        required
                                    />
                                </p>
                                <p className="text-center">
                                    <input className="btn btn-lg btn-success" name="commit" type="button" value="JOIN"
                                           onClick={this.connServer}/>
                                </p>
                            </form>
                        </div>
                    </div>
                ) : null}

                {publisher !== undefined ? (
                    <div id="session">
                        <div id="session-header">
                            <h1 id="session-title">{mySessionId}</h1>
                            <input
                                className="btn btn-large btn-danger"
                                type="button"
                                id="buttonLeaveSession"
                                onClick={this.onbeforeunload}
                                value="Leave session"
                            />
                        </div>

                        {/* Main Video Stream*/}
                        {mainStreamManager !== undefined ? (
                            <div id="main-video" className="stream-container col-md-6 col-xs-6">
                                <UserVideoComponent streamManager={mainStreamManager}/>
                            </div>
                        ) : null}
                        <div id="video-container" className="col-md-6">

                            {/* my Video Stream*/}
                            {publisher !== undefined ? (
                                <div className="stream-container col-md-6 col-xs-6"
                                     onClick={() => this.handleMainVideoStream(publisher)}>
                                    <UserVideoComponent
                                        streamManager={publisher}/>
                                </div>
                            ) : null}


                            {/* my , other Video Stream */}
                            {mySubscribers.map((sub, i) => (
                                <div className="stream-container col-md-6 col-xs-6"
                                     onClick={() => this.handleMainVideoStream(sub)}>
                                    <UserVideoComponent streamManager={sub} key={i}/>
                                </div>
                            ))}
                        </div>

                    </div>
                ) : null}
            </div>
        );
    }
}

export default App;