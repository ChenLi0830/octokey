/*******************************************************************************
 * Copyright (C) 2015 ZenID Inc.
 *
 * Creator: Chen Li<chen.li@noc-land.com>
 * Creation Date: 2015-3-25
 *
 * Modal component for administrators to edit/app App
 *******************************************************************************/

const {
    TableRow,
    TableRowColumn,
    Table,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    } = MUI;

import {Modal, Form, Input, Button, Checkbox, Radio, Row, Col, Tooltip, Icon, Upload } from 'antd/lib/';
const FormItem = Form.Item;

var AppModal = React.createClass({
  propTypes: {
    modalTitle: React.PropTypes.string.isRequired,
    okText: React.PropTypes.string.isRequired,
    modalOpen: React.PropTypes.bool.isRequired,
    modalOnCancel: React.PropTypes.func.isRequired,
    modalOnOk: React.PropTypes.func.isRequired,
    onLogoUpload: React.PropTypes.func.isRequired,
    fileList: React.PropTypes.array.isRequired,
    appName: React.PropTypes.string.isRequired,
    loginLink: React.PropTypes.string.isRequired,
    registerLink: React.PropTypes.string.isRequired,
    allCategories: React.PropTypes.array.isRequired,
    selectedCategories: React.PropTypes.array.isRequired,
    onCellClick: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      appName: "",
      loginLink: "",
      registerLink: "",
    };
  },

  contextTypes: {
    intl: React.PropTypes.object.isRequired,
  },

  handleUploadLogo(logoFile){
    this.props.onLogoUpload(logoFile);
  },

  handleModalOk(){
    const loginLink = this.refs.loginLink.refs.input.value;
    const registerLink = this.refs.registerLink.refs.input.value;
    const appName = this.refs.appName.refs.input.value;
    this.props.modalOnOk(loginLink, registerLink, appName);
  },

  render(){
    const {messages} = this.context.intl;

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    let categoryTableRows = this.props.allCategories.map(function (category, index) {
      const categorySelected = _.indexOf(this.props.selectedCategories, category.name) > -1;
      return <TableRow key={category._id}
                       selectable={category.name!=="all"}
                       selected={categorySelected}>
        <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
      </TableRow>
    }.bind(this));

    return <div>
      {this.props.modalOpen ?
          <Modal title={this.props.modalTitle}
                 visible={this.props.modalOpen}
                 onCancel={this.props.modalOnCancel}
                 onOk={this.handleModalOk}
                 okText={this.props.okText}
          >
            <Form horizontal>
              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appName}>
                <Input type="text" ref="appName"
                       placeholder={messages.cata_namePlaceHolder}
                       defaultValue={this.props.appName}/>
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appLoginLink}>
                <Input type="text" ref="loginLink"
                       placeholder={messages.cata_linkPlaceHolder}
                       defaultValue={this.props.loginLink}/>
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={messages.cata_appRegisterLink}>
                <Input type="text" ref="registerLink"
                       defaultValue={this.props.registerLink}/>
              </FormItem>

              <FormItem
                  label={messages.cata_appLogo}
                  help={messages["cata_logoRequirement-上传要求"]}
                  {...formItemLayout}>
                <Upload
                    action="ItIsHandledByBeforeUpload"
                    listType="picture-card"
                    fileList={this.props.fileList}
                    beforeUpload={this.handleUploadLogo}
                >
                  <Icon type="plus"/>
                  <div className="ant-upload-text">{messages["cata_uploadLogo-上传图片"]}</div>
                </Upload>
              </FormItem>
              <br/>
              <Table
                  height="200px"
                  fixedHeader={true}
                  fixedFooter={true}
                  selectable={true}
                  onCellClick={this.props.onCellClick}
                  multiSelectable={true}>
                <TableHeader enableSelectAll={false} displaySelectAll={false}
                             adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn style={{textAlign: 'center'}}>
                      {messages.cata_selectCategory}
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                    deselectOnClickaway={false}
                    showRowHover={false}
                    stripedRows={false}>
                  {categoryTableRows}
                </TableBody>
              </Table>
            </Form>
          </Modal> : null}
    </div>
  },
});

module.exports = AppModal;