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
let endpointParameters, cGraphName, graphName, query, queryObject, utilObject, configurator, datasetURI, entityURI, entityTypeURI, propertyURI, queryParams, smsKey, offsetF, limitF;
queryObject = new DataQuery();
utilObject = new DataUtil();
configurator = new Configurator();

export default {
    name: 'data',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        queryParams = req.query;
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
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = params.datasetURI ? decodeURIComponent(params.datasetURI) : (queryParams.datasetURI ? decodeURIComponent(queryParams.datasetURI) : '');
            //----------
            // if(!smsKey || !isValidAPIToken(smsKey)){
            //     callback(null, {entityTypes: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            // }
            //the URI of graph where data is stored
            if(!datasetURI){
                callback(null, {entityTypes: [], error: {'type':'params', 'msg': 'datasetURI is not given!'}}); return 0;
            }
            graphName = datasetURI;
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntityTypes(graphName);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: datasetURI,
                    entityTypes: utilObject.parseDatasetEntityTypes(datasetURI, res),
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {datasetURI: datasetURI,entityTypes: []});
            });
        } else if (resource === 'data.dataset.entities') {
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = params.datasetURI ? decodeURIComponent(params.datasetURI) : (queryParams.datasetURI ? decodeURIComponent(queryParams.datasetURI) : '');
            entityTypeURI = params.entityTypeURI ? decodeURIComponent(params.entityTypeURI) : (queryParams.entityTypeURI ? decodeURIComponent(queryParams.entityTypeURI) : '');
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            //----------

            if(!smsKey || !isValidAPIToken(smsKey)){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            graphName = datasetURI;
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: datasetURI,
                    entityTypeURI: entityTypeURI,
                    offset: offsetF,
                    limit: limitF,
                    entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {entities: []});
            });
        } else if (resource === 'data.dataset.entity'){
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = params.datasetURI ? decodeURIComponent(params.datasetURI) : (queryParams.datasetURI ? decodeURIComponent(queryParams.datasetURI) : '');
            entityURI = params.entityURI ? decodeURIComponent(params.entityURI) : (queryParams.entityURI ? decodeURIComponent(queryParams.entityURI) : '');
            //----------

            if(!smsKey || !isValidAPIToken(smsKey)){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityURI are not given!'}}); return 0;
            }
            graphName = decodeURIComponent(datasetURI);
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntity(graphName, entityURI);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPQuery('read', query, endpointParameters, outputFormat)}).then(function(res){
                callback(null, {
                    datasetURI: datasetURI,
                    entityURI: entityURI,
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
