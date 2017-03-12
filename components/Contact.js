import React from 'react';

class About extends React.Component {
    render() {
        return (
          <div className="ui page grid">
            <div className="ui row">
              <div className="column">
                <div className="ui content">
                  <h2 className="ui header">Contact Us</h2>
                    <div className="ui secondary segment">
                      <p>
                          The <b>Semantically Mapping Science (SMS)</b> platform is developed and maintained by:
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
                                                  <a href="mailto:a.khalili@vu.nl@vu.nl"><i className="mail icon"></i> Dr. &nbsp; Ali Khalili &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</a>
                                                </div>
                                              </div>
                                              <div className="item">
                                                <div className="ui label">
                                                  <a href="mailto:o.a.k.idrissou@vu.nl"><i className="mail icon"></i> Al Koudous Idrissou&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </a>
                                                </div>
                                              </div>                                            </div>
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
