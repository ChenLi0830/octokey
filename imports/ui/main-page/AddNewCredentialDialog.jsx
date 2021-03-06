/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Dialog for Add New Account for an App, this should present when user choose to add a new app
 * from edit catalog, called by "EditDialog"
 *******************************************************************************/
import React from "react";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

var AddNewCredentialDialog = React.createClass({
  propTypes: {
    appName: React.PropTypes.string.isRequired,
    appId: React.PropTypes.string.isRequired,
    isPublicApp: React.PropTypes.bool.isRequired,
    openDialogAdd: React.PropTypes.bool.isRequired,
    whenCloseDialog: React.PropTypes.func.isRequired,
    hexIv: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return {
      floatingUserText: "",
      floatingPassText: "",
      userNameFilled: false,
      passwordFilled: false,
    }
  },

  render(){
    const {messages} = this.context.intl;
    const actions = [
      <FlatButton
          label={messages.app_credentialDialogCancel}
          primary={true}
          onTouchTap={this.props.whenCloseDialog}/>,
      <FlatButton
          primary={ true }
          label={messages.app_newCredentialDialogAdd}
          onTouchTap={this.handleSaveAccount}/>
    ];

    return <Dialog title={this.props.appName + "-" + messages.app_newCredentialDialogTitle}
                   actions={actions}
                   contentStyle={{
                            width: '20%',
                            minWidth: '200px',}}
                   autoDetectWindowHeight={false}
                   autoScrollBodyContent={true}

                   open={this.props.openDialogAdd}
                   onRequestClose={this.props.whenCloseDialog}>

      {/*This is here to stop chrome's username and password autofill*/}
      <input style={{display:"none"}} type="text" name="fakeusernameremembered"/>
      <input style={{display:"none"}} type="password" name="fakepasswordremembered"/>

      <TextField
          ref="username"
          style={{fontWeight:"300"}}
          floatingLabelStyle={{fontWeight:"300"}}
          errorText={this.state.floatingUserText}
          onChange={this.handleInputErrorCheckUser}
          onKeyPress={(e)=>{e.key==='Enter' && this.handleSaveAccount()}}
          hintText={messages.app_username}/>
      <br/>
      <TextField
          ref="password"
          type="password"
          style={{fontWeight:"300"}}
          floatingLabelStyle={{fontWeight:"300"}}
          errorText={this.state.floatingPassText}
          onChange={this.handleInputErrorCheckPass}
          onKeyPress={(e)=>{e.key==='Enter' && this.handleSaveAccount()}}
          hintText={messages.app_password}/>
    </Dialog>
  },

  handleSaveAccount(){
    /* Error check */
    this.handleInputErrorCheckUser();
    this.handleInputErrorCheckPass();

    /* Save data & Handle login */
    let username = this.refs.username.getValue();
    let password = this.refs.password.getValue();

    if (username && password) {
      let hexKey = Session.get("hexKey");
      if (!hexKey) throw Meteor.Error("Can't find master password key");
      let encryptedPwd = OctoClientAPI.encrypt(password, hexKey, this.props.hexIv);

      if (this.props.isPublicApp) {
        Meteor.call("isUsernameExist", this.props.appId, username, (error, usernameExist)=> {
          if (error) {
            return console.log("error", error)
          }

          if (usernameExist) {
            Meteor.call("updateUserCredential", this.props.appId, username, encryptedPwd,
                OctoClientAPI.handleMeteorError(error));
          } else {
            Meteor.call("appAddUsername", this.props.appId, username, (error)=> {
              OctoClientAPI.handleMeteorError(error);
              Meteor.call("addNewCredential", this.props.appId, username, encryptedPwd,
                  OctoClientAPI.handleMeteorError(error));
            });
          }
        });
        this.props.whenCloseDialog();
      } else {
        alert("TODO: adding credentials for the private app");
      }
      //TODO 询问用户是否登录成功,如果否,删除用户登录信息,保留textFields, 如果是,关闭modal.
    }
  },

  handleInputErrorCheckUser(){
    let userName = this.refs.username.getValue();
    if (!userName) {
      this.setState({floatingUserText: this.context.intl.messages.login_usernameEmpty});
    } else {
      this.setState({floatingUserText: ""});
    }
  },

  handleInputErrorCheckPass(){
    let password = this.refs.password.getValue();
    if (!password) {
      this.setState({floatingPassText: this.context.intl.messages.login_pwdEmpty});
    } else {
      this.setState({floatingPassText: ""});
    }
  },
});

module.exports = AddNewCredentialDialog;