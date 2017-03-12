import React from 'react';
import ReactDOM from 'react-dom';

class Demos extends React.Component {
    componentDidMount() {

    }

    render() {

        return (
            <div className="ui page grid" ref="demos">
                <div className="ui column segment">
                    List of Demo Applications that use SMS Linked Data API:<br/>
                <div className="ui divided animated list">
                        <div className="item">-  <a href="/demos/geo/addressToAdmin"><i className="browser icon"></i>Address to Administrative Boundaries (uses all available shape files)</a></div>
                        <div className="item">- <a href="/demos/geo/addressToGADM28Admin"><i className="browser icon"></i>Address to GADM Administrative Boundaries</a></div>
                        <div className="item">- <a href="/demos/geo/addressToOSMAdmin"><i className="browser icon"></i>Address to OSM Administrative Boundaries</a></div>
                        <div className="item">- <a href="/demos/geo/addressToFlickrAdmin"><i className="browser icon"></i>Address to Flickr Administrative Boundaries</a></div>
                        <div className="item">- <a href="/boundariesMap"><i className="browser icon"></i>Example of Administrative Boundaries extracted for a specific country</a></div>
                        <div className="item">- <a href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing"><i className="file excel outline icon"></i>Google spreadsheet's add-ons</a></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Demos;
