'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class usecase4 extends React.Component {
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
                  <div className="ui column">
                      <div className="ui massive breadcrumb">
                        <NavLink routeName="home" className="section" href="/">SMS Platform</NavLink>
                        <i className="right chevron icon divider"></i>
                        <NavLink routeName="home" className="section" href="/usecases">Use Cases</NavLink>
                      </div>
                      <div className="ui segment" style={{textAlign: 'justify', fontSize: '1.2em'}}>
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
                          className="c7"><span><img alt="RISISWeek2017_SMS.052.jpeg" src="/assets/img/docs/image35.jpg" title=""/></span><br/><span
                              className="c6">Fig 42. Linking the relevant datasets</span></p>
                      <p className="c1 c20"><span className="c0"></span></p>
                      <p className="c1 c20"><span className="c0"></span></p>
                      <p className="c1"><span ><img alt="RISISWeek2017_SMS.051.jpeg" src="/assets/img/docs/image11.jpg" title=""/></span></p>
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

module.exports = usecase4;
