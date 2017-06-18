'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecase1 extends React.Component {
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
                                <h2 className="c25" id="h.8oflk55ccwsx">Using the faceted browser for analyzing change in the research/HE system.</h2>
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
                                <p className="c7"><span ><img alt="RISISWeek2017_SMS.034.jpeg" src="/assets/img/docs/image08.jpg"  title=""/></span><br/><span
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = usecase1;
