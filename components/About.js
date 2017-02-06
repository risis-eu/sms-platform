import React from 'react';

class About extends React.Component {
    render() {
        return (
          <div className="ui page grid">
            <div className="ui row">
              <div className="column">
                <div className="ui content">
                  <h2 className="ui header">About</h2>
                    <div className="ui secondary segment">
                      <p>
                          <img className="ui left floated image" src="/assets/img/sms_logo_t.png" alt="SMS" />
                          The <b>Semantically Mapping Science (SMS)</b> is a platform that supports accessing, combining and analyzing heterogeneous data about scholarly communication and behavior, and about various components science and innovation system. Integration of heterogeneous data is a crucial aspect of SMS, as this helps to ask more complex research questions. A main focus is on open (Web accessible) data. The platform also supports the use of traditional bibliographic, administrative and research databases. Access to and integration of proprietary data of course require access rights. <span>SMS platform is developed and maintained by:</span>
                      </p>

                      <br/>
                      <div className="ui stackable twelve center aligned column grid">
                          <div className="six wide left aligned column">

                                <div className="ui list">
                                    <div className="blue ui card item" style={{height: 205}}>
                                      <div className="content">
                                        <div className="header"><a href="http://vu.nl" target="_blank"><img className="ui centered medium image" src="/assets/img/VU_logo.png" /></a></div>
                                        <div className="meta"><a href="http://www.networkinstitute.org/" target="_blank">Department of Computer Science  & <br/> The Network Institute</a></div>
                                        <div className="description">
                                            VU University Amsterdam <br/>
                                        de Boelelaan 1081a<br/> 1081HV Amsterdam<br/> The Netherlands
                                         </div>
                                         <div></div>
                                      </div>
                                  </div>
                                </div>

                          </div>
                          <div className="six wide left aligned column">

                                <div className="ui list">
                                  <div className="ui yellow card item" style={{height: 205}}>
                                    <div className="content">
                                        <div className="extra content">
                                          <h3 className="ui header"> Contacts: </h3>
                                            <div className="ui list">
                                              <div className="item">
                                                  tel (+31)-20-598 7731/7718
                                              </div>
                                              <div className="item">
                                                <div className="ui label">
                                                  <a href="mailto:frank.van.harmelen@vu.nl"><i className="mail icon"></i> Prof. &nbsp; Frank van Harmelen &nbsp; &nbsp; &nbsp; &nbsp;</a>
                                                </div>
                                              </div>
                                              <div className="item">
                                                <div className="ui label">
                                                  <a href="mailto:p.a.a.vanden.besselaar @vu.nl"><i className="mail icon"></i> Prof. &nbsp; Peter van den Besselaar</a>
                                                </div>
                                              </div>
                                              <div className="item">
                                                <div className="ui label">
                                                  <a href="mailto:a.loizou@vu.nl@vu.nl"><i className="mail icon"></i> Dr. &nbsp; Antonis Loizou &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</a>
                                                </div>
                                              </div>
                                              <div className="item">
                                                <div className="ui label">
                                                  <a href="mailto:a.khalili@vu.nl@vu.nl"><i className="mail icon"></i> Dr. &nbsp; Ali Khalili &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</a>
                                                </div>
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>

                          </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default About;
