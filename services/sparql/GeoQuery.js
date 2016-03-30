'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class GeoUtil{
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
    getPointToNUTS(lat, long) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?code ?level ?name FROM <http://nuts.geovocab.org/> WHERE { \
            ?uri a ramon:NUTSRegion ;\
            	ramon:code ?code ;\
                ramon:level ?level ;\
            	ramon:name ?name ;\
            	geo:geometry ?polygon .\
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
          } \
        ';
        return this.prefixes + this.query;
    }

}
export default GeoUtil;
