'use strict';
import {getEndpointParameters, getHTTPQuery, isValidAPIToken} from './utils/helpers';
import {defaultGraphName, enableAuthentication} from '../configs/general';
import DataQuery from './sparql/DataQuery';
import DataUtil from './utils/DataUtil';
import Configurator from './utils/Configurator';
import rp from 'request-promise';
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
const headers = {'Accept': 'application/sparql-results+json'};
let user;
/*-----------------------------------*/
let endpointParameters, cGraphName, graphName, query, queryObject, utilObject, configurator, propertyURI;
queryObject = new DataQuery();
utilObject = new DataUtil();
configurator = new Configurator();

export default {
    name: 'data',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'data.datasets'){
            const defaultDatasetListGraph = 'http://rdf.risis.eu/datasets/';
            graphName = (params.id ? decodeURIComponent(params.id) : defaultDatasetListGraph);
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetsList(graphName);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasets: utilObject.parseDatasetsList(res),
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {datasets: []});
            });
        } else if (resource === 'data.dataset.entityTypes') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {entityTypes: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!params.datasetURI){
                callback(null, {entityTypes: [], error: {'type':'params', 'msg': 'datasetURI is not given!'}}); return 0;
            }
            graphName = decodeURIComponent(params.datasetURI);
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntityTypes(graphName);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: graphName,
                    entityTypes: utilObject.parseDatasetEntityTypes(res),
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {datasetURI: graphName,entityTypes: []});
            });
        } else if (resource === 'data.dataset.entities') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!params.datasetURI || !params.entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let offsetF = 0;
            let limitF = 20 ;
            if(params.offset){
                offsetF = params.offset;
            }
            if(params.limit){
                limitF = params.limit;
            }
            graphName = decodeURIComponent(params.datasetURI);
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntities(graphName, decodeURIComponent(params.entityTypeURI), offsetF, limitF);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: graphName,
                    entityTypeURI: decodeURIComponent(params.entityTypeURI),
                    offset: offsetF,
                    limit: limitF,
                    entities: utilObject.parseDatasetEntities(res),
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {entities: []});
            });
        } else if (resource === 'data.dataset.entity'){
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!params.datasetURI || !params.entityURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityURI are not given!'}}); return 0;
            }
            graphName = decodeURIComponent(params.datasetURI);
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntity(graphName, decodeURIComponent(params.entityURI));
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: graphName,
                    entityURI: decodeURIComponent(params.entityURI),
                    properties: utilObject.parseDatasetEntity(res),
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {entities: []});
            });
        }
    }
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
};
