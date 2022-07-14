import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';

export default class UserVideoComponent extends Component {

    getNicknameTag() {
        // Gets the nickName of the user
        // console.log(this.props.streamManager.stream.connection.data);
        // let s = this.props.streamManager.stream.connection.data;
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
        // return JSON.parse(s.substring(0, s.indexOf('%'))).clientData;
    }

    render() {
        return (
            <div>
                {this.props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        {/* <div><p>{this.getNicknameTag()}</p></div> */}
                    </div>
                ) : null}
            </div>
        );
    }
}