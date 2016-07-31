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
                        The Semantically Mapping Science (SMS) platform supports access to heterogeneous data on science and innovation, and it supports combining, integrating and analyzing those Data. SMS is one of the facilities in the <a target="_blank" href="http://risis.eu">RISIS project</a>, a distributed data infrastructure for research and innovation dynamics and policy studies. Click on the components in the below architecture to get more information about the component.
                        </p>
                        <img id="Image-Maps-Com-image-maps-2016-07-31-052107" src="/assets/img/architecture.jpeg" border="0" width="664" height="638" orgWidth="664" orgHeight="638" useMap="#image-maps-2016-07-31-052107" alt="SMS Architecture" className="ui bordered centered image" />
                        <map name="image-maps-2016-07-31-052107" id="ImageMapsCom-image-maps-2016-07-31-052107">
                        <area  alt="" title="RISIS Datasets Portal" href="http://datasets.risis.eu" shape="rect" coords="29,35,153,99" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="SMS Spreadsheet add-ons" href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing" shape="rect" coords="158,36,276,100" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Cortext" href="http://cortext.risis.eu" shape="rect" coords="284,49,413,90" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="SMS Demos" href="http://sms.risis.eu/demos" shape="rect" coords="417,50,517,95" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Other SMS apps" href="/otherApps" shape="rect" coords="523,50,632,95" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="PDF to Text" href="/PDF2Text" shape="rect" coords="529,7,628,49" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="SMS Linked Data API" href="http://api.sms.risis.eu" shape="rect" coords="29,101,632,146" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Access Control Points" href="/ACPs" shape="rect" coords="16,465,638,509" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Category Services" href="/categoryServices" shape="rect" coords="65,154,215,200" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Basic Geo Services" href="/basicGeoServices" shape="rect" coords="221,154,397,202" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Identity Resolution/Management Services" href="/identityServices" shape="rect" coords="403,156,579,204" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Metadata services" href="/datasets" shape="rect" coords="65,207,215,251" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Innovative Geo Services" href="/innovativeGeoServices" shape="rect" coords="222,206,395,250" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="NER services" href="/ner" shape="rect" coords="405,208,575,251" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Integration with Social Data" href="/integrationSocial" shape="rect" coords="65,260,215,306" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Integration with Public Datasets" href="/integrationPublic" shape="rect" coords="220,260,394,306" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Integration with local RISIS datasets" href="/integrationRISIS" shape="rect" coords="403,258,576,305" style={{'outline':'none'}} target="_self"     />
                        <area  alt="" title="Triple Store" href="/tripleStore" shape="rect" coords="38,319,604,366" style={{'outline':'none'}} target="_self"     />
                        <area shape="rect" coords="662,636,664,638" alt="Image Map" style={{'outline':'none'}} title="Image Map" href="http://www.image-maps.com/index.php?aff=mapped_users_0" />
                        </map>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

module.exports = Home;
