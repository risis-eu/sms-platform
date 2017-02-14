'use strict';
import {getStaticEndpointParameters, getHTTPQuery, getHTTPGetURL, isValidAPIToken} from './utils/helpers';
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
let endpointParameters, cGraphName, graphName, query, queryObject, utilObject, configurator, datasetURI, entityURI, entityTypeURI, propertyURI, queryParams, smsKey, offsetF, limitF, accessToken, filters, maxEntities = 10000;
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
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetsList(graphName);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
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
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntityTypes(graphName,'');
            //console.log(query);
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
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
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------

            if(!smsKey || !isValidAPIToken(smsKey)){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            graphName = datasetURI;
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                callback(null, {
                    datasetURI: datasetURI,
                    entityTypeURI: entityTypeURI,
                    offset: offsetF,
                    limit: limitF,
                    maximumPerPage: maxEntities,
                    entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {entities: []});
            });
        } else if (resource === 'data.nano.patents.metadata') {
            datasetURI = 'http://risis.eu/dataset/nano';
            entityTypeURI = 'http://risis.eu/nano/ontology/class/Document';
            graphName = datasetURI;
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntityTypes(graphName, entityTypeURI);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                callback(null, {metadata: {
                    api_path: '/api/v1.0/data.nano.patents',
                    label: '[RISIS] Nano Patents Dataset',
                    description: 'List of Nanotechnology patents from RISIS Nano Dataset.',
                    total_number_of_entities: utilObject.parseDatasetEntityTypes(datasetURI, res)[0].count,
                    input:{
                        'offset': {label: 'Offset', description:'offset of entities', type: 'number'},
                        'limit': {label: 'Limit', description:'number of entities to be returned in one call', type: 'number'},
                        'filters': {label: 'Filters', description:'allows filtering of the results e.g. accept, ignore parameters can filter the properties returned by API.', type: 'object', children: {
                            'accept': {label: 'Accept', description:'set of properties to be selected', type: 'array'},
                            'ignore': {label: 'Ignore', description:'set of properties to be ignored', type: 'array'},
                        }},
                        'access_token': {label: 'Access Token', description:'token required to call the API', type: 'string'}
                    },
                    output:{
                        entity_properties: [
                            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            'http://risis.eu/nano/ontology/predicate/id',
                            'http://risis.eu/nano/ontology/predicate/appln_abstract',
                            'http://risis.eu/nano/ontology/predicate/appln_auth',
                            'http://risis.eu/nano/ontology/predicate/appln_filing_year',
                            'http://risis.eu/nano/ontology/predicate/appln_first_priority_year',
                            'http://risis.eu/nano/ontology/predicate/appln_id',
                            'http://risis.eu/nano/ontology/predicate/appln_kind',
                            'http://risis.eu/nano/ontology/predicate/appln_nr',
                            'http://risis.eu/nano/ontology/predicate/appln_title',
                            'http://risis.eu/nano/ontology/predicate/artificial'
                        ]
                    }
                }});
            }).catch(function (err) {
                console.log(err);
                callback(null, {metadata: {}});
            });
        } else if (resource === 'data.nano.patents') {
            //set params
            //smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = 'http://risis.eu/dataset/nano';
            entityTypeURI = 'http://risis.eu/nano/ontology/class/Document';
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------
            filters = params.filters ? decodeURIComponent(params.filters) : (queryParams.filters ? decodeURIComponent(queryParams.filters) : '');
            accessToken = params.access_token ? params.access_token : (queryParams.access_token ? queryParams.access_token : '');
            if(!accessToken){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let validationURI =`https://auth-risis.cortext.net/auth/access?access_token=${accessToken}`;
            rp.get({uri: validationURI}).then(function(r1){
                let tmp = JSON.parse(r1);
                if(tmp.error){
                    callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
                }else{
                    graphName = datasetURI;
                    endpointParameters = getStaticEndpointParameters(graphName);
                    //SPARQL QUERY
                    query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
                    //console.log(query);
                    //send request
                    rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                        callback(null, {
                            datasetURI: datasetURI,
                            entityTypeURI: entityTypeURI,
                            offset: offsetF,
                            limit: limitF,
                            maximumPerPage: maxEntities,
                            entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {entities: []});
                    });
                }
            }).catch(function (err1) {
                //console.log(err1);
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            });
        } else if (resource === 'data.nano.organisations') {
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = 'http://risis.eu/dataset/nano';
            entityTypeURI = 'http://risis.eu/nano/ontology/class/Organisation';
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------
            filters = params.filters ? decodeURIComponent(params.filters) : (queryParams.filters ? decodeURIComponent(queryParams.filters) : '');
            accessToken = params.access_token ? params.access_token : (queryParams.access_token ? queryParams.access_token : '');
            if(!accessToken){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let validationURI =`https://auth-risis.cortext.net/auth/access?access_token=${accessToken}`;
            rp.get({uri: validationURI}).then(function(r1){
                let tmp = JSON.parse(r1);
                if(tmp.error){
                    callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
                }else{
                    graphName = datasetURI;
                    endpointParameters = getStaticEndpointParameters(graphName);
                    //SPARQL QUERY
                    query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
                    //console.log(query);
                    //send request
                    rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                        callback(null, {
                            datasetURI: datasetURI,
                            entityTypeURI: entityTypeURI,
                            offset: offsetF,
                            limit: limitF,
                            maximumPerPage: maxEntities,
                            entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {entities: []});
                    });
                }
            }).catch(function (err1) {
                //console.log(err1);
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            });
        } else if (resource === 'data.orgref.organisations') {
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = 'http://orgref.org';
            entityTypeURI = 'http://risis.eu/orgref/ontology/class/Organisation';
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------
            filters = params.filters ? decodeURIComponent(params.filters) : (queryParams.filters ? decodeURIComponent(queryParams.filters) : '');
            accessToken = params.access_token ? params.access_token : (queryParams.access_token ? queryParams.access_token : '');
            if(!accessToken){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let validationURI =`https://auth-risis.cortext.net/auth/access?access_token=${accessToken}`;
            rp.get({uri: validationURI}).then(function(r1){
                let tmp = JSON.parse(r1);
                if(tmp.error){
                    callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
                }else{
                    graphName = datasetURI;
                    endpointParameters = getStaticEndpointParameters(graphName);
                    //SPARQL QUERY
                    query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
                    //console.log(query);
                    //send request
                    rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                        callback(null, {
                            datasetURI: datasetURI,
                            entityTypeURI: entityTypeURI,
                            offset: offsetF,
                            limit: limitF,
                            maximumPerPage: maxEntities,
                            entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {entities: []});
                    });
                }
            }).catch(function (err1) {
                //console.log(err1);
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            });
        } else if (resource === 'data.cordisFP7.projects') {
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = 'http://www.freme-project.eu/datasets/cordis';
            entityTypeURI = 'http://dbpedia.org/ontology/ResearchProject';
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------
            filters = params.filters ? decodeURIComponent(params.filters) : (queryParams.filters ? decodeURIComponent(queryParams.filters) : '');
            accessToken = params.access_token ? params.access_token : (queryParams.access_token ? queryParams.access_token : '');
            if(!accessToken){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let validationURI =`https://auth-risis.cortext.net/auth/access?access_token=${accessToken}`;
            rp.get({uri: validationURI}).then(function(r1){
                let tmp = JSON.parse(r1);
                if(tmp.error){
                    callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
                }else{
                    graphName = datasetURI;
                    endpointParameters = getStaticEndpointParameters(graphName);
                    //SPARQL QUERY
                    query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
                    //console.log(query);
                    //send request
                    rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                        callback(null, {
                            datasetURI: datasetURI,
                            entityTypeURI: entityTypeURI,
                            offset: offsetF,
                            limit: limitF,
                            maximumPerPage: maxEntities,
                            entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {entities: []});
                    });
                }
            }).catch(function (err1) {
                //console.log(err1);
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            });
        } else if (resource === 'data.eupro.projects') {
            //set params
            smsKey = params.smsKey ? params.smsKey : (queryParams.smsKey ? queryParams.smsKey : '');
            datasetURI = 'http://risis.eu/dataset/eupro';
            entityTypeURI = 'http://risis.eu/eupro/ontology/class/Projects';
            offsetF = params.offset ? params.offset : (queryParams.offset ? queryParams.offset : 0);
            limitF = params.limit ? params.limit : (queryParams.limit ? queryParams.limit : 20);
            if(limitF > maxEntities){
                limitF = maxEntities;
            }
            //----------
            filters = params.filters ? decodeURIComponent(params.filters) : (queryParams.filters ? decodeURIComponent(queryParams.filters) : '');
            accessToken = params.access_token ? params.access_token : (queryParams.access_token ? queryParams.access_token : '');
            if(!accessToken){
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
            }
            //the URI of graph where data is stored
            if(!datasetURI || !entityTypeURI ){
                callback(null, {entities: [], error: {'type':'params', 'msg': 'datasetURI or entityTypeURI are not given!'}}); return 0;
            }
            let validationURI =`https://auth-risis.cortext.net/auth/access?access_token=${accessToken}`;
            rp.get({uri: validationURI}).then(function(r1){
                let tmp = JSON.parse(r1);
                if(tmp.error){
                    callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
                }else{
                    graphName = datasetURI;
                    endpointParameters = getStaticEndpointParameters(graphName);
                    //SPARQL QUERY
                    query = queryObject.getDatasetEntities(graphName, decodeURIComponent(entityTypeURI), offsetF, limitF);
                    //console.log(query);
                    //send request
                    rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                        callback(null, {
                            datasetURI: datasetURI,
                            entityTypeURI: entityTypeURI,
                            offset: offsetF,
                            limit: limitF,
                            maximumPerPage: maxEntities,
                            entities: utilObject.parseDatasetEntities(datasetURI, entityTypeURI, res, filters)
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {entities: []});
                    });
                }
            }).catch(function (err1) {
                //console.log(err1);
                callback(null, {entities: [], error: {'type':'access', 'msg': 'Invalid Access Token!'}}); return 0;
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
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = queryObject.getDatasetEntity(graphName, entityURI);
            //console.log(query);
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
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
