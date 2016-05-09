import React from 'react';
import ReactDOM from 'react-dom';

class Demos extends React.Component {
    componentDidMount() {

    }

    render() {

        return (
            <div className="ui page grid" ref="demos">
                <div className="ui column segment">
                    List of Demo Applications that use SMS Linked Data API:
                    <div className="ui divided list">
                        <div className="item">- <a href="/demos/geo/addressToAdmin">Address to Administrative Boundaries (uses all available shape files)</a></div>
                        <div className="item">- <a href="/demos/geo/addressToGADM28Admin">Address to GADM Administrative Boundaries</a></div>
                        <div className="item">- <a href="/demos/geo/addressToOSMAdmin">Address to OSM Administrative Boundaries</a></div>
                        <div className="item">- <a href="/demos/geo/addressToFlickrAdmin">Address to Flickr Administrative Boundaries</a></div>
                        <div className="item">- <a href="/boundariesMap">Example of Administrative Boundaries extracted for a specific country</a></div>
                        <div className="item">- <a href="/demos/geo/NL_Universities/1000/1000">Educational Institutes in the Netherlands</a></div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Demos;
