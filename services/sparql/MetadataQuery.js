'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class MetadataQuery{
    constructor() {
        /*jshint multistr: true */
        this.prefixes='\
        PREFIX risis: <http://risis.eu/> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX pav: <http://purl.org/pav/> \
        PREFIX wv: <http://vocab.org/waiver/terms/norms> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        PREFIX ramon: <http://rdfdata.eionet.europa.eu/ramon/ontology/> \
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
        ';
        this.query='';
    }


}
export default MetadataQuery;
