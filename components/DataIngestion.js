'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class DataIngestion extends React.Component {
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
                      <div className="active section">Data Ingestion, Conversion & Linking</div>
                    </div>
                    <div className="ui segment">
                        <h2>Data Ingestion</h2>
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                          Importing data to SMS platform can be done both manually and automatically based on the "Entity types" covered by a dataset, " Format and structure" of data and "Data access policy" defined for data to be imported. The latter is important as not all data can be accessed by every user, and different levels of accessibility apply, depending on subscriptions and on permission of the owners of datasets.
                      </p>
                      <img className="ui centered image" src="/assets/img/docs/image04.png" />
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                          Following questions need to be answered before importing data into SMS:
                      </p>
                      <div className="ui divided list">
                          <div className="item">
                              <div className="content">
                                <div className="header">
                                    What types of entities are covered by the dataset?
                                </div>
                                <div className="description">
                                    The answer to this question, helps SMS to find the potential points of linking and also to check if the conceptual model should be amended to accommodate new entity types.
                                </div>
                              </div>
                          </div>
                          <div className="item">
                              <div className="content">
                                <div className="header">
                                    What is the format and structure of data to be imported?
                                </div>
                                <div className="description">
                                   The answer to this question, helps SMS to automate the ingestion process if the data format and structure are based on the standard interfaces supported by SMS.
                                </div>
                              </div>
                          </div>
                          <div className="item">
                              <div className="content">
                                <div className="header">
                                    What are the data access policies?
                                </div>
                                <div className="description">
                                    The answer to this question, helps SMS to apply restriction rules when accessing the imported dataset.
                                </div>
                              </div>
                          </div>
                      </div>
                      <h2>Linked Data Creation</h2>
                      <img className="ui medium right floated image" src="/assets/img/docs/image25.jpg" />
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                          There are several steps followed in the lifecycle of linked data to extract and store the imported data into SMS triple store. The lifecycle starts by a basic (syntactic) conversion of data to RDF format without applying any specific vocabularies. This basic conversion is then enriched by applying several linking and enrichment services. Different services and scripts are used to convert unstructured and structured data to RDF. Techniques such as Named Entity Recognition (discussed later in the document) can be employed to extract named entities from textual content. A concrete example is recognizing research institutions and universities in a researcher’s CV (Curriculum vitae), using named entity recognition by linking the CV to databases with background knowledge such as DBpedia.
                          For structured content, the tool will be selected based on the format. For example, <a href="http://openrefine.org/">OpenRefine</a> can be used to convert spreadsheet data to RDF.

                      </p>
                      <h2>Data Linking and Scientific Lenses</h2>
                      <img className="ui medium right floated image" src="/assets/img/docs/image06.jpg" />
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                        Data linking is the process of creating a relationship between entities that meet preset conditions. If global unique identifiers for entities are available, the linking becomes straightforward. If not, a variety of techniques can be used, from (fuzzy) string matching to deploying attributes available in the different databases. In the link data service that we provide, we emphasis on providing contextual information that help eliminating ambiguity after a relationship between entities is established, and enables re-use. For instance, the <a href="https://grid.ac/">GRID</a>, <a href="http://www.orgref.org/web/download.htm">OrgRef</a>, and <a href="http://datasets.risis.eu/metadata/eupro">EUPRO</a> datasets describe organisation entities across various countries, including both public and private research organisations. All of these datasets refer to the “Minnesota Mining and Manufacturing Company” (3M), a large multinational organisation with a substantial patent portfolio. The GRID dataset distinguishes between 3M(United States) and 3M(Canada), while the OrgRef dataset only refers to the single entity 3M. To study these organizations, they need to be aligned across these datasets whenever they are the same. But what does “the same” mean? Suppose one study aims to compare organizations at a global level, whereas a second compares organizations across countries. In the ﬁrst setting, all occurrences of ‘3M’ in the datasets are considered the same. In the second study, the Canadian and U.S. branches of ‘3M’ are to be considered separately.
                      </p>
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                          In our approach to data linking, we first provide a network of interlinked entities through linksets. These linksets are generated using basic similarity metrics such as exact string similarity, approximate string similarity and geo-similarity. The goal of these linksets is to serve as “lego pieces”, easy for users to combine or modify them to their liking to answer a particular research question. Combining or modifying linksets is made possible using operations such as UNION, TRANSITIVITY or INTERSECTION. The result of a manipulation over one or more linksets is a lens, which stands as a user view over the data.
                      </p>
                      <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                          We propose to enable users to make an informed choice over alignments produced by existing tools. This modiﬁes the generic problem into choose and modify. Our proposal is to reuse existing tools for generating correspondences of as the basis of interlinking.
                      </p>
                      <a href="http://5stardata.info/en/"><img className="ui centered large image" src="/assets/img/docs/image48.png" /></a>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = DataIngestion;
