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
            <div className="ui fluid container ldr-padding-more" ref="home">
            <div className="ui stacked grid" ref="home">
              <div className="ui row">
                <div className="column">
                    <div className="ui massive breadcrumb">
                      <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                      <i className="right chevron icon divider"></i>
                      <div className="active section">Conceptual Model & Technical Architecture</div>
                    </div>
                    <div className="ui segment">
                        <h2>Conceptual Model</h2>
                        <img className="ui centered large image" src="/assets/img/docs/image26.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            SMS platform at its conceptual model employs an entity-centric approach to interlink heterogenous datasets in the STI domain. As shown in the above figure, the following entity types are extracted after analysis of existing RISIS datasets and their related open datasets: Funding Programs, Projects, Publications, Patents, Persons, Organizations, Organization Rankings, Geo locations, Geo boundaries and Geo statistical data. It is also possible to add new entity types based on the research questions which need to be answered by SMS infrastructure.
                            Check an example of linked entities in the following <a href="https://youtu.be/rQxgGXQccqw?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b">video</a>:
                        </p>
                        <div style={{textAlign: 'center'}}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/rQxgGXQccqw?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b" frameBorder="0" allowFullScreen></iframe>
                        </div>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            The following figure shows a list of currently linked datasets on SMS mapped to their corresponding entity type. There are three types of datasets in the list: public datasets which can be accessed by anyone, private datasets which are only accessible by certain users, subscription-based datasets which could be accessed by users who have paid subscription to data.
                        </p>
                        <img className="ui centered image" src="/assets/img/docs/image00.jpg" />
                        <h2>Technical Architecture & Data Flow </h2>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            SMS platform follows a layered design; from data sources (bottom) to data services and functions for end-user (top).
                        </p>
                        <img style={{maxHeight: '500px'}}className="ui centered image" src="/assets/img/docs/image43.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            We describe different components of SMS platform based on the data flow in system. Data either collected from RISIS dataset repository or open data on the web, is first converted to Linked Data format. On top of the created linked data, a set of Web services are provided which allow different applications to plug and take benefit of linked datasets. SMS already provides a set of applications which combine Linked Data services to address user needs. These applications allow researchers to find answers to their research questions defined on specific use cases.
                        </p>
                        <a href="/assets/pdf/sms_poster.pdf" style={{textAlign: 'center', fontSize: '1.2em'}}><img  className="ui medium centered image bordered" src="/assets/img/docs/workflow.png" /></a>
                        <div style={{textAlign: 'center'}}>
                            <a href="/assets/pdf/sms_poster.pdf">
                                SMS Poster
                            </a>
                        </div>
                    </div>
                </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = conceptualModel;
