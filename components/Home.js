'use strict';
var React = require('react');

class Home extends React.Component {
    render() {
        return (
            <div className="ui page grid" ref="home">
              <div className="ui row">
                <div className="column">
                    <div className="ui segment content">
                        <h2 className="ui header">SMS Platform</h2>
                        <p>Welcome to SMS Platform!</p>
                        <p>
                        The Semantically Mapping Science (SMS) platform supports access to heterogeneous data on science and innovation, and it supports combining, integrating and analyzing those Data. SMS is one of the facilities in the <a target="_blank" href="http://risis.eu">RISIS project</a>, a distributed data infrastructure for research and innovation dynamics and policy studies.
                        </p>
                        <img className="ui bordered centered image" src="/assets/img/architecture.jpeg" />
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

module.exports = Home;
