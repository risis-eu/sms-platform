'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecases extends React.Component {
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
                  <div className="ui column">
                      <div className="ui massive breadcrumb">
                        <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                        <i className="right chevron icon divider"></i>
                        <div className="active section">Use Cases</div>
                      </div>
                      <div className="ui segment">
                          <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                              The use cases we describe below are stylized examples of research in order to demonstrate how the SMS platform can be used for research. So they should not be read as research reports per se. We also do not go into an important issue about the quality and completeness of the data themselves, an important issue that will be addressed later in the project.
                          </p>
                          <div className="ui stackable four cards">
                              <div className="blue card pulse animated">
                                <NavLink routeName="usecase1" className="img-conceptualModel image" href="/usecase1">
                                    <img src="/assets/img/docs/usecase1.jpg" style={{height: 150}}/>
                                </NavLink>
                                <div className="content center aligned">
                                  <NavLink routeName="usecase1" className="ui" href="/usecase1">Using the faceted browser for analyzing change in the research/HE system.</NavLink>
                                </div>
                              </div>
                              <div className="blue card pulse animated">
                                <NavLink routeName="usecase2" className="img-conceptualModel image" href="/usecase2">
                                    <img src="/assets/img/docs/usecase2.jpg" style={{height: 150}}/>
                                </NavLink>
                                <div className="content center aligned">
                                  <NavLink routeName="usecase2" className="ui" href="/usecase2">Using the open data on organizations for studying links between organizations</NavLink>
                                </div>
                              </div>
                              <div className="blue card pulse animated">
                                <NavLink routeName="usecase3" className="img-conceptualModel image" href="/usecase3">
                                    <img src="/assets/img/docs/usecase3.jpg" style={{height: 150}}/>
                                </NavLink>
                                <div className="content center aligned">
                                  <NavLink routeName="usecase3" className="ui" href="/usecase3">Using flexible urban areas for studying the localization of innovation</NavLink>
                                </div>
                              </div>
                              <div className="blue card pulse animated">
                                <NavLink routeName="usecase4" className="img-conceptualModel image" href="/usecase4">
                                    <img src="/assets/img/docs/usecase4.jpg" style={{height: 150}}/>
                                </NavLink>
                                <div className="content center aligned">
                                  <NavLink routeName="usecase4" className="ui" href="/usecase4">Using several sources: does the environment of universities relate to performance?</NavLink>
                                </div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
            </div>
        );
    }
}

module.exports = usecases;
