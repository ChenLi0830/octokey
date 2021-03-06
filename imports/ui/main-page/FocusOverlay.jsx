/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-31
 *
 * Shadow Overlay when user click remove/edit in Apps Container, it is used to
 * differentiate apps-box from background, called by "AppsContainer"
 *******************************************************************************/
import React from "react"
import Paper from "material-ui/Paper";

var FocusOverlay = React.createClass({
  propTypes: {
    visibility: React.PropTypes.bool.isRequired
  },

  render (){
    //console.log("this.props.visibility", this.props.visibility);
    return <div style={{position:"fixed", top:0, left:0,
                            background: this.props.visibility ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.0)",
                            zIndex: this.props.visibility ? "300" : "-1",
                            width:"100%", height:"100%",
                            transition: "background-color 1s",
                            }}>
    </div>
  }
});


module.exports = FocusOverlay;