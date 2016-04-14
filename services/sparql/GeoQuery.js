'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
import {listOfCountries} from '../../data/countries';
class GeoQuery{
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
        PREFIX edm: <http://www.europeana.eu/schemas/edm/> \
        PREFIX igeo: <http://rdf.insee.fr/def/geo#> \
        PREFIX geoname: <http://www.geonames.org/ontology#> \
        PREFIX risisMCPV: <http://risis.eu/municipalities/vocab/> \
        PREFIX risisGeoV: <http://geo.risis.eu/vocabulary/> \
        PREFIX risisGADMV: <http://geo.risis.eu/vocabulary/gadm/> \
        ';
        this.query='';
    }
    convertToISO3(country) {
        let out = country;
        if(country.length === 3){
            return out;
        }else if(country.length === 2){
            listOfCountries.forEach((row)=>{
                if(row['alpha-2'] === country){
                    out = row['alpha-3'];
                    return out;
                }
            });
        }else{
            listOfCountries.forEach((row)=>{
                if(row['name'] === country){
                    out = row['alpha-3'];
                    return out;
                }
            });
        }
        return out;
    }
    ISOtoCountryName(country) {
        let out = country;
        if(country.length === 3){
            listOfCountries.forEach((row)=>{
                if(row['alpha-3'] === country){
                    out = row['name'];
                    return out;
                }
            });
        }else if(country.length === 2){
            listOfCountries.forEach((row)=>{
                if(row['alpha-2'] === country){
                    out = row['name'];
                    return out;
                }
            });
        }else{
            return out;
        }
        return out;
    }
    //FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
    getPointToNUTS(lat, long) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?code ?level ?name FROM <http://nuts.geovocab.org/> WHERE { \
            ?uri a ramon:NUTSRegion ;\
            	ramon:code ?code ;\
                ramon:level ?level ;\
            	ramon:name ?name ;\
            	geo:geometry ?polygon .\
            FILTER (bif:st_intersects (?polygon, bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNUTSToName(code) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?code ?level ?name FROM <http://nuts.geovocab.org/> WHERE { \
            ?uri a ramon:NUTSRegion ;\
            	ramon:code ?code ;\
                ramon:code "'+code+'" ;\
                ramon:level ?level ;\
            	ramon:name ?name ;\
            	geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNameToNUTS(name) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?code ?level ?name FROM <http://nuts.geovocab.org/> WHERE { \
            ?uri a ramon:NUTSRegion ;\
            	ramon:code ?code ;\
                ramon:name "'+name+'" ;\
                ramon:level ?level ;\
            	ramon:name ?name ;\
            	geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNUTStoPolygon(code) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?code ?level ?name ?polygon FROM <http://nuts.geovocab.org/> WHERE { \
            ?uri a ramon:NUTSRegion ;\
            	ramon:code "'+code+'" ;\
            	ramon:code ?code ;\
                ramon:level ?level ;\
            	ramon:name ?name ;\
            	geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getMunicipalitiesPerCountry(country) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID FROM <http://geo.risis.eu/municipalities> WHERE { \
            ?uri a risisGeoV:Municipality ;\
            	edm:country "'+this.ISOtoCountryName(country)+'" ;\
            	dcterms:title ?name ;\
            	risisGeoV:municipalityID ?municipalityID .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNUTStoMunicipality(code) {
        let codeURI = 'http://nuts.geovocab.org/id/' + code;
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode FROM <http://geo.risis.eu/municipalities> WHERE { \
            ?uri a risisGeoV:Municipality ;\
            	igeo:NUTS3 "'+codeURI+'" ;\
            	dcterms:title ?name ;\
                risisGeoV:isCore ?isCore ;\
                risisGeoV:functionalUrbanArea ?fua ;\
            	risisGeoV:municipalityID ?municipalityID .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNameToMunicipality(name) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode ?population FROM <http://geo.risis.eu/municipalities> WHERE { \
            ?uri a risisGeoV:Municipality ;\
            	dcterms:title ?name ;\
            	dcterms:title "'+name+'" ;\
                risisGeoV:isCore ?isCore ;\
                risisGeoV:functionalUrbanArea ?fua ;\
            	risisGeoV:municipalityID ?municipalityID .\
                ?fua dcterms:title ?fuaName .\
	            ?fua risisGeoV:fuaID ?fuaCode .\
	            ?fua geoname:population ?population .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getMunicipality(code) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode ?population FROM <http://geo.risis.eu/municipalities> WHERE { \
            ?uri a risisGeoV:Municipality ;\
            	dcterms:title ?name ;\
                risisGeoV:isCore ?isCore ;\
                risisGeoV:functionalUrbanArea ?fua ;\
            	risisGeoV:municipalityID ?municipalityID ;\
            	risisGeoV:municipalityID "'+code+'" .\
                ?fua dcterms:title ?fuaName .\
	            ?fua risisGeoV:fuaID ?fuaCode .\
	            ?fua geoname:population ?population .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getPointToMunicipality(lat, long) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?municipalityID ?country ?name FROM <http://geo.risis.eu/shapefiles> WHERE { \
            ?uri a risisGeoV:Municipality ;\
                risisGeoV:municipalityID ?municipalityID ;\
                dcterms:title ?name ;\
                edm:country ?country ;\
                geo:geometry ?polygon .\
            FILTER (bif:st_intersects (?polygon, bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
          } \
        ';
        return this.prefixes + this.query;
    }
    getPointToGADM28Admin(lat, long, country, level) {
        let ex1 = '', ex2 = '';
        if(country){
            ex1 = 'risisGADMV:ISO "'+this.convertToISO3(country)+'" ; ' ;
        }
        if(level){
            ex2 = 'risisGADMV:level '+level+' ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?country ?level from <http://geo.risis.eu/gadm> WHERE { \
            ?uri a risisGADMV:AdministrativeArea ;\
                dcterms:title ?title ; '+ex1+ex2+'\
                risisGADMV:level ?level ;\
                risisGADMV:ISO ?country ;\
                geo:geometry ?polygon .\
            FILTER (bif:st_intersects (?polygon, bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
          } LIMIT 6 \
        ';
        return this.prefixes + this.query;
    }
    getGADM28AdminToPolygon(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?polygon ?name FROM <http://geo.risis.eu/gadm> WHERE { \
            <'+uri+'> a risisGADMV:AdministrativeArea ;\
                dcterms:title ?name ;\
                geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getGADM28Admin(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?property ?value FROM <http://geo.risis.eu/gadm> WHERE { \
            <'+uri+'> a risisGADMV:AdministrativeArea ;\
                ?property ?value .\
            FILTER (?property != geo:geometry AND ?property != rdf:type)    \
          } \
        ';
        return this.prefixes + this.query;
    }
    getMunicipalityToPolygon(id) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?polygon ?name FROM <http://geo.risis.eu/shapefiles> WHERE { \
            ?uri a risisGeoV:Municipality ;\
                risisGeoV:municipalityID "'+id+'" ;\
                dcterms:title ?name ;\
                geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
}
export default GeoQuery;
