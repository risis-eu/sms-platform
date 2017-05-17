import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';

class Demos extends React.Component {
    componentDidMount() {
        //scroll to top of the page
        let body = $('html, body');
        body.stop().animate({scrollTop:0}, '500', 'swing', function() {
        });
    }
    render() {

        return (
            <div className="ui fluid container ldr-padding-more" ref="demos">
            <div className="ui grid" ref="demos">
                <div className="ui column">
                    <div className="ui massive breadcrumb">
                      <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                      <i className="right chevron icon divider"></i>
                      <div className="active section">Demos</div>
                    </div>
                    <div className="ui segment">
                        <div className="ui stackable four cards">
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="/demos/geo/addressToAdmin">
                                  <img src="/assets/img/docs/addr2boundary.jpg" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="/demos/geo/addressToAdmin">Address to Administrative Boundaries (using all open shape files)</a>
                              </div>
                            </div>
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="/boundariesMap">
                                  <img src="/assets/img/docs/image17.jpg" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="/boundariesMap">Example of Administrative Boundaries extracted for a specific country</a>
                              </div>
                            </div>
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing">
                                  <img src="/assets/img/docs/image37.png" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing">Google spreadsheet's add-ons for geocoding addresses in a spreadsheet</a>
                              </div>
                            </div>
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="http://datasets.risis.eu">
                                  <img src="/assets/img/docs/dsp.png" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="http://datasets.risis.eu">RISIS Datasets Portal derived from the RISIS datasets metadata</a>
                              </div>
                            </div>
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="/metadataList">
                                  <img src="/assets/img/docs/metadataeditor.png" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="/metadataList">SMS Metadata Editor</a>
                              </div>
                            </div>
                            <div className="blue card slideInUp animated">
                              <a className="img-conceptualModel image" href="/datasets">
                                  <img src="/assets/img/docs/image20.jpg" style={{height: 150}}/>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="/datasets">Dataset Browser, Editor and Annotator</a>
                              </div>
                            </div>
                            <div className="black card slideInUp animated">
                              <a className="img-conceptualModel image" href="/datasets">
                                  <iframe width="200" height="150" src="https://www.youtube.com/embed/videoseries?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b" frameBorder="0" allowFullScreen></iframe>
                              </a>
                              <div className="content center aligned">
                                <a className="ui" href="https://www.youtube.com/playlist?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b">Video Tutorials</a>
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
export default Demos;
