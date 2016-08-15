'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {appFullTitle, appShortTitle, enableAuthentication} from '../configs/general';
import CookieBanner from 'react-cookie-banner';

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
        // console.log(user);
        let userMenu;
        if(enableAuthentication){
            if(user){
                userMenu = <div className="ui right dropdown item">
                                {user.accountName} <i className="dropdown icon"></i>
                                <div className="menu">
                                    <NavLink className="item" routeName="resource" href={'/dataset/' + encodeURIComponent(user.graphName) + '/resource/' + encodeURIComponent(user.id)}>Profile</NavLink>
                                    {parseInt(user.isSuperUser) ? <NavLink className="item" routeName="users" href="/users">Users List</NavLink> : ''}
                                    <a href="/logout" className="item">Logout</a>
                                </div>
                            </div>;
            }else{
                userMenu = <div className="ui right item"> <a className="ui mini circular teal button" href="/login">Sign-in</a> &nbsp;  <a href="http://datasets.risis.eu/register" className="ui mini circular yellow button">Register</a> </div>;
            }
        }
        let logoStyle = {
            maxHeight: 19
        };
        return (
            <nav ref="defaultNavbar" className="ui black menu inverted navbar page grid">
                <CookieBanner message='This website uses cookies to ensure you get the best experience on our website.' cookie='user-has-accepted-cookies' dismissOnScroll={true} />
                <NavLink routeName="home" className="brand item ui blue label" activeClass="active"><img src="/assets/img/sms_logo_t.png" alt={appShortTitle} /></NavLink>
                <NavLink routeName="about" className="item ui label" activeClass="active">About Us</NavLink>
                <NavLink routeName="dataset" className="item ui label" activeClass="active" href="/datasets">Datasets Metadata Editor</NavLink>
                <a className="item ui label" href="http://datasets.risis.eu" target="_blank">Datasets Portal</a>
                <a className="item ui label" href="http://api.sms.risis.eu" target="_blank">Linked Data API</a>
                <NavLink routeName="demos" className="item ui label" activeClass="active" href="/demos">Demos</NavLink>
                <div className="right menu">
                    {user ? <div className="item link" onClick={this.showHelpModal}><i className="small help circle icon"></i></div> : <a href="http://github.com/risis-eu/sms-platform" className="ui item link"><i className="github icon"></i></a>}
                    {userMenu}
                </div>
            </nav>
        );
    }
}
Nav.contextTypes = {
    getUser: React.PropTypes.func
};
export default Nav;
