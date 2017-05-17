'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecase3 extends React.Component {
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
                      <h2 className="c25" id="h.qzy3qsy3r612"> Using flexible urban areas for studying the localization of innovation.</h2>
                      <p className="c1 c20"><span className="c0"></span></p>
                      <p className="c9"><span>Geography of innovation is another interesting topic. Here we show this might be studied, using the SMS platform. The example we chose is a core element of current science and innovation policy in the Netherlands, where a very large part of public research money is distributed to the so-called &lsquo;top sectors&rsquo;, that is the economic sectors of which Dutch government expects that they will be the core of future economic growth. Money is competitively distributed among consortia that focus on one of the top sectors </span><span>(such as energy, water, chemistry, life sciences, logistics, etc.)</span><span
                              className="c0">, and within the consortia companies have a leading role. Some information about the grated research consortia is available in the RVO project database.</span></p>
                          <p className="c1"><span>&nbsp;</span><span ><img alt="RISISWeek2017_SMS.043.jpeg" src="/assets/img/docs/image28.jpg" /></span></p>
                      <p
                          className="c7"><span className="c2">Fig 36. Geography of innovation: data processing</span></p>
                      <p className="c1 c20"><span className="c0"></span></p>
                      <p className="c9"><span className="c0">As the &lsquo;top sector policy&rsquo; is considered core in Dutch STI-policy, we are interested in how these research and innovation activities are distributed over the country. How could this be done using the SMS platform? Figure 36 represents the steps, and we will discuss them in some detail. </span></p>
                      <ol
                          className="c26 lst-kix_w8o1e9segze0-0 start" start="1">
                          <li className="c1 c19 c21"><span className="c0">We preprocess the RVO database, and convert the data to RDF.</span></li>
                          <li className="c1 c19 c21"><span className="c0">The data are linked to other databases in the SMS platform, which means that we link the names organizations in the RVO database to organizations names in other databases. How this linking is done, and how it can be improved will be described in the next example.</span></li>
                          <li
                              className="c1 c19 c21"><span className="c0">Through linking we have more address information, which then is used for geo-coding: finding the coordinates of the organizations involved in the project. </span></li>
                          <li className="c1 c19 c21"><span className="c0">The coordinates can be used to find geo-boundaries. A fashionable approach to geo-boundaries are the OECD &lsquo;functional urban areas&rsquo; (FUAs), which the SMS also provides. </span></li>
                          <li className="c1 c19 c21"><span className="c0">As many statistical data are provided for regions, we can investigate what characteristics of regions relate to innovation density (in terms of the projects we are investigating. </span></li>
                      </ol>
                      <p className="c7"><span className="c0">&nbsp;</span></p>
                      <p className="c1"><br/><span className="c0">Figure 37 (left) shows the FUAs in the Netherlands. The map is produced using open data in the SMS platform. Figure 37 (right) shows how the projects are distributed over the FUAs, and the darker the the color the higher the number of projects.</span></p>
                      <p
                          className="c1 c20"><span className="c0"></span></p>
                      <p className="c7"><span><img alt="RISISWeek2017_SMS.044.jpeg" src="/assets/img/docs/image40.jpg" /></span><br/><span
                              className="c2">Fig 37. FUAs in the Netherlands (left), and the distribution of projects over the FUAs (right)</span></p>
                      <p className="c1 c20"><span className="c2"></span></p>
                      <p className="c9"><span className="c2">Underlying the Functional Urban Areas is an idea of what are meaningful definitions of geographical boundaries. The FUA idea is based on the assumed importance of the distribution of people - population density and commuting patterns. However, a researcher may have good (theoretical) arguments for other geographical delineation. So why wouldn&rsquo;t other characteristics not be more important? the SMS platform has several services to support researchers to use their own definition or geographical areas. These deploy to types of open data. Firstly, we use the availability of statistical data at different levels of aggregation. Second we use the availability of so-called &lsquo;shape files&rsquo; - both available as open data. </span></p>
                      <p
                          className="c1"><span className="c2">&nbsp;</span></p>
                      <p className="c7"><span className="c6">&nbsp;</span><span ><img alt="RISISWeek2017_SMS.045.jpeg" src="/assets/img/docs/image47.jpg"  title=""/></span></p>
                      <p
                          className="c7 c20"><span className="c0"></span></p>
                      <p className="c7 c20"><span className="c0"></span></p>
                      <p className="c7"><span className="c6">Fig 38. Producing dedicated geo-boundaries </span></p>
                      <p className="c1 c20"><span className="c2"></span></p>
                      <p className="c9"><span className="c6">The idea boils do</span><span className="c2">wn that the researcher defines the property or properties of regions he/she is interested in. An example could be &lsquo;population density&rsquo;. As statistical data are available, the combination of those data with the available geo-boundary data results in a &lsquo;population density&rsquo; geography. Figure 39 (right) shows again the OECD-FUA geography of the Netherlands, whereas figure 39 (left) shows the population density (above a threshold). The two geographies are similar (as population plays an important role in the FUA), but not identical. One may, however, also use a different property such as &lsquo;density of companies&rsquo;, or a hybrid definition using as well population density and company density. These definitions result in different geographies, as figure 39 shows.</span></p>
                      <p
                          className="c1 c20"><span className="c2"></span></p>
                      <p className="c7"><span ><img alt="RISISWeek2017_SMS.046.jpeg" src="/assets/img/docs/image31.jpg" /></span></p>
                      <p
                          className="c7"><span className="c2">Fig 39. Alternative geo-boundaries</span></p>
                      <p className="c7"><span className="c6">&nbsp;</span></p>
                      <p className="c7"><span className="c6">&nbsp;</span></p>
                      <p className="c7"><span ><img alt="RISISWeek2017_SMS.048.jpeg" src="/assets/img/docs/image18.jpg" /></span></p>
                      <p
                          className="c7"><span className="c2">Fig 40: Geography of innovation depends on the selected geo-boundaries</span></p>
                      <p className="c7"><span className="c6">&nbsp;</span></p>
                      <p className="c9"><span className="c0">The selection of the definition of geographical boundaries is not neutral when studying the geography of innovation. In figure 40, we show the density of innovation projects (from the &lsquo;topsectoren&rsquo; database) for regions. And obviously, there are regions that do play a role in the innovation projects that are found when using our hybrid definition, but that would have remained invisible using the population density or the FUAs.</span></p>
                      <p
                          className="c9"><span className="c0">The total process for this analysis (see figure 41 for an overview) is rather complex, and requires several computational steps. So doing this may require collaboration between the social scientist who wants to investigate the geography of innovation, and a data scientists to support with the production and retrieval of the required data. But it gives also a flavor of the new possibilities that the SMS platform hopes to provide. </span></p>
                      <p
                          className="c1 c20"><span className="c0"></span></p>
                      <p className="c7"><span ><img alt="RISISWeek2017_SMS.049.jpeg" src="/assets/img/docs/image34.jpg" /></span><span
                              className="c6">Fig 41. Overview of the data processing</span></p>
                      <h3 className="c25 c27" id="h.zceynzgk7kff"><span className="c33"></span></h3>

                      </div>

                  </div>
              </div>
              </div>
            </div>
        );
    }
}

module.exports = usecase3;
