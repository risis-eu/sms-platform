'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecases extends React.Component {
    componentDidMount() {
        //scroll to top of the page
        let body = $('html, body');
        body.stop().animate({scrollTop:0}, '500', 'swing', function() {
        });
    }
    render() {
        return (
            <div className="ui page stacked grid" ref="home">
              <div className="ui row">
                <div className="column">
                    <div className="ui massive breadcrumb">
                      <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                      <i className="right chevron icon divider"></i>
                      <div className="active section">Use Cases</div>
                    </div>
                    <div className="ui segment" style={{textAlign: 'justify', fontSize: '1.2em'}}>
                        <p className="c9 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">The use cases we describe below are stylized examples of research in order to demonstrate how the SMS platform can be used for research. So they should not be read as research reports per se. </span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">We also do not go into an important issue about the quality and completeness of the data themselves, an important issue that will be addressed later in the project. &nbsp;</span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span>The examples are organized in increasing complexity. The first depends on browsing the faceted browse only, the second additionally requires the formulation of queries, for which many researchers may help. Even more help may be required in example three, as there dedicated data-linking is required. Finally the last example depends on more complex linking, and on several queries. Interested researchers may visit the SMS platform to do the more complex data processing and analysis work. See the website (</span><span
                                className="c14"><a className="c8" href="http://www.risis.eu&amp">www.risis.eu</a></span><span>&nbsp;or </span><span className="c14"><a className="c8" href="http://www.sms.risis.eu">www.sms.risis.eu</a></span><span
                                className="c0">) for information about the possibilities and support to visits.</span></p>
                        <h3 className="c25" id="h.8oflk55ccwsx"><span>Example 1: </span><span className="c33">Using the faceted browser for analyzing change in the research/HE system. </span></h3>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">The datastore contains many datasets with information about organizations. Assume that one is interested in structural change in higher education systems, one may want to browse through those datasets. The faceted browser can be of great help, as it enables to explore the available information in graphical form. While browsing the datasets, we find a property &lsquo;foundation year&rsquo;. Selecting that property for a country, one gets the frequency of new foundations of Higher Education institutions per year (figure 24), and one sees immediately a high concentration in a two consecutive years: in 1986 and 1987 some 21 new HE institutions were founded in the Netherlands, on a total (now) of 114:. So some substantial changes in the HE system seem to have taken place.</span></p>
                        <p
                            className="c1"><span>&nbsp;</span></p>
                        <p className="c1"><span ><img alt="RISISWeek2017_SMS.030.jpeg" src="/assets/img/docs/image15.jpg"  title=""/></span></p>
                        <p
                            className="c7"><span className="c6">Fig 24. Foundation </span><span className="c2">years HE institutions Netherlands</span></p>
                        <p className="c7 c20"><span className="c2"></span></p>
                        <p className="c9"><span className="c0">By selecting these two years, the list of organizations at the right side of figure 25), the screen (the &lsquo;resources&rsquo;) shows the names of the institutions that were founded in these two years. We can inspect the list, but also select a single institution and inspect the available information in the data store, but also more broadly on the web,as all the organizations are also linked to their website and their wikipedia page. So we do not only have much numerical data in the data network, such as numbers of students and staff, and of output, but also qualitative (textual) data for further inspection.</span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span>Looking at the various newly founded schools shows that this are all Universities of Applied Sciences, so the &lsquo;second layer&rsquo; Dutch HE institutions, and one may find information on the foundation on Websites, or find contact addresses to search for further information. If one would purdue this data collection, one would find out that the new founded institutions in fact are mergers of smaller schools into very large new institutions. This indeed can be considered as a major reform of the Dutch higher education system.</span></p>
                        <p
                            className="c9"><span ><img alt="RISISWeek2017_SMS.031.jpeg" src="/assets/img/docs/image05.jpg" title=""/></span></p>
                        <p
                            className="c7"><span className="c2">Fig 25. HE institutions Netherlands founded in 1986-1987</span></p>
                        <p className="c7 c20"><span className="c2"></span></p>
                        <p className="c1"><span ><img alt="RISISWeek2017_SMS.032.jpeg" src="/assets/img/docs/image27.jpg"  title=""/></span></p>
                        <p
                            className="c7"><span className="c6">Fig 26. Foundation years HE institutions Belgium</span></p>
                        <p className="c9"><span className="c0">This is a small demonstration of how to use the faceted browser. A follow-up question would be whether this is a typical Dutch phenomenon, or whether similar changes have taken place in other countries. </span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">Belgium could be a second case to inspect, and we do the same steps. Indeed, as the browser shows, also here we find concentrations of foundations of new HE institutions, but now in the year 1995 when 32 new HE institutions were founded in Belgium (figure 26). If we select in the browser the year 1995, we get in the resources list the names of the newly founded institutions (figure 27). We could now further inspect the available information on those institutions, which we haven&rsquo;t done yet. And we do not have prior knowledge on the Belgian system. But inspecting the list of names in the resources table in the figure below, one immediately sees that the changes probably took place in the French speaking part of Belgium, as all names are French language institutions, and not in the Flemish speaking part. Indeed, the two language regions have their own HE system, so this could clearly be the case. </span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">Further data collection is needed to find out what happened in Belgium in the period, and whether it is a similar development as in the Netherlands, but that falls outside the scope of this demonstrator. Here it is sufficient to show how the faceted browser of SMS is useful in such a study. </span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c1"><span ><img alt="RISISWeek2017_SMS.033.jpeg" src="/assets/img/docs/image21.jpg"  title=""/></span></p>
                        <p
                            className="c7"><span className="c2">Fig 27. HE institutions Belgium founded in 1995</span></p>
                        <p className="c7 c20"><span className="c2"></span></p>
                        <p className="c7"><span ><img alt="RISISWeek2017_SMS.034.jpeg" src="/assets/img/docs/image08.jpg"  title=""/></span><span
                                className="c2">Fig 28. Foundation years HE institutions Austria</span></p>
                        <p className="c7 c20"><span className="c2"></span></p>
                        <p className="c7"><span ><img alt="RISISWeek2017_SMS.035.jpeg" src="/assets/img/docs/image07.jpg"  title=""/></span></p>
                        <p
                            className="c7"><span className="c6">Fig 29. HE institutions Austria - &nbsp;founded in 2007</span></p>
                        <p className="c9"><span className="c0">The third example we give here is Austria (Fig 28 and 29), and indeed also there we detect a concentration of new institutions in 2007 - a decade after the changes in Belgium and two decades after the changes in the Netherlands. Of the total of (now) 102 HE institutions in Austria, fifteen were created in 2007 - again a percentage suggesting some form of structural change. Also in the Austrian case, the browser is helpful. By selecting the year 2007 in the &lsquo;foundation&rsquo; window, we get in the &lsquo;resources&rsquo; window the list of new institutions.</span></p>
                        <h3
                            className="c25" id="h.bpgg4qy5i99t"><span className="c0">Even if one is completely unknowledgeable about the Austrian system of Higher Education, the browser tells that the changes have taken place in the sector of teacher education: the newly founded HE institutions are all &lsquo;University of Education&rsquo;, &lsquo;University College of Teacher Education&rsquo;, and &lsquo;Pedagogical University&rsquo;. &nbsp;Without further investigation, one already can conclude that the changes in the Austrian system are less broad than in the Netherlands or in Belgium, where the changes seem to cover a much larger part of the HE system. &nbsp;</span></h3>
                        <h3 className="c25 c27" id="h.rhmhahthv3io"><span className="c33"></span></h3>
                        <hr/>
                        <h3 className="c25 c27" id="h.j7dcoahotuv"><span className="c33"></span></h3>
                        <h3 className="c25" id="h.n1zopcp2ow2d"><span className="c33">Example 2 Using the open data on organizations for studying links between organizations</span></h3>
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
                        <h3 className="c25" id="h.qzy3qsy3r612"><span className="c33">Example 3. Using flexible urban areas for studying the localization of innovation</span></h3>
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
                        <p className="c1"><span className="c0">Figure 37 (left) shows the FUAs in the Netherlands. The map is produced using open data in the SMS platform. Figure 37 (right) shows how the projects are distributed over the FUAs, and the darker the the color the higher the number of projects.</span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c7"><span><img alt="RISISWeek2017_SMS.044.jpeg" src="/assets/img/docs/image40.jpg" /></span><span
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
                        <hr/>
                        <h3 className="c25 c27" id="h.pet8scqjnrsb"><span className="c33"></span></h3>
                        <h3 className="c25" id="h.15gk5cr682id"><span className="c33">Example 4: Using several sources: does the environment of universities relate to performance?</span></h3>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">The last example asks the following question: What characteristics of universities and what characteristics of the environment of universities influence the quality of universities? There are about 2500 higher education institutions in Europe. A few of those are the outstanding - the top ranked - universities, but most of them are much more &lsquo;normal&rsquo;. Why some universities have been the outstanding one&rsquo;s forever is one question, what influences the performance of the large majority is another. One may think of characteristics of the HE institutions, such as size, number of undergraduate and graduate students, student-staff ratio, amount of externally funded research, and so on. </span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">But also contextual variables may have an effect: degree of urbanization, other (higher) education institutions in the vicinity, presence of R&amp;D performing companies, or public research institutes, and other variables representing the social, economic, and demographic characteristics of the region. Why would these factors may be relent. Several theories could be used, but the least one may say is that those social and other factors may affect the attractiveness of the university and the environment for potential students and academic staff. And the more attractive these are, the better staff and students one may be able to select. Another factor may be is that the presence of a variety of research and development and innovation related activities in the vicinity of an HE institution may result in an increase of exchange of ideas, an increase of (interdisciplinary) collaboration, and of funding possibilities.How would be be able to answer these questions? We will focus on the role of the latter factor.</span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span>The SMS datastore contains for the moment one dataset with performance data at the university level: the Leiden Ranking. This set contains data for the better but by far not for all HE institutions. Furthermore,the Leiden Ranking only reflects research performance, whereas other rankings also take into account teaching, or external funding (from e.g., industry. In the near future SMS may add some other rankings to increase the scope and the size of the coverage.</span><sup><a href="#ftnt18" id="ftnt_ref18">[18]</a></sup><span
                                className="c0">&nbsp;</span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">The SMS datastore contains several datasets with information about HE institutions, such as ETER, OrgRef, GRID, OrgReg, etcetera. From those we may extract the relevant properties of the HE institutions we are interested in. However, in this example we focus on the contextual factors. How would we retrieve those from the SMS datastore?</span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c9"><span className="c0">The whole process consists of different steps, from linking data, via geo-localization and finding the relevant geo-boundaries, to identifying the other R&amp;D intensive organizations within these geo-boundaries. Then we can measure the number, kind and variety of R&amp;D organizations in the environment of the university as a measure of the quality of the context. Finally we can do some statistics to answer the questions. Does the number, kind and variety of closeby R&amp;D organizations influence the ranking of universities? &nbsp; &nbsp;</span></p>
                        <p
                            className="c1 c20"><span className="c0"></span></p>
                        <p className="c1"><span className="c12">Step 1:</span><span className="c0">&nbsp;Linking of the organization names between the relevant datasets, and this is described earlier in this report. In this case, it is about four datasets. After we have done so, we have for all HE institutions a variety of variables, among others the geo-coordinates. </span></p>
                        <p
                            className="c7"><span><img alt="RISISWeek2017_SMS.052.jpeg" src="/assets/img/docs/image35.jpg" title=""/></span><span
                                className="c6">Fig 42. Linking the relevant datasets</span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c1 c20"><span className="c0"></span></p>
                        <p className="c1"><span ><img className="ui image big" alt="RISISWeek2017_SMS.051.jpeg" src="/assets/img/docs/image11.jpg" title=""/></span></p>
                        <p
                            className="c7"><span className="c2">Fig 43. Detecting the other relevant institutions within the environment of an HE institution</span></p>
                        <p className="c7 c20"><span className="c2"></span></p>
                        <p className="c9"><span className="c6 c12">Step 2</span><span className="c2">: The geo-coordinates are used to define the boundaries of the environment, and that is needed to find the other R&amp;D intensive within those boundaries. </span></p>
                        <p className="c1 c20"><span className="c2"></span></p>
                        <p className="c9"><span className="c6 c12">Step 3</span><span className="c2">: For that we again use the OrgRef dataset, as this contains a huge amount of those organizations, all with their geo-coordinates. For each HE institution, we can now determine which R&amp;D organizations are closeby. As OrgRef also has information about the type of organization, we not only know the number, but also the types, and the variety. </span></p>
                        <p
                            className="c1 c20"><span className="c2"></span></p>
                        <p className="c9"><span className="c6 c12">Step 4:</span><span className="c2">&nbsp;These variables, together with the characteristics derived from ETER, can then be used in the explanation of ranking of HE institutions. Figure 44 shows a part of the dataset that can be analyzed in a statistical package like SPPS SAS, or R. The &lsquo;english_name&rsquo;, &lsquo;country&rsquo;, &lsquo;category&rsquo;, &lsquo;total_expenditure&rsquo;, &lsquo;third_party _funding&rsquo; and &lsquo;Academic staff size&rsquo; are all retrieved from ETER. The performance score &lsquo;PP_top10&rsquo; comes from the Leiden ranking, the &lsquo;longitude and &lsquo;latitude&rsquo; come from GRID, and the &lsquo;geo-boundary&rsquo; is produced in the SMS platform. The geo-boundary and GRID are used to calculate the &lsquo;Number of R&amp;D intensive organizations&rsquo;. </span></p>
                        <p
                            className="c9 c20"><span className="c2"></span></p>
                        <p className="c9"><span className="c2">To what extent these variables indeed predict the ranking is to be answered - but the correlation between the two yellow columns (with the Netherlands universities only) is 0.58. </span></p>
                        <p className="c1 c20"><span className="c2"></span></p>
                        <p className="c1 c20"><span className="c2"></span></p>
                        <p className="c1 c20"><span className="c2"></span></p>
                        <p className="c1"><span ><img alt="Screen Shot 2017-03-08 at 00.38.28.png" src="/assets/img/docs/image09.png" title=""/></span></p>
                        <p
                            className="c7"><span className="c6">Fig 44.</span><span className="c6">&nbsp;Part of the resulting dataset (Dutch universites only, and a few of the variables)</span></p>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = usecases;
