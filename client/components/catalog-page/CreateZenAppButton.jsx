const {Button,
    Modal,
    Input,
    ButtonInput,
    Col,
    Image,
    Row
    } = ReactBootstrap;

const {
    RaisedButton,
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
    TableFooter,
    Divider
    } = MUI;

var selectedCategories = [0];

CreateZenAppButton = React.createClass({
    propTypes: {
        zenCategories: React.PropTypes.array.isRequired
    },

    contextTypes: {
        intl: React.PropTypes.object.isRequired,
    },

    getInitialState() {//for modal
        return {
            showModal: false,
            preview: "",
        };
    },

    close() {//for modal
        this.setState({
            showModal: false,
            preview: "",
        });
    },

    open() {//for modal
        this.setState({showModal: true});
    },


    render(){
        const {messages} = this.context.intl;
        let button = (<div style={{textAlign:"center", padding:"10px 0 20px 0"}}>
            <RaisedButton label={messages.cata_createPubApp}
                          primary={true}
                          onClick={this.open}
                          labelStyle={{color:"white"}}/>
        </div>);

        let categoryTableRows = this.props.zenCategories.map(function (category) {
            return <TableRow key={category._id}
                             selectable={category.name!=="all"}
                             selected={category.name==="all"}>
                <TableRowColumn>{category.displayTitleChinese}</TableRowColumn>
            </TableRow>
        });


        return <div>
            {button}
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{messages.cata_createPubApp}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handlePublicSubmit}>
                        <Input type="text" ref="appName"
                               label={messages.cata_appName}
                               placeholder={messages.cata_namePlaceHolder}/>

                        <Input type="text" ref={(c) => this.refs.loginLink = c}
                               label={messages.cata_appLoginLink}
                               placeholder={messages.cata_linkPlaceHolder}/>

                        <Input type="file"
                               label={messages.cata_appLogo}
                               ref="logoFile"
                               accept=".png, .jpg"
                               onChange={this.handleLogoUpload}
                               help=""/>
                        <Row>
                            <Col xs={6} md={4}>
                                <Image ref="preview" src={this.state.preview} rounded/>
                            </Col>
                        </Row>

                        <hr/>

                        <Table
                            height="200px"
                            fixedHeader={true}
                            fixedFooter={true}
                            selectable={true}
                            onCellClick={this.onCellClick}
                            multiSelectable={true}>
                            <TableHeader enableSelectAll={false} displaySelectAll={false} adjustForCheckbox={false}>
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
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handlePublicSubmit}>{messages.cata_createBtn}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    },

    onCellClick(rowNumber, columnId){
        var selectedIndex = selectedCategories.indexOf(rowNumber);
        if (selectedIndex > -1) {
            selectedCategories.splice(selectedIndex, 1);
        }
        else {
            selectedCategories.push(rowNumber);
        }
        //console.log("selectedCategories",selectedCategories);
    },


    handlePublicSubmit(event){
        event.preventDefault();

        var selectedCategoryNames = selectedCategories.map(function (categoryNum) {
            return this.props.zenCategories[categoryNum].name;
        }.bind(this));

        //console.log("selectedCategoryNames",selectedCategoryNames);
        console.log("this.refs.loginLink", this.refs.loginLink);
        console.log("this.refs.appName", this.refs.appName);

        const appName = this.refs.appName.refs.input.value;
        const loginLink = this.refs.loginLink.refs.input.value;


        if (loginLink && appName && this.state.preview !== "") {
            //console.log("this.state.preview", this.state.preview);
            Meteor.call("addZenApp", appName, loginLink, this.state.preview, selectedCategoryNames,
                function (error, result) {
                    if (error) {
                        throw new Meteor.Error(error);
                    }
                    this.close();
                }.bind(this));
        } else {
            alert(this.context.intl.messages.cata_createAppAlert)
        }
    },

    handleLogoUpload(){
        let logoFile = this.refs.logoFile.refs.input.files[0];
        let reader = new FileReader();

        reader.onloadend = function () {
            this.setState({
                preview: reader.result
            });
        }.bind(this);

        reader.readAsDataURL(logoFile);
    }
});