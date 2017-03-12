'use strict';
import {getQueryDataTypeValue, convertToISO3, ISOtoCountryName} from '../utils/helpers';
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
        PREFIX dbpo: <http://dbpedia.org/ontology/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        PREFIX ramon: <http://rdfdata.eionet.europa.eu/ramon/ontology/> \
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
        PREFIX edm: <http://www.europeana.eu/schemas/edm/> \
        PREFIX igeo: <http://rdf.insee.fr/def/geo#> \
        PREFIX geoname: <http://www.geonames.org/ontology#> \
        PREFIX risisMCPV: <http://risis.eu/municipalities/vocab/> \
        PREFIX risisOECDV: <http://geo.risis.eu/vocabulary/oecd/> \
        PREFIX risisGeoV: <http://geo.risis.eu/vocabulary/> \
        PREFIX risisGADMV: <http://geo.risis.eu/vocabulary/gadm/> \
        PREFIX risisOSMV: <http://geo.risis.eu/vocabulary/osm/> \
        PREFIX risisFlickrV: <http://geo.risis.eu/vocabulary/flickr/> \
        ';
        this.query='';
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
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
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
        SELECT DISTINCT ?name ?municipalityID FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:Municipality ;\
            	risisOECDV:ISO "'+convertToISO3(country)+'" ;\
            	dcterms:title ?name ;\
            	risisOECDV:municipalityID ?municipalityID .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNUTStoMunicipality(code) {
        let codeURI = 'http://nuts.geovocab.org/id/' + code;
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:Municipality ;\
            	igeo:NUTS3 "'+codeURI+'" ;\
            	dcterms:title ?name ;\
                risisOECDV:isCore ?isCore ;\
                risisOECDV:functionalUrbanArea ?fua ;\
            	risisOECDV:municipalityID ?municipalityID .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getNameToMunicipality(name) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode ?population FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:Municipality ;\
            	dcterms:title ?name ;\
            	dcterms:title "'+name+'" ;\
                risisOECDV:isCore ?isCore ;\
                risisOECDV:functionalUrbanArea ?fua ;\
            	risisOECDV:municipalityID ?municipalityID .\
                ?fua dcterms:title ?fuaName .\
	            ?fua risisOECDV:fuaID ?fuaCode .\
	            ?fua geoname:population ?population .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getMunicipality(code) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode ?population FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:Municipality ;\
            	dcterms:title ?name ;\
                risisOECDV:isCore ?isCore ;\
                risisOECDV:functionalUrbanArea ?fua ;\
            	risisOECDV:municipalityID ?municipalityID ;\
            	risisOECDV:municipalityID "'+code+'" .\
                ?fua dcterms:title ?fuaName .\
	            ?fua risisOECDV:fuaID ?fuaCode .\
	            ?fua geoname:population ?population .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getBoundaryToOECDFUA(name, country){
        let ex1 = '';
        if(country){
            ex1 = 'risisOECDV:ISO "'+convertToISO3(country)+'" ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?name ?municipalityID ?isCore ?fua ?fuaName ?fuaCode ?population FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:Municipality ;\
            	dcterms:title ?name ;\
                risisOECDV:isCore ?isCore ; '+ex1+'\
                risisOECDV:functionalUrbanArea ?fua ;\
            	risisOECDV:municipalityID ?municipalityID .\
                ?fua dcterms:title ?fuaName ;\
	                 risisOECDV:fuaID ?fuaCode ;\
	                 geoname:population ?population .\
                FILTER regex(?name, "^'+name+'$", "i") \
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
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
          } \
        ';
        return this.prefixes + this.query;
    }
    getPointToGADM28Admin(lat, long, country, level) {
        let ex1 = '', ex2 = '';
        if(country){
            ex1 = 'risisGADMV:ISO "'+convertToISO3(country)+'" ; ' ;
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
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
        } LIMIT 100 \
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
    getPointToOSMAdmin(lat, long, country, level) {
        let ex1 = '', ex2 = '';
        if(country){
            ex1 = 'risisOSMV:ISO "'+convertToISO3(country)+'" ; ' ;
        }
        if(level){
            ex2 = 'risisOSMV:level '+level+' ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?country ?level from <http://geo.risis.eu/osm> WHERE { \
            ?uri a risisOSMV:AdministrativeArea ;\
                dcterms:title ?title ; '+ex1+ex2+'\
                risisOSMV:level ?level ;\
                risisOSMV:ISO ?country ;\
                geo:geometry ?polygon .\
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
        } LIMIT 100 \
        ';
        return this.prefixes + this.query;
    }
    getOSMAdmin(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?property ?value FROM <http://geo.risis.eu/osm> WHERE { \
            <'+uri+'> a risisOSMV:AdministrativeArea ;\
                ?property ?value .\
            FILTER (?property != geo:geometry AND ?property != rdf:type)    \
          } \
        ';
        return this.prefixes + this.query;
    }
    getOSMAdminMetadata(country, level) {
        let ex1='';
        if(level){
            ex1= 'risisOSMV:level'+level+ ' ?levelDesc ;';
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?level ?levelDesc FROM <http://geo.risis.eu/osm/metadata> WHERE { \
            ?uri a dbpo:Country ;'+ex1+'\
                ?level ?levelDesc ;\
                risisOSMV:ISO "'+convertToISO3(country)+'" .\
                FILTER (?level != rdf:type AND ?level != risisOSMV:ISO)    \
          } \
        ';
        return this.prefixes + this.query;
    }
    getOSMAdminToPolygon(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?polygon ?name FROM <http://geo.risis.eu/osm> WHERE { \
            <'+uri+'> a risisOSMV:AdministrativeArea ;\
                dcterms:title ?name ;\
                geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getPointToFlickrAdmin(lat, long, country, level) {
        let ex1 = '', ex2 = '';
        if(country){
            ex1 = 'risisFlickrV:ISO "'+convertToISO3(country)+'" ; ' ;
        }
        if(level){
            ex2 = 'risisFlickrV:level '+level+' ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?country ?level from <http://geo.risis.eu/flickr> WHERE { \
            ?uri a risisFlickrV:AdministrativeArea ;\
                dcterms:title ?title ; '+ex1+ex2+'\
                risisFlickrV:level ?level ;\
                risisFlickrV:ISO ?country ;\
                geo:geometry ?polygon .\
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
        } LIMIT 100 \
        ';
        return this.prefixes + this.query;
    }
    getFlickrAdmin(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?property ?value FROM <http://geo.risis.eu/flickr> WHERE { \
            <'+uri+'> a risisFlickrV:AdministrativeArea ;\
                ?property ?value .\
            FILTER (?property != geo:geometry AND ?property != rdf:type)    \
          } \
        ';
        return this.prefixes + this.query;
    }
    getFlickrAdminToPolygon(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?polygon ?name FROM <http://geo.risis.eu/flickr> WHERE { \
            <'+uri+'> a risisFlickrV:AdministrativeArea ;\
                dcterms:title ?name ;\
                geo:geometry ?polygon .\
          } \
        ';
        return this.prefixes + this.query;
    }
    getOECDFUAToPolygon(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?polygon ?name WHERE { \
            GRAPH <http://geo.risis.eu/urau> {\
            <'+uri+'> a risisOECDV:FunctionalUrbanArea ;\
                geo:geometry ?polygon .\
            }\
            GRAPH <http://geo.risis.eu/oecd> { \
            <'+uri+'> dcterms:title ?name . \
            } \
          } \
        ';
        return this.prefixes + this.query;
    }
    //source: flickr, osm, gadm
    getAdminsByLevel(level, country, source, offset, limit) {
        let vocab;
        if(source === 'gadm'){
            vocab = 'risisGADMV';
        }else if(source === 'osm'){
            vocab = 'risisOSMV';
        }else if(source === 'flickr'){
            vocab = 'risisFlickrV';
        }else if(source === 'oecd'){
            vocab = 'risisOECDV';
        }
        let ex1 = '', ex2 = '';
        if(parseInt(limit)){
            ex1 = ' LIMIT ' + limit;
        }
        if(parseInt(offset)){
            ex2 = ' OFFSET ' + offset;
        }

        if(source !== 'oecd'){
            /*jshint multistr: true */
            this.query = '\
            SELECT DISTINCT ?uri ?title FROM <http://geo.risis.eu/'+source+'> WHERE { \
                ?uri a '+vocab+':AdministrativeArea ;\
                    dcterms:title ?title ;\
                    '+vocab+':level '+level+' ;\
                    '+vocab+':ISO "'+convertToISO3(country)+'" .\
              } '+ex1+ex2+' \
            ';
        }else{
            /*jshint multistr: true */
            this.query = '\
            SELECT DISTINCT ?uri ?title WHERE { \
                GRAPH <http://geo.risis.eu/urau> { \
                    ?uri a risisOECDV:FunctionalUrbanArea ;\
                        risisOECDV:fuaCatefory "'+level+'" ; \
                        '+vocab+':ISO "'+convertToISO3(country)+'" .\
                } \
                GRAPH <http://geo.risis.eu/oecd> { \
                    ?uri dcterms:title ?title . \
                } \
            }';
        }
        return this.prefixes + this.query;
    }
    getOECDFUAList(country) {
        let ex1 = '';
        if(country){
            ex1 = ' risisOECDV:ISO "'+convertToISO3(country)+'" ;';
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?country FROM <http://geo.risis.eu/oecd> WHERE { \
            ?uri a risisOECDV:FunctionalUrbanArea ; '+ex1+'\
                dcterms:title ?title .\
                OPTIONAL {?uri risisOECDV:ISO ?country .}\
          }  \
        ';
        return this.prefixes + this.query;
    }
    getOECDFUA(uri) {
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?property ?value FROM <http://geo.risis.eu/oecd> WHERE { \
            <'+uri+'> a risisOECDV:FunctionalUrbanArea ;\
                ?property ?value .\
            FILTER (?property != geo:geometry AND ?property != rdf:type)    \
          } \
        ';
        return this.prefixes + this.query;
    }
    getPointToOECDFUA(lat, long, country) {
        let ex1 = '';
        if(country){
            ex1 = 'risisOECDV:ISO "'+convertToISO3(country)+'" ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?category ?country WHERE { \
            GRAPH <http://geo.risis.eu/urau> { \
                ?uri a risisOECDV:FunctionalUrbanArea ;\
                    risisOECDV:fuaCatefory ?category ; '+ex1+'\
                    risisOECDV:ISO ?country ;\
                    geo:geometry ?polygon .\
            } \
            GRAPH <http://geo.risis.eu/oecd> { \
                ?uri dcterms:title ?title . \
            } \
            FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+'))))\
        } LIMIT 100 \
        ';
        return this.prefixes + this.query;
    }
    getAdminToContainer(source, id, country, depth) {
        let graph, vocab, depthL, countryC = '';
        depthL = 1;
        switch (source) {
            case 'osm':
                graph =  'http://geo.risis.eu/osm';
                vocab = 'risisOSMV';
                break;
            case 'gadm':
                graph =  'http://geo.risis.eu/gadm';
                vocab = 'risisGADMV';
                break;
            case 'flickr':
                graph =  'http://geo.risis.eu/flickr';
                vocab = 'risisFlickrV';
                break;
        }
        if(depth){
            depthL = depth;
        }
        if(country){
            countryC = vocab+':ISO "'+convertToISO3(country)+'" ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?parent ?ptitle WHERE { \
          graph <'+graph+'> { \
            <'+graph+'/'+id+'> \
              '+vocab+':level ?level ;\
              geo:geometry ?polygon . \
            ?parent a '+vocab+':AdministrativeArea ; \
                    '+vocab+':level ?plevel ; '+countryC+' \
                    dcterms:title ?ptitle ; \
                    geo:geometry ?polygonParent . \
            FILTER (bif:st_contains (?polygonParent, ?polygon) && (xsd:int(?level)=xsd:int(?plevel)+'+depthL+')) \
          } \
        } \
        ';
        return this.prefixes + this.query;
    }
    getContainerAdmins(source, id, country, depth) {
        let graph, vocab, depthL, countryC = '';
        depthL = 1;
        switch (source) {
            case 'osm':
                graph =  'http://geo.risis.eu/osm';
                vocab = 'risisOSMV';
                break;
            case 'gadm':
                graph =  'http://geo.risis.eu/gadm';
                vocab = 'risisGADMV';
                break;
            case 'flickr':
                graph =  'http://geo.risis.eu/flickr';
                vocab = 'risisFlickrV';
                break;
        }
        if(depth){
            depthL = depth;
        }
        if(country){
            countryC = vocab+':ISO "'+convertToISO3(country)+'" ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?child ?ctitle WHERE { \
          graph <'+graph+'> { \
            <'+graph+'/'+id+'> \
              '+vocab+':level ?level ;\
              geo:geometry ?polygon . \
            ?child a '+vocab+':AdministrativeArea ; \
                    '+vocab+':level ?clevel ; '+countryC+' \
                    dcterms:title ?ctitle ; \
                    geo:geometry ?polygonChild . \
            FILTER (bif:st_intersects (?polygon, ?polygonChild) && (xsd:int(?level)=xsd:int(?clevel)-'+depthL+')) \
          } \
        } \
        ';
        return this.prefixes + this.query;
    }
    getPointToAaptiveFUA(lat, long, country, source, fuaGraph) {
        let graph, vocab, countryC = '';
        switch (source) {
            case 'osm':
                graph =  'http://geo.risis.eu/osm';
                vocab = 'risisOSMV';
                break;
            case 'gadm':
                graph =  'http://geo.risis.eu/gadm';
                vocab = 'risisGADMV';
                break;
            case 'flickr':
                graph =  'http://geo.risis.eu/flickr';
                vocab = 'risisFlickrV';
                break;
        }
        let ex1 = '', ex2 = '';
        if(country){
            ex1 = vocab + ':ISO "'+convertToISO3(country)+'" ; ' ;
            ex2 = 'risisGeoV:ISO "'+convertToISO3(country)+'" ; ' ;
        }
        /*jshint multistr: true */
        this.query = '\
        SELECT DISTINCT ?uri ?title ?country ?indicatorRef ?indicatorValue WHERE { \
          graph <'+graph+'> { \
            ?uri a '+vocab+':AdministrativeArea ; '+ex1+' \
                geo:geometry ?polygon . \
            } \
          graph <http://geo.risis.eu/adaptiveFUAs/'+fuaGraph+'> { \
            ?uri a risisGeoV:AdaptiveFUA ; risisGeoV:ISO ?country ; risisGeoV:indicatorRef ?indicatorRef ; risisGeoV:indicatorValue ?indicatorValue;'+ex2+' dcterms:title ?title . \
        } \
          FILTER (bif:st_intersects (bif:st_geomfromtext(STR(?polygon)), bif:st_point (xsd:double('+long+'), xsd:double('+lat+')))) \
      } \
        ';
        return this.prefixes + this.query;
    }
}
export default GeoQuery;
