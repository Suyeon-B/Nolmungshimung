import React, { useState, useRef } from "react";
var OpenVidu = require("openvidu-browser")
var OV;
var session;

var sessionName;	// Name of the video session the user will connect to
var loggedUser;
var token;			// Token retrieved from OpenVidu Server


/* OPENVIDU METHODS */

function joinSession() {

	document.getElementById("join-btn").disabled = true;
	document.getElementById("join-btn").innerHTML = "Joining...";

	getToken((token) => {

		// --- 1) Get an OpenVidu object ---

		OV = new OpenVidu();

		// --- 2) Init a session ---

		session = OV.initSession();
		// console.log(`session : ${JSON.stringify(session)}`);
		// --- 3) Specify the actions when events take place in the session ---

		// On every new Stream received...
		session.on('streamCreated', (event) => {

			// Subscribe to the Stream to receive it
			// HTML video will be appended to element with 'video-container' id
			var subscriber = session.subscribe(event.stream, 'video-container');

			// When the HTML video has been appended to DOM...
			subscriber.on('videoElementCreated', (event) => {
				// Add a new HTML element for the user's name and nickname over its video
				appendUserData(event.element, subscriber.stream.connection);
			});
		});

		// On every Stream destroyed...
		session.on('streamDestroyed', (event) => {
			// Delete the HTML element with the user's name and nickname
			removeUserData(event.stream.connection);
		});

		// On every asynchronous exception...
		session.on('exception', (exception) => {
			console.warn(exception);
		});

		// --- 4) Connect to the session passing the retrieved token and some more data from
		//        the client (in this case a JSON with the nickname chosen by the user) ---

		// var nickName = $("#nickName").val();
		var nickName = document.getElementById('nickName').val();
		session.connect(token, { clientData: nickName })
			.then(() => {

				// --- 5) Set page layout for active call ---
				var userName = document.getElementById("user").val();
				document.getElementById('session-title').text(sessionName);
				document.getElementById('join').hide();
				document.getElementById('session').show();

				// Here we check somehow if the user has 'PUBLISHER' role before
				// trying to publish its stream. Even if someone modified the client's code and
				// published the stream, it wouldn't work if the token sent in Session.connect
				// method is not recognized as 'PUBLIHSER' role by OpenVidu Server
				if (isPublisher(userName)) {

					// --- 6) Get your own camera stream ---

					var publisher = OV.initPublisher('video-container', {
						audioSource: undefined, // The source of audio. If undefined default microphone
						videoSource: undefined, // The source of video. If undefined default webcam
						publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
						publishVideo: false,  	// Whether you want to start publishing with your video enabled or not
						resolution: '640x480',  // The resolution of your video
						frameRate: 30,			// The frame rate of your video
						insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
						mirror: false       	// Whether to mirror your local video or not
					});

					// --- 7) Specify the actions when events take place in our publisher ---

					// When our HTML video has been added to DOM...
					publisher.on('videoElementCreated', (event) => {
						// Init the main video with ours and append our data
						var userData = {
							nickName: nickName,
							userName: userName
						};
						initMainVideo(event.element, userData);
						appendUserData(event.element, userData);
						// $(event.element).prop('muted', true); // Mute local video
					});


					// --- 8) Publish your stream ---

					session.publish(publisher);

				} else {
					console.warn('You don\'t have permissions to publish');
					initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
				}
			})
			.catch(error => {
				console.warn('There was an error connecting to the session:', error.code, error.message);
				enableBtn();
			});
	});

	return false;
}

function leaveSession() {

	// --- 9) Leave the session by calling 'disconnect' method over the Session object ---

	session.disconnect();
	session = null;

	// Removing all HTML elements with the user's nicknames
	cleanSessionView();

	document.getElementById('join').show();
	document.getElementById('session').hide();

	// eneble button
	enableBtn();
}

/* OPENVIDU METHODS */

function enableBtn (){
	document.getElementById("join-btn").disabled = false;
	document.getElementById("join-btn").innerHTML = "Join!";
}

/* APPLICATION REST METHODS */

function logIn() {
	var user = document.getElementById("user").val(); // Username
	var pass = document.getElementById("pass").val(); // Password

	httpPostRequest(
		'http://localhost:7443//api-login/login',
		{user: user, pass: pass},
		'Login WRONG',
		(response) => {
			document.getElementById('name-user').text(user);
			document.getElementById('not-logged').hide();
			document.getElementById('logged').show();
			// Random nickName and session
			document.getElementById('sessionName').val("Session " + Math.floor(Math.random() * 10));
			document.getElementById('nickName').val("Participant " + Math.floor(Math.random() * 100));
		}
	);
}

function logOut() {
	httpPostRequest(
		'http://localhost:7443/api-login/logout',
		{},
		'Logout WRONG',
		(response) => {
			document.getElementById('not-logged').show();
			document.getElementById('logged').hide();
		}
	);
	
	enableBtn();
}

function getToken(callback) {
	sessionName = document.getElementById('sessionName').val; // Video-call chosen by the user
	loggedUser = document.getElementById('nickName').val();
	httpPostRequest(
		'http://localhost:7443/api-sessions/get-token',
		{sessionName: sessionName,
			loggedUser: loggedUser},
		'Request of TOKEN gone WRONG:',
		(response) => {
			token = response[0]; // Get token from response
			console.warn('Request of TOKEN gone WELL (TOKEN:' + token + ')');
			callback(token); // Continue the join operation
		}
	);
}

