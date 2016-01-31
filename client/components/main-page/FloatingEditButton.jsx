const {
    FloatingActionButton,
    } = MUI;

const {
    ToggleStar,
    ActionList,
    ContentCreate,
    ContentAdd,
    ContentRemove,
    ActionSettings,
    } = SvgIcons;

FloatingEditButton = React.createClass({

    propTypes: {
        whenEditButtonClicked: React.PropTypes.func.isRequired,
        userEditStatus: React.PropTypes.string.isRequired,
    },

    getInitialState(){
        return {
            FABActive: false,
        }
    },

    render(){
        let miniButtonIconElements = [/*<ContentCreate/>, */<ContentAdd/>, <ContentRemove/>, <ContentCreate/>];
        let miniIconColor = [
            {background: ZenColor.cyan, icon: ZenColor.white},
            {background: ZenColor.orange, icon: ZenColor.white},
            {background: ZenColor.blueGrey, icon: ZenColor.white},
            {background: ZenColor.cyan, icon: ZenColor.white}
        ];

        let buttonList = miniButtonIconElements.map(function (iconElement, i) {
            let basicLiStyle = this.state.FABActive ?
            {
                transform: "scaleY(1) scaleX(1) translateY(0px) translateX(0px)",
                opacity: 1,
                transitionDuration: "0.3s",
                visibility: "visible"
            }
                : {
                transform: "scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)",
                opacity: 0,
                transitionDuration: "0.2s",
                visibility: "hidden"
            };
            basicLiStyle.transitionDelay = (miniButtonIconElements.length - i) * 0.05 + "s";
            return <li style={basicLiStyle} key={i}>
                <FloatingActionButton
                    secondary={true} mini={true}
                    backgroundColor={miniIconColor[i].background}
                    iconStyle={{fill:miniIconColor[i].icon}}
                    onTouchTap={this.props.whenEditButtonClicked.bind(null,i)}>
                    {iconElement}
                </FloatingActionButton>
            </li>
        }.bind(this));

        const FAB = this.getFAB(this.props.userEditStatus, buttonList);

        return FAB;
    },

    getFAB(userEditStatus, buttonList){
        switch (userEditStatus) {
            case "default":
                return (
                    <div className="fixed-floating-btn" onMouseLeave={this.handleLeaveFAB}>
                        <ul style={{}} className="list-unstyled ">
                            {buttonList}
                        </ul>
                        <FloatingActionButton
                            backgroundColor={ZenColor.cyan}
                            iconStyle={{fill:ZenColor.white}}
                            onMouseEnter={this.handleHoverFAB}>
                            <ActionSettings style={{width:"28px"}}/>
                        </FloatingActionButton>
                    </div>
                );
                break;
            default :
                return (
                    <div className="fixed-floating-btn">
                        <FloatingActionButton
                            backgroundColor={ZenColor.orange}
                            style={{color:ZenColor.white}}
                            onTouchTap={this.props.whenEditButtonClicked}>
                            <p>取消</p>
                        </FloatingActionButton>
                    </div>
                );
                break;
        }
    },

    handleHoverFAB(){
        this.setState({FABActive: true});
    },

    handleLeaveFAB(){
        this.setState({FABActive: false});
    },
});