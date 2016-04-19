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
                        <div className="item">- <a href="/demos/geo/addressToGADM28Admin">Address to GADM Administrative Boundaries</a></div>

                    </div>
                </div>
            </div>
        );
    }
}
export default Demos;
