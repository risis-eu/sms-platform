'use strict';
import {getEndpointParameters, getHTTPQuery} from './utils/helpers';
import {defaultGraphName} from '../configs/general';
import GeoQuery from './sparql/GeoQuery';
import GeoUtil from './utils/GeoUtil';
import rp from 'request-promise';
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
/*-----------------------------------*/
let endpointParameters, graphName, query, queryObject, utilObject;
queryObject = new GeoQuery();
utilObject = new GeoUtil();

export default {
    name: 'geo',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'geo.PointToNUTS'){
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getPointToNUTS(params.lat, params.long);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    latitude: parseFloat(params.lat),
                    longitude: parseFloat(params.long),
                    resources: utilObject.parsePointToNUTS(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.NUTStoName') {
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getNUTSToName(params.code);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parsePointToNUTS(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.NameToNUTS') {
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getNameToNUTS(params.name);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parsePointToNUTS(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.NUTStoPolygon') {
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getNUTStoPolygon(params.code);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parseNUTStoPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.MunicipalitiesPerCountry') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getMunicipalitiesPerCountry(params.country);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    country: params.country,
                    resources: utilObject.MunicipalitiesPerCountry(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.NUTStoMunicipality') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getNUTStoMunicipality(params.code);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    code: params.code,
                    resources: utilObject.parseNUTStoMunicipality(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.NameToMunicipality') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getNameToMunicipality(params.name);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parseNameToMunicipality(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.Municipality') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getMunicipality(params.code);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parseNameToMunicipality(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.PointToMunicipality') {
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getPointToMunicipality(params.lat, params.long);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    latitude: parseFloat(params.lat),
                    longitude: parseFloat(params.long),
                    resources: utilObject.parsePointToMunicipality(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.BoundaryToOECDFUA') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getBoundaryToOECDFUA(params.name, params.country);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    name: params.name,
                    country: params.country,
                    resources: utilObject.parseNameToMunicipality(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.MunicipalityToPolygon') {
            graphName = '';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getMunicipalityToPolygon(params.code);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    code: params.code,
                    resources: utilObject.parseMunicipalityToPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.PointToGADM28Admin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getPointToGADM28Admin(params.lat, params.long, params.country, params.level);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    latitude: parseFloat(params.lat),
                    longitude: parseFloat(params.long),
                    resources: utilObject.parsePointToGADM28Admin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.GADM28AdminToPolygon') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getGADM28AdminToPolygon('http://geo.risis.eu/gadm/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseGADM28AdminToPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.GADM28Admin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getGADM28Admin('http://geo.risis.eu/gadm/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseGADM28Admin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.PointToOSMAdmin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getPointToOSMAdmin(params.lat, params.long, params.country, params.level);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    latitude: parseFloat(params.lat),
                    longitude: parseFloat(params.long),
                    resources: utilObject.parsePointToOSMAdmin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OSMAdmin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOSMAdmin('http://geo.risis.eu/osm/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseOSMAdmin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OSMAdminMetadata') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOSMAdminMetadata(params.country, params.level);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    country: params.country,
                    resource: utilObject.parseOSMAdminMetadata(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OSMAdminToPolygon') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOSMAdminToPolygon('http://geo.risis.eu/osm/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseOSMAdminToPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.PointToFlickrAdmin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getPointToFlickrAdmin(params.lat, params.long, params.country, params.level);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    latitude: parseFloat(params.lat),
                    longitude: parseFloat(params.long),
                    resources: utilObject.parsePointToFlickrAdmin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.FlickrAdmin') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getFlickrAdmin('http://geo.risis.eu/flickr/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseFlickrAdmin(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.FlickrAdminToPolygon') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getFlickrAdminToPolygon('http://geo.risis.eu/flickr/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseFlickrAdminToPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OECDFUAToPolygon') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOECDFUAToPolygon('http://geo.risis.eu/oecd/fua/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    id: params.id,
                    resources: utilObject.parseFlickrAdminToPolygon(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.AdminsByLevel') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getAdminsByLevel(params.level, params.country, params.source, params.offset, params.limit);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    level: params.level,
                    country: params.country,
                    source: params.source,
                    resources: utilObject.parseAdminsByLevel(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OECDFUAList') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOECDFUAList(params.country);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    country: params.country,
                    resources: utilObject.parseOECDFUAList(res, params.country)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'geo.OECDFUA') {
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getOECDFUA('http://geo.risis.eu/oecd/fua/' + params.id);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                //console.log(res);
                callback(null, {
                    country: params.country,
                    resources: utilObject.parseOECDFUA(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        }
    }
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
};