function removeUser() {
	httpPostRequest(
		'http://localhost:7443/api-sessions/remove-user',
		{sessionName: sessionName, token: token},
		'User couldn\'t be removed from session',
		(response) => {
			console.warn("You have been removed from session " + sessionName);
		}
	);
}

function httpPostRequest(url, body, errorMsg, callback) {
	var http = new XMLHttpRequest();
	http.open('POST', url, true);
	http.setRequestHeader('Content-type', 'application/json');
	http.addEventListener('readystatechange', processRequest, false);
	http.send(JSON.stringify(body));

	function processRequest() {
		if (http.readyState == 4) {
			if (http.status == 200) {
				try {
					callback(JSON.parse(http.responseText));
				} catch (e) {
					callback();
				}
			} else {
				console.warn(errorMsg);
				console.warn(http.responseText);
			}
		}
	}
}

/* APPLICATION REST METHODS */



/* APPLICATION BROWSER METHODS */

window.onbeforeunload = () => { // Gracefully leave session
	if (session) {
		removeUser();
		leaveSession();
	}
	logOut();
}

function appendUserData(videoElement, connection) {
	var clientData;
	var serverData;
	var nodeId;
	if (connection.nickName) { // Appending local video data
		clientData = connection.nickName;
		serverData = connection.userName;
		nodeId = 'main-videodata';
	} else {
		clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
		serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
		nodeId = connection.connectionId;
	}
	var dataNode = document.createElement('div');
	dataNode.className = "data-node";
	dataNode.id = "data-" + nodeId;
	dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
	videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
	addClickListener(videoElement, clientData, serverData);
}

function removeUserData(connection) {
	var userNameRemoved = document.getElementById("data-" + connection.connectionId);
	if ((userNameRemoved).find('p.userName').html() === document.getElementById('main-video p.userName').html()) {
		cleanMainVideo(); // The participant focused in the main video has left
	}
	document.getElementById("data-" + connection.connectionId).remove();
}

function removeAllUserData() {
	document.getElementsByClassName("data-node").remove();
}

function cleanMainVideo() {
	document.getElementById('main-video video').get(0).srcObject = null;
	document.getElementById('main-video p').each(function () {
		// $(this).html('');
	});
}

function addClickListener(videoElement, clientData, serverData) {
	videoElement.addEventListener('click', function () {
		var mainVideo = document.getElementById('main-video video').get(0);
		if (mainVideo.srcObject !== videoElement.srcObject) {
			document.getElementById('main-video').fadeOut("fast", () => {
				document.getElementById('main-video p.nickName').html(clientData);
				document.getElementById('main-video p.userName').html(serverData);
				mainVideo.srcObject = videoElement.srcObject;
				document.getElementById('main-video').fadeIn("fast");
			});
		}
	});
}

function initMainVideo(videoElement, userData) {
	document.getElementById('main-video video').get(0).srcObject = videoElement.srcObject;
	document.getElementById('main-video p.nickName').html(userData.nickName);
	document.getElementById('main-video p.userName').html(userData.userName);
	document.getElementById('main-video video').prop('muted', true);
}

function initMainVideoThumbnail() {
	document.getElementById('main-video video').css("background", "url('images/subscriber-msg.jpg') round");
}

function isPublisher(userName) {
	// return userName.includes('publisher');
	return true
}

function cleanSessionView() {
	removeAllUserData();
	cleanMainVideo();
    document.getElementById('main-video video').css("background", "");
}


export default function() {
	const [inputs, setInputs] = useState({
		nickname: '',
		sessionName: ''
	});
	const nameInput = useRef();
	
	const { nickname, sessionName } = inputs; // 비구조화 할당을 통해 값 추출
	
	const onChange = e => {
		const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
		setInputs({
		...inputs, // 기존의 input 객체를 복사한 뒤
		[name]: value // name 키를 가진 값을 value 로 설정
		});
	};
	
	const onReset = () => {
		setInputs({
		nickname: '',
		sessionName: ''
		});
		nameInput.current.focus();
	};

	  return (
		<div>
		<input
		  name="nickName"
		  placeholder="이름"
		  onChange={onChange}
		  value={nickname}
		  ref={nameInput}
		/>
		<input
		  name="sessionName"
		  placeholder="세션"
		  onChange={onChange}
		  value={sessionName}
		/>
		<button onClick={onReset}>쪼인</button>
		<div>
		  <b>값: </b>
		  {nickname} ({sessionName})
		</div>
	  </div>
		// <div id="main-container" className="container">
		// 	<div id="logged">
		// 	  <div id="join" className="vertical-center">
		// 		<div id="join-dialog" className="jumbotron">
		// 		  <h1>Join a video session</h1>
		// 		  <form className="form-group">
		// 			<p>
		// 			  <label>Participant</label>
		// 			  <input className="form-control" type="text" id="nickName" required />
		// 			</p>
		// 			<p>
		// 			  <label>Session</label>
		// 			  <input className="form-control" type="text" id="sessionName" required />
		// 			</p>
		// 			<p className="text-center">
		// 			  <button className="btn btn-lg btn-success" id="join-btn" onClick= {joinSession} >Join!</button>
		// 			</p>
		// 		  </form>
		// 		  <hr />
		// 		  <div id="login-info">
		// 			<div>Logged as <span id="name-user" /></div>
		// 			<button id="logout-btn" className="btn btn-warning" onClick= {logOut}>Log out</button>
		// 		  </div>
		// 		</div>
		// 	  </div>
		// 	</div>
		// </div>
	  );
	}