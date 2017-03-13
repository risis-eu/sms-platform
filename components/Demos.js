import React from 'react';
import ReactDOM from 'react-dom';

class Demos extends React.Component {
    componentDidMount() {
        //scroll to top of the page
        let body = $('html, body');
        body.stop().animate({scrollTop:0}, '500', 'swing', function() {
        });
    }
    render() {

        return (
            <div className="ui page grid" ref="demos">
                <div className="ui column segment">
                    <div className="ui stackable four cards">
                        <div className="green card slideInUp animated">
                          <a className="img-conceptualModel image" href="/demos/geo/addressToAdmin">
                              <img src="/assets/img/docs/addr2boundary.jpg"/>
                          </a>
                          <div className="content center aligned">
                            <a className="ui" href="/demos/geo/addressToAdmin">Address to Administrative Boundaries (using all open shape files)</a>
                          </div>
                        </div>
                        <div className="green card slideInUp animated">
                          <a className="img-conceptualModel image" href="/boundariesMap">
                              <img src="/assets/img/docs/image17.jpg"/>
                          </a>
                          <div className="content center aligned">
                            <a className="ui" href="/boundariesMap">Example of Administrative Boundaries extracted for a specific country</a>
                          </div>
                        </div>
                        <div className="green card slideInUp animated">
                          <a className="img-conceptualModel image" href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing">
                              <img src="/assets/img/docs/image37.png"/>
                          </a>
                          <div className="content center aligned">
                            <a className="ui" href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing">Google spreadsheet's add-ons for geocoding addresses in a spreadsheet</a>
                          </div>
                        </div>
                        <div className="green card slideInUp animated">
                          <a className="img-conceptualModel image" href="http://datasets.risis.eu">
                              <img src="/assets/img/docs/dsp.png"/>
                          </a>
                          <div className="content center aligned">
                            <a className="ui" href="http://datasets.risis.eu">RISIS Datasets Portal derived from the RISIS datasets metadata</a>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Demos;
