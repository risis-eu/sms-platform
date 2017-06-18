'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecase2 extends React.Component {
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
                        <div className="ui column">
                            <div className="ui massive breadcrumb">
                                <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                                <i className="right chevron icon divider"></i>
                                <NavLink routeName="home" className="section" href="/usecases">Use Cases</NavLink>
                            </div>
                            <div className="ui segment" style={{textAlign: 'justify', fontSize: '1.2em'}}>
                                <h2 className="c25" id="h.n1zopcp2ow2d"> Using the open data on organizations for studying links between organizations.</h2>
                                <p className="c1 c20"><span className="c0"></span></p>
                                <p className="c9"><span>A main issue in science and technology studies is the dynamics of collaboration, at the individual level, but also at the level or organizations. As the field is strongly data driven, much of the research operationalized collaboration as &lsquo;co-authoring&rsquo;. Later, studies also used joint projects as a source to study collaboration, which was made possible through the availability of large project databases such as the EC database Cordis (in the SMS platform), and the RISIS dataset EUPRO (partly in the SMS platform). For studying industrial collaboration, often data on joint ventures are collected and used. Here we address the question whether this also can be done for research collaboration. In other words, do public and private research organizations create together new organizations to &lsquo;do something together&rsquo;? &nbsp;Browsing the SMS data store, we do find information about relations between organisations. </span><span>In the GRID</span><sup><a href="#ftnt17" id="ftnt_ref17">[17]</a></sup><span>&nbsp;dataset, there are various data on relations between organizations: </span><span>&lsquo;hasChild&rsquo;, &lsquo;hasParent&rsquo;</span><span
                                    className="c0">&nbsp;and &lsquo;hasRelated&rsquo; (see figure 30).</span></p>
                                <p className="c1"><span>&nbsp;</span><span ><img alt="RISISWeek2017_SMS.036.jpeg" src="/assets/img/docs/image22.jpg"  title=""/></span></p>
                                <p
                                    className="c7"><span className="c6">Fig 30. Organizations - &lsquo;parents&rsquo; and &lsquo;children&rsquo;</span></p>
                                <p className="c9"><span className="c0">Using the &lsquo;parent-child relations&rsquo;, we now can try to detect the &lsquo;joint ventures&rsquo; in research and higher education. This can be done by selecting properties in the faceted browser, but here we show the result of querying the database. The query asks for all types of organization-pairs, that do have a &lsquo;joint venture&rsquo; relation. In Figure 31, we show the top of the table that the query did produce. We restrict ourselves to joint ventures within countries, as we assume that this is by far the pattern.</span></p>
                                <p
                                    className="c1 c20"><span className="c0"></span></p>
                                <p className="c9"><span>Column A gives the country of origin of the organizations. Columns B and C show the sector of origin of the collaborating organizations, and there are several collaboration-types: </span><span>Education-Government</span><span className="c0">, Education-Education, Education-Facility, Education-Healthcare, government-Government, etc. Column D gives the number of times such a relation-type is in the data, and the last two columns E and F show how many organizations of both types are in the dataset. So in words, row 2 shows that the database includes for France 325 Educational and 168 governmental organization. These span 122 joint ventures. </span></p>
                                <p
                                    className="c1 c20"><span className="c0"></span></p>
                                <p className="c1"><span ><img alt="RISISWeek2017_SMS.037.jpeg" src="/assets/img/docs/image41.jpg" /></span></p>
                                <p
                                    className="c7"><span className="c2">Fig 31. Organizations -joint venture relation by country and type: querying parent-child relations</span></p>
                                <p className="c7 c20"><span className="c2"></span></p>
                                <p className="c1"><span className="c0">The table above is sorted descending on column D, se we see here what countries have most joint ventures, and of what type. Obviously, the joint venture model is very popular in France, and therefore we focus on the French joint-venture collaboration network. </span></p>
                                <p
                                    className="c1 c20"><span className="c0"></span></p>
                                <p className="c1"><span className="c0">As said, it is easy to retrieve the data from the datastore in several formats. So in the next step we retrieve the list of French R&amp;D performing organizations from the dataset, and the list of links between them, where a link is defined as having a child together: &lsquo;a joint venture&rsquo;. These data can then be imported in some analytical tool for network analysis, and here we use Gephi. The next figure shows the result. As we immediately see, the network has a dense core, and a wide periphery (figure 32). </span></p>
                                <p
                                    className="c1"><span>&nbsp;</span><span ><img alt="RISISWeek2017_SMS.038.jpeg" src="/assets/img/docs/image36.jpg"  title=""/></span></p>
                                <p
                                    className="c7"><span className="c2">Fig 32. Networks of joint-venture relations: French network. link=shared children </span></p>
                                <p className="c7 c20"><span className="c2"></span></p>
                                <p className="c1"><span className="c0">In order to further investigate the network, we calculate a few network characteristics, and one the average degree.The degree of a node is the number of links the node has with other nodes. As &lsquo;joint venture&rsquo; is an undirected link, we do not need to distinguish in-degree and out-degree. The average degree is 20,4 (figure 32) suggesting that jointly creating new organizations is a popular activity in the French system. Or in other words, many research organizations in France seem to be linked to more than one higher level organizations. </span></p>
                                <p
                                    className="c1 c20"><span className="c0"></span></p>
                                <p className="c1"><span ><img alt="RISISWeek2017_SMS.039.jpeg" src="/assets/img/docs/image42.jpg" /></span></p>
                                <p
                                    className="c7"><span className="c2">Fig 32. Degree distribution</span></p>
                                <p className="c7 c20"><span className="c2"></span></p>
                                <p className="c1"><span ><img style={{maxHeight:200}} alt="RISISWeek2017_SMS.040.jpeg" src="/assets/img/docs/image30.jpg" title=""/></span></p>
                                <p
                                    className="c7"><span className="c2">Fig 33. Organizations by degree</span></p>
                                <p className="c7 c20"><span className="c2"></span></p>
                                <p className="c1"><span className="c0">The next indicator is the &lsquo;degree distribution&rsquo;, which is shown in the figure below. As often the case, the distribution is rather skewed, and one therefore wonders who these very high linked organizations are. To answer that question, we sort the Gephi data screen on degree, and filter for degree &gt; 80. Figure 32 shows the result, and if one is not familiar with the French system, the next question would be what these &lsquo;institutes&rsquo; in the top of the list actually are. </span></p>
                                <p
                                    className="c1 c20"><span className="c0"></span></p>
                                <p className="c1"><span className="c0">To answer that question, we use another service of the SMS platform, that is geo-location. The SMS platforms allows the user to find the geographical coordinates for each address, and in fact the platform does this for the datasets included. As one can see in Figure 33, the OrgRef data are geolocated, and we included the queries in the query. This is now helpful as we can sort the organizations by geocode (figure 34) and this then shows that all these institutes are probably part (divisions?) of CNRS, as they share exactly the same coordinates. </span></p>
                                <p
                                    className="c1"><span>&nbsp;</span><span ><img alt="RISISWeek2017_SMS.041.jpeg" src="/assets/img/docs/image01.jpg" /></span></p>
                                <p
                                    className="c7"><span className="c2">Fig 34. Organizations by geo-coordinates: core of the network = CNRS (geo-location)</span></p>
                                <p className="c7 c20"><span className="c2"></span></p>
                                <p className="c1"><span className="c0">One can also try to map geographical and/r functional parts of the network separately, and we use here only the Paris&rsquo; Higher Education institutions as an example (figure 35). </span></p>
                                <p className="c7 c20"><span className="c0"></span></p>
                                <p className="c7"><span ><img alt="RISISWeek2017_SMS.042.jpeg" src="/assets/img/docs/image38.jpg"  title=""/></span></p>
                                <p
                                    className="c7"><span className="c6">Fig 35. The Paris&rsquo; universities joint ventures network: link=joint child</span></p>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = usecase2;
