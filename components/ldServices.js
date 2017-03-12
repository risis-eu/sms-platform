'use strict';
import React from 'react';
import {NavLink} from 'fluxible-router';

class ldServices extends React.Component {
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
                      <div className="active section">Linked Data Services & Applications</div>
                    </div>
                    <div className="ui segment">
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            SMS platform exposes a set of predefined <a href="https://www.w3.org/TR/sparql11-query ">SPARQL</a> query templates as RESTful Web APIs in order to facilitate usage of the interlinked data by developers who are not familiar with the SPARQL query language. The Web services also allow better management of data access (in case authentication and authorization are needed) while monitoring the data usage for optimizing the queries and provide load balancing on the services infrastructure (e.g. due to reasons of data size and performance of the respective geospatial queries, scalability of Linked Geo Data platforms is a critical issue and needs to be dealt by distributing the services into a set of composable micro services).
                            An important benefit of exposing data as service is the ability to build applications which combine one or more services with other existing services and applications to build novel and innovative STI applications.
                            SMS uses <a href="https://en.wikipedia.org/wiki/Representational_state_transfer
 http://swagger.io ">Swagger</a> to document the APIs of the exposed Linked Data services. The full documentation of services is available at <a href="http://api.sms.risis.eu">http://api.sms.risis.eu</a> .
                        </p>
                        <img className="ui centered image" src="/assets/img/docs/image10.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            The APIs are generally categorized into the following categories:
                        </p>
                        <ol className="ui divided list" style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            <li className="item">
                                Metadata Services and Applications
                            </li>
                            <li className="item">
                                Data Enrichment Services and Applications
                                <ol>
                                    <li className="item">
                                        Named Entity Recognition
                                    </li>
                                    <li className="item">
                                        Data Harmonization
                                    </li>
                                    <li className="item">
                                        Geo-enrichment
                                    </li>
                                </ol>
                            </li>
                            <li className="item">
                                Data Linking Services and Applications
                            </li>
                        </ol>
                        <hr/>
                        <h2>Metadata Services and Applications</h2>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            Metadata helps potential users of a dataset to decide whether the dataset is appropriate for their purposes or not. RISIS project aims to provide a distributed infrastructure for research and innovation dynamics and policies. This infrastructure has a collection of various heterogeneous datasets that are not always publicly accessible due to privacy issues, and often require a researcher to be physically at the dataset location. To access these datasets, one needs to be granted an access request. This administrative detour that a researcher has to endure prior to detecting which dataset to use for a particular research question can reduce the number of RISIS datasets visitors. It has been shown that research publications that provide access to their base data yield consistently higher citation rates than those that do not. Therefore, to attract more users, to visit and cite RISIS datasets, SMS provides a dataset metadata service and application - modelled using the Resource Description Framework (RDF) - that allows researchers to search for data, and have an in-depth understanding of the data without the need to directly access it. Metadata service allows dataset holders to describe their datasets in a detailed, consistent and uniform way, store the description and if needed modify the stored metadata.  The metadata can also be utilized to facilitate data integration as shown below:
                        </p>
                        <img className="ui centered image" src="/assets/img/docs/image24.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            In order to enable end-users to easily view and edit metadata, SMS provides a <a href="/metadataList">metadata editor</a> application built on top of the metadata services. This application allows dataset owners to edit the metadata related to their datasets in different categories. Furthermore, for researchers interested in RISIS datasets, it provides interfaces on <a href="http://datasets.risis.eu">http://datasets.risis.eu</a> portal to view metadata and then request to get access to the data. The following <a href="https://youtu.be/p_2D3ydcx1U?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b">video</a> demonstrates how the metadata editor works:
                        </p>
                        <div style={{textAlign: 'center'}}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/p_2D3ydcx1U?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b" frameBorder="0" allowFullScreen></iframe>
                        </div>
                        <hr/>
                        <h2>Data Enrichment Services and Applications</h2>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            SMS provides a set of services and applications that allow users to enrich their data by adding complementary data to their current data. There are three categories of data-enrichment services provided:
                        </p>
                        <h3>Named Entity Recognition</h3>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            Named-entity recognition (NER) (also known as entity identification, entity chunking and entity extraction) is a subtask of information extraction that seeks to locate and classify named entities in text into predefined categories such as the names of persons, organizations, locations, expressions of times, quantities, monetary values, percentages, etc. Given a dataset which has one or more attributes with textual values, SMS NER service can extract named entities from the text and more importantly connect the extracted entities to a knowledge graph or taxonomy (which can then provide more data about those entities).
                        </p>
                        <img className="ui centered image" src="/assets/img/docs/image23.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            By default, SMS employs DBpedia Spotlight service for NER. However, any arbitrary NER service can be plugged into SMS NER service as long as the output of service is reconciled to SMS named entities annotation model. DBpedia Spotlight automatically annotates mentions of DBpedia (structured information extracted from Wikipedia) resources in text. The extracted entities map to a taxonomy of general knowledge (as shown in the following figure, DBpedia, Freebase and Schema.org ontologies) which helps users to better browse and analyze a dataset taking a particular domain of interest.
                        </p>
                        <img className="ui centered image" src="/assets/img/docs/image44.png" />
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            SMS faceted browser allows users to browse an annotated dataset by combining the background knowledge extracted from named entities with the inherent attributes of a dataset.  The following <a href="https://youtu.be/H76afW67qy8?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b">video</a> demonstrates how the faceted browsing of NEs works:
                        </p>
                        <div style={{textAlign: 'center'}}>
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/H76afW67qy8?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b" frameBorder="0" allowFullScreen></iframe>
                        </div>
                        <h3>Data Harmonization</h3>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            The goal of SMS data harmonization service is to improve the quality and expressiveness of a dataset by enriching it with an existing standard classification. The harmonized datasets can be more easily interlinked with other datasets. For example, with regards to geo data, data can be enriched by adding HASC (Hierarchical Administrative Subdivision Codes) or ISO 3166 country codes. Or with regards to publication/patent data, using FoS (Field of Science), WoS (Web of Science) or IPC (International Patent Classification) classifications.
                        </p>
                        <h3>Geo-enrichment</h3>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            Geo-enrichment is an instrument to enrich data by linking through geo-location. Many (open) datasets provide variables that are measured at some level of geographical aggregation: e.g., environmental data, educational data, or socio-economic data. In order to exploit these linking and enriching possibilities, the SMS platform provides a variety of geo-services. The geo-services system is based on a series of open geo-resources, such as GADM, OpenStreetMap and Flickr geotagged data. By integrating these geo-resources, the service can give for an entity’s address the geo-location up to 11 different levels. We illustrate this with an example of a service to determine the geographical location if one knows an address (or even only an organization name). As shown in the following figure, in the top right part of the screen the address for “Vrije Universiteit Amsterdam” is inserted, and the application has as output various maps and, in the bottom right, the geo-characterization of the inserted address at eleven levels.
                            The following figure shows the various administrative boundaries for the geocoded address. A simple address-to-boundary application is available, which can be used to check different geo-boundaries used with their corresponding metadata at <a href="/demos/geo/addressToAdmin">http://sms.risis.eu/demos/geo/addressToAdmin</a>.
                            </p>
                            <img className="ui centered image" src="/assets/img/docs/image17.jpg" />
                            <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                                With regards to geo-enrichment, SMS provides the following main categories of services:
                            </p>
                            <div className="ui divided list">
                                <div className="item">
                                    Geocode a given address.
                                </div>
                                <div className="item">
                                    Find administrative boundaries containing a given point.
                                </div>
                                <div className="item">
                                    Find metadata and details of a given administrative boundary.
                                </div>
                                <div className="item">
                                    Find (multi-)polygon shapes of a given administrative boundary.
                                </div>
                                <div className="item">
                                    Find Functional Urban Areas (FUAs) related to a given administrative boundary.
                                </div>
                                <div className="item">
                                    Connect administrative boundaries to selected statistical data.
                                </div>
                            </div>
                            <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                                One practical application we built for batch processing of addresses is a <a href="https://docs.google.com/document/d/1JoJM7VF_ZaaAPbSjtgpydzRDYLvr-tROzhITGj0cH3w/edit?usp=sharing">Google spreadsheet add-on</a> which chains Google Geocoding API with our PointToAdmin and AdminToFUA services. Given addresses in a spreadsheet are enriched with different levels of administrative boundaries and FUAs. The users are then able to export the extracted boundaries and process them in geodata analysis tools such as CartoDB. The following <a href="https://youtu.be/qZGDD5RN7pI?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b">video</a> tutorial demonstrates how to use our Google spreadsheet add-on:
                            </p>
                            <div style={{textAlign: 'center'}}>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/qZGDD5RN7pI?list=PLSBPxopOi20XPOn1sGBthbNtXIUOqM_4b" frameBorder="0" allowFullScreen></iframe>
                            </div>
                        <hr/>
                        <h2>Data Linking Services and Applications</h2>
                        <p style={{textAlign: 'justify', fontSize: '1.2em'}}>
                            Before a user can obtain a view over the data of interest, he is to interact with our services. All his/her interactions are of value to the other users in the sense that those actions are documented for others to reuse, modify for different purposes. User interactions include:

                        </p>
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = ldServices;
