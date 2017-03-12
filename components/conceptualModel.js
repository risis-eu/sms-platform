'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class conceptualModel extends React.Component {
    componentDidMount() {
        //scroll to top of the page
        let body = $('html, body');
        body.stop().animate({scrollTop:0}, '500', 'swing', function() {
        });
    }
    render() {
        return (
            <div className="ui page stacked grid" ref="home">
              <div className="ui row">
                <div className="column">
                    <div className="ui massive breadcrumb">
                      <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                      <i className="right chevron icon divider"></i>
                      <div className="active section">Conceptual Model & Technical Architecture</div>
                    </div>
                    <div className="ui segment">

                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = conceptualModel;
