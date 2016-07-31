import React from 'react';

class TripleStore extends React.Component {
    render() {
        return (
          <div className="ui page grid">
            <div className="ui row">
              <div className="column">
                <div className="ui content">
                  <h2 className="ui header">Triple Store</h2>
                    <div className="ui segment">
                      <p>
                          A triplestore or RDF store is a purpose-built database for the storage and retrieval of triples through semantic queries. A triple is a data entity composed of subject-predicate-object, like "Bob is 35" or "Bob knows Fred". See more info <a href="https://en.wikipedia.org/wiki/Triplestore">here</a>.
                      </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default TripleStore;
