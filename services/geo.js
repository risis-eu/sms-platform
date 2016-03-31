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
        if(resource === 'geo.pointToNUTS'){
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
                    resources: utilObject.parsePointToNUTS(res),
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
                    resources: utilObject.parsePointToNUTS(res),
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
                    resources: utilObject.parsePointToNUTS(res),
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
                    resources: utilObject.parseNUTStoPolygon(res),
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
