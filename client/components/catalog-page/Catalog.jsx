/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-12-26
 *
 * Catalog page component, called by "routes", used by "App"
 *******************************************************************************/
var CatalogSideBar = require('./CatalogSidebar.jsx');
var CatalogAppsBox = require('./CatalogAppsBox.jsx');
var AppLoading = require('../AppLoading.jsx');

import { Row, Col } from 'antd';

var Catalog = React.createClass({
    mixins: [
        Reflux.listenTo(CategoryStore, 'categoryChange')
    ],

    propTypes:{
        subsReady: React.PropTypes.bool.isRequired,
        subscribeList: React.PropTypes.array.isRequired,
        allPublicApps: React.PropTypes.array.isRequired,
        allCategories: React.PropTypes.array.isRequired,
    },

    getInitialState(){
        return {
            chosenCategory: "all",
        }
    },

    render(){
        if (!this.props.subsReady){
            return <AppLoading/>
        }
        return <div>
            <div>
                <Row>
                    <Col span="6">
                        <CatalogSideBar zenCategories={this.props.allCategories}
                                        zenApps={this.props.allPublicApps}
                                        subscribeList={this.props.subscribeList}
                        />
                    </Col>
                    <Col span="18">
                        <CatalogAppsBox zenCategories={this.props.allCategories}
                                        subscribeList={this.props.subscribeList}
                                        chosenCategory={this.state.chosenCategory}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    },

    categoryChange(event, categoryName){
        //console.log("event",event);
        this.setState({
            chosenCategory: categoryName
        });
    }
});

module.exports = Catalog;