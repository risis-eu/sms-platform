'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'fluxible-router';
import {appFullTitle, appShortTitle, enableAuthentication, enableDynamicReactorConfiguration,enableDynamicServerConfiguration,enableDynamicfacetsConfiguration, configDatasetURI} from '../configs/general';

class Nav extends React.Component {
    componentDidMount(){
        let currentComp = this.refs.defaultNavbar;
        $(currentComp).find('.ui.dropdown').dropdown();
    }
    showHelpModal() {
        /*global $*/
        $('.ui.modal').modal('show');
    }
    render() {
        let user = this.context.getUser();
        let showSettings = 0;
        if(user && (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1 )){
            showSettings = 1;
        }
        // console.log(user);
        let userMenu;
        let configMenu = <a href={'/browse/' + encodeURIComponent(configDatasetURI)} className="ui item link" title="Configuration Manager">
            <i className="ui black settings icon"></i>
        </a>;
        if(enableAuthentication){
            if(user){
                userMenu = <div className="ui right dropdown item">
                    {user.accountName} <i className="dropdown icon"></i>
                    <div className="menu">
                        <NavLink className="item" routeName="resource" href={'/dataset/' + encodeURIComponent(user.datasetURI) + '/resource/' + encodeURIComponent(user.id)}>Profile</NavLink>
                        {parseInt(user.isSuperUser) ? <NavLink className="item" routeName="users" href="/users">Users List</NavLink> : ''}
                        <a href="/logout" className="item">Logout</a>
                    </div>
                </div>;
            }else{
                configMenu = '';

                userMenu = <div className="ui right item"> <a className="ui mini circular teal button" href="/login">Sign-in</a> &nbsp;  <a href="http://datasets.risis.eu/register" className="ui mini circular yellow button">Register</a> </div>;

            }
        }
        let navbarColor = 'blue';
        if(this.props.loading ){
            navbarColor = 'grey';
        }
        return (
            <div className="ui fluid container" ref="defaultNavbar">
                <nav  className={'ui menu inverted navbar grid ' + navbarColor}>
                    <NavLink routeName="home" className="brand item" href='/'>
                        {this.props.loading ? <img src="/assets/img/loader.gif" alt="loading..." style={{height: 30, width: 30}} /> : <img style={{height: 22, width: 35}} className="ui mini image" src="/assets/img/sms_logo_t.png" alt="SMS" />}
                    </NavLink>
                    <a className="item" href="/"> SMS Platform</a>
                    <NavLink routeName="metadataList" className="item" href="/metadataList"> Metadata Editor</NavLink>
                    <NavLink routeName="datasets" className="item" href="/datasets"> Datasets</NavLink>
                    <div className="right menu">
                        <NavLink routeName="contact" className="item" href="/contact" title="contact us">
                            <i className="small mail outline icon"></i>
                        </NavLink>
                        <div className="item link" onClick={this.showHelpModal} title="help">
                            <i className="small help circle icon"></i>
                        </div>
                        {(showSettings && (enableDynamicReactorConfiguration || enableDynamicServerConfiguration || enableDynamicfacetsConfiguration)) ?
                            configMenu
                            : ''}
                        {userMenu}
                    </div>
                </nav>
            </div>
        );
    }
}
Nav.contextTypes = {
    getUser: PropTypes.func
};
export default Nav;
