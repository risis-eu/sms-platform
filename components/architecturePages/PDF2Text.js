import React from 'react';

class PDF2Text extends React.Component {
    render() {
        return (
          <div className="ui page grid">
            <div className="ui row">
              <div className="column">
                <div className="ui content">
                  <h2 className="ui header">PDF to Text</h2>
                    <div className="ui segment">
                      <p>
                          You can download and use <a href="https://drive.google.com/file/d/0B486tjd83Z1QWXAyZFlXVjFSYWs/view?usp=sharing">this tool</a> for converting PDF into TXT.
                          <ol>
                              <li>Expand the TAR-file</li>
                              <li>Type in the command line: ./pdf2text.sh /path/to/pdf-files <br/>
                                  (move the folder with the PDF FILES to the command line, after typing ./pdf2text.sh <br/>
                                  An example would be: ./pdf2text.sh /Users/Peter/dropbox/pdfs
                              </li>
                              <li>RUN:
                              After running, there is a new folder /Users/Peter/Dropbox/pdfs/text-versions with all TXT files</li>
                          </ol>
                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default PDF2Text;
