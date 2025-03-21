import React from 'react';
import PropTypes from 'prop-types';
import activateUser from '../../actions/activateUser';
import sendEmailMsg from '../../actions/sendEmailMsg';
import UserStore from '../../stores/UserStore';
import {connectToStores} from 'fluxible-addons-react';
import { Form } from 'semantic-ui-react'
import {NavLink} from 'fluxible-router';

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: '',
            msg: ''
        };
    }
    activateUser(uri, email) {
        this.context.executeAction(activateUser, {
            resourceURI: uri,
            email: email
        });
    }
    sendEmailMsg(){
        if(this.state.subject.trim() && this.state.msg.trim()){
            this.context.executeAction(sendEmailMsg, {
                subject: this.state.subject,
                msg: this.state.msg
            });
        }
    }
    updateInputValue(target, evt) {
        if(target=== 'subject'){
            this.setState({
                subject: evt.target.value
            });
        }else if(target=== 'msg'){
            this.setState({
                msg: evt.target.value
            });
        }
    }
    render() {
        let actBtn, emailHint = 0, list, dbClass = 'yellow user icon', user = this.context.getUser();
        let currentComponent = this;
        if((!user || (user.member.indexOf('http://rdf.risis.eu/user/PRB') === -1 && user.member.indexOf('http://rdf.risis.eu/user/FCB') === -1)) && !parseInt(user.isSuperUser)){
            return (
                <div className="ui fluid container ldr-padding-more">
                    <div className="ui grid">
                        <div className="row">
                            <div className="column">
                                <h1 className="ui header">Permission denied!</h1>
                                <div className="ui segment">
                                    <div className="ui warning message">
                                        <div className="header">Sorry! You do not have enough permission to access this page!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        let i = 0;
        let membership = [];
        let DSODIV, PRBDIV, FCBDIV, SMSTEAMDIV, SMSVISITOR, CREATED;
        if (this.props.UserStore.users) {
            list = this.props.UserStore.users.map(function(node, index) {
                membership = node.membership.split(',');
                if(membership.indexOf('http://rdf.risis.eu/user/DatasetCoordinators') !== -1){
                    DSODIV = <span className="ui mini brown tag label" title="Dataset Coordinator">DSO</span>;
                }else{
                    DSODIV = '';
                }
                if(membership.indexOf('http://rdf.risis.eu/user/PRB') !== -1){
                    PRBDIV = <span className="ui mini violet tag label" title="Project Review Board">PRB</span>;
                }else{
                    PRBDIV = '';
                }
                if(membership.indexOf('http://rdf.risis.eu/user/FCB') !== -1){
                    FCBDIV = <span className="ui mini purple tag label" title="Facility Coordination Board">FCB</span>;
                }else{
                    FCBDIV = '';
                }
                if(membership.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1){
                    SMSTEAMDIV = <span className="ui mini teal tag label" title="SMS Team">SMS Team</span>;
                }else{
                    SMSTEAMDIV = '';
                }
                if(membership.indexOf('http://rdf.risis.eu/user/SMSVisitor') !== -1){
                    SMSVISITOR = <span className="ui mini blue tag label" title="SMS Team">SMS Visitor</span>;
                }else{
                    SMSVISITOR = '';
                }
                if(parseInt(node.isActive)){
                    dbClass='green large user icon';
                    actBtn ='';
                }else{
                    dbClass='yellow large user icon';
                    if(parseInt(user.isSuperUser)){
                        actBtn = <div className="item"><button onClick={currentComponent.activateUser.bind(currentComponent, node.v, node.mbox)} className="ui mini red button"> Activate </button></div>;
                    }
                    // put the flag
                    emailHint = 1;
                }
                //add creation date
                if(node.created){
                    CREATED = <span className="ui mini label">{node.created}</span>;
                }else{
                    CREATED = <span className="ui mini label">unknown date</span>;
                }
                //do not show current super user to edit himself
                if(node.v !== user.id && !parseInt(node.isSuperUser)){
                    i++;
                    return (
                        <div className="item fadeIn" key={index}>
                            <div className="ui horizontal list">
                                <NavLink className="item" routeName="resource" href={'/dataset/'+ encodeURIComponent(currentComponent.props.UserStore.graphName) +'/resource/' + encodeURIComponent(node.v)} >
                                    <div className="content"> <span className="ui black circular label">{i}</span> <i className={dbClass}></i> {node.firstName} {node.lastName} ({node.username}) {CREATED} {DSODIV} {PRBDIV} {FCBDIV} {SMSTEAMDIV} {SMSVISITOR} </div>
                                </NavLink>
                                {actBtn}
                            </div>
                        </div>
                    )
                }
            });
        }else{
            list=<div className="ui warning message"><div className="header"> Sorry! No user found!</div></div>
        }
        return (
            <div className="ui fluid container ldr-padding-more" ref="dataset">
                <div className="ui grid">
                    <div className="row">
                        <div className="column">
                            <h1 className="ui header">
                                <a target="_blank" href={'/export/NTriples/' + encodeURIComponent(currentComponent.props.UserStore.datasetURI)}>
                                    <span className="ui big black circular label">{i}</span>
                                </a>
                                Registered Users</h1>
                            <div className="ui segment">
                                <div className="ui huge divided animated list">
                                    {list}
                                </div>
                                {emailHint
                                    ? <div>* A notification email will be sent to the user after activation.</div>
                                    : ''}
                            </div>
                            {this.props.UserStore.msgSent ?
                                <div className="ui message info animated pulse">Your message was successfully sent to all users...</div>
                                : parseInt(user.isSuperUser) ?
                                    <div className="ui segment inverted blue">
                                        <Form>
                                            <Form.Group widths='equal'>
                                                <Form.Input label='Subject' placeholder='Subject' onChange={evt => this.updateInputValue('subject', evt)}/>
                                            </Form.Group>
                                            <Form.TextArea label='Message' placeholder='Add your msg here' onChange={evt => this.updateInputValue('msg', evt)}/>
                                            <Form.Button onClick={this.sendEmailMsg.bind(this)}>Send message as email to all users</Form.Button>
                                        </Form>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
UsersList.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};

UsersList = connectToStores(UsersList, [UserStore], function (context, props) {
    return {
        UserStore: context.getStore(UserStore).getState()
    };
});
export default UsersList;
