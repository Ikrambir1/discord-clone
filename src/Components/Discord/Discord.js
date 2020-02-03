import React, { Component } from "react";
import "./Discord.scss";
import SidePannel from "./SidePannel/SidePannel";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { removeServer, selectServer } from "../../Reudux/Actions";
import Channels from "./Channels/Channels";
import UserPannel from "./UserPannel/UserPannel";
import Messages from "./Messages/Messages";
import Extra from "./Extra/Extra";
import ServerUsers from "./Messages/ServerInfo/ServerUsers";

const extra = ["totalServers"];
class Discord extends Component {
  state = {};

  changeCurrentSelected = to => {
    if (to.server) {
      const userRole = this.props.joinedServers[to.server].users[
        this.props.user.uid
      ].role;
      const roles = this.props.joinedServers[to.server].roles;
      const role = this.props.joinedServers[to.server].roles[userRole] || null;
      to.role = role;
      to.roles = roles;
    }
    this.props.selectServer(to);
  };

  getMessages = messages => {
    try {
      return messages[this.props.server][this.props.channel.id];
    } catch (e) {
      return null;
    }
  };

  render() {
    const {
      user,
      joinedServers,
      removeServer,
      messages,
      server,
      channel,
      role,
      roles,
      selectedDM,
      dms
    } = this.props;
    return (
      <div className="discord">
        <SidePannel
          selectedServer={server}
          changeCurrentSelected={this.changeCurrentSelected}
          firebase={firebase}
          user={user}
          joinedServers={joinedServers}
        />
        {server !== null ? (
          <Channels
            selectedServer={joinedServers[server]}
            selectedChannel={channel}
            removeServer={removeServer}
            uid={user.uid}
            changeCurrentSelected={this.changeCurrentSelected}
            userRole={role}
          />
        ) : (
          <UserPannel
            changeCurrentSelected={this.changeCurrentSelected}
            selectedDM={selectedDM}
            dms={dms}
            userUid={user.uid}
          />
        )}
        {server ? (
          <div className="messages-wrapper">
            <Messages
              server={joinedServers[server]}
              messages={this.getMessages(messages)}
              channel={channel}
              user={user}
              userRole={role}
              roles={roles}
            />
            <ServerUsers roles={roles} users={joinedServers[server].users} />
          </div>
        ) : extra.includes(selectedDM) ? (
          <Extra extra={selectedDM} />
        ) : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeServer: id => dispatch(removeServer(id)),
    selectServer: id => dispatch(selectServer(id))
  };
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    joinedServers: state.server.joinedServers,
    messages: state.server.messages,
    server: state.server.server,
    channel: state.server.channel,
    selectedDM: state.server.dm,
    role: state.server.role,
    roles: state.server.roles,
    dms: state.server.dms
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Discord);
