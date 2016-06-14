/*******************************************************************************
 * Copyright (C) 2015-2016 Octokey Inc.
 *
 * Creator: Chen Li<yichen.li0830@gmail.com>
 * Creation Date: 2015-12-26
 *
 * Catalog Apps Box component - called by "Catalog"
 *******************************************************************************/
import React from "react";
import Paper from "material-ui/Paper"
import List from "material-ui/List"
import Subheader from "material-ui/Subheader"

import Button from "antd/lib/button"

var CatalogSingleApp = require('./CatalogSingleApp.jsx');
var AppLoading = require('../AppLoading.jsx');
var SearchBox = require('./SearchBox.jsx');

const styles = {};

const InitialFetchNumber = 20;

var CatalogAppsBox = React.createClass({
  mixins: [ReactMeteorData,],

  getMeteorData(){
    if (this.needFetchApps) {
      OctoClientAPI.fetchDataToSession("appsOfChosenCategory", "getPublicAppsOfCategory",
          this.props.chosenCategory,
          this.state.requestAppsNumber);
      this.needFetchApps = false;
    }
    const subsHandles = [
      //Subs is ready when fetched apps number = requested number OR total apps number
      Session.get("appsOfChosenCategory") &&
      (Session.get("appsOfChosenCategory").apps.length === this.state.requestAppsNumber ||
      Session.get("appsOfChosenCategory").apps.length === Session.get("appsOfChosenCategory").total)
    ];

    return {
      subsReady: OctoClientAPI.subsHandlesAreReady(subsHandles),
    };
  },

  propTypes: {
    allCategories: React.PropTypes.array.isRequired,
    subscribeList: React.PropTypes.array.isRequired,
    chosenCategory: React.PropTypes.string.isRequired,
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    //needFetchApps is used for determine whether new apps should be fetched
    this.needFetchApps = true;
    return {
      showModal: false,
      preview: null,
      editAppId: null,
      requestAppsNumber: InitialFetchNumber,//Initialed in componentWillReceiveProps
      loadingMoreApp: false,
    }
  },

  componentWillReceiveProps(nextProps){
    if (nextProps.chosenCategory !== this.props.chosenCategory) {
      //Apps should be fetched if the user chose a different category
      this.needFetchApps = true;
      this.setState({requestAppsNumber: InitialFetchNumber});
    }
  },

  handleInfiniteLoad(){
    //Won't try to load more apps when data-fetching is not finished.
    if (!this.data.subsReady) {
      return;
    }

    this.needFetchApps = true;
    this.setState({
      requestAppsNumber: Math.min(this.state.requestAppsNumber + 20,
          Session.get("appsOfChosenCategory").total),
      loadingMoreApp: true
    });
  },

  /*  elementInfiniteLoad() {
   return <AppLoading/>;
   },*/

  render(){
    if (!this.data.subsReady && !Session.get("appsOfChosenCategory")) {
      return <AppLoading/>
    }

    const {messages} = this.context.intl;

    const appsOfChosenCategory = (Session.get("appsOfChosenCategory").apps.map(function(app) {
          let logoURL = app.noLogo ? "" : OctoClientAPI.getLogoUrl(app._id);
          let subscribed = this.props.subscribeList[app._id];
          return <CatalogSingleApp key={app._id}
                                   logoURL={logoURL}
                                   appName={app.appName}
                                   loginLink={app.loginLink}
                                   registerLink={app.registerLink}
                                   selectedCategoryNames={app.categoryNames}
                                   popUpLoginFlag={app.popUpLoginFlag}
                                   homepageLink={app.homepageLink}
                                   appId={app._id}
                                   subscribed={subscribed}
                                   subsCount={app.subscribeCount}
                                   allCategories={this.props.allCategories}
          />
        }.bind(this))
    );

    const noMoreApps = appsOfChosenCategory.length === Session.get("appsOfChosenCategory").total;

    return <div className="layout-margin">
      <List style={{backgroundColor:ZenColor.white, padding:"0px"}}>
        {/*<Subheader>{messages.cata_listTitle}</Subheader>*/}
        <SearchBox zenApps={this.props.zenApps}
                   subscribeList={this.props.subscribeList}
                   allCategories={this.props.allCategories}
        />
          {appsOfChosenCategory}
      </List>

      {// Only show “加载更多” 按钮 if appsOfChosenCategory number > InitialFetchNumber
        Session.get("appsOfChosenCategory").total > InitialFetchNumber ?
            <Button
                type="dashed"
                size="large"
                loading={!this.data.subsReady}
                onClick={this.handleInfiniteLoad}
                style={{display:"block", width: "95%", margin: "20px auto", fontWeight: "300"}}>
              {noMoreApps ? messages["noMoreApps-已经到底了"] : messages["loadMoreApps-加载更多"]}
            </Button> : null}
    </div>
  }
});

module.exports = CatalogAppsBox;