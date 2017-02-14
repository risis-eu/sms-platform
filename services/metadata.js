'use strict';
import {getStaticEndpointParameters, getHTTPQuery} from './utils/helpers';
import {defaultGraphName} from '../configs/general';
import MetadataQuery from './sparql/MetadataQuery';
import MetadataUtil from './utils/MetadataUtil';
import DatasetQuery from './sparql/DatasetQuery';
import DatasetUtil from './utils/DatasetUtil';
import ResourceQuery from './sparql/ResourceQuery';
import ResourceUtil from './utils/ResourceUtil';
import rp from 'request-promise';
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
/*-----------------------------------*/
let endpointParameters, graphName, resourceURI, query, queryObject, datasetQueryObject, resourceQueryObject, utilObject, datasetUtilObject, resourceUtilObject;
queryObject = new MetadataQuery();
utilObject = new MetadataUtil();
datasetQueryObject = new DatasetQuery();
datasetUtilObject = new DatasetUtil();
resourceQueryObject = new ResourceQuery();
resourceUtilObject = new ResourceUtil();

export default {
    name: 'metadata',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'metadata.datasetsList'){
            graphName = '';
            endpointParameters = getStaticEndpointParameters(graphName);
            //SPARQL QUERY
            query = datasetQueryObject.getDatasetsList();
            //send request
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                //console.log(res);
                callback(null, {
                    resources: utilObject.parseDatasetsList(res)
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {resources: []});
            });
        } else if (resource === 'metadata.dataset') {
            graphName = '';
            endpointParameters = getStaticEndpointParameters(graphName);
            graphName = 'http://rdf.risis.eu/dataset/'+params.name+'/1.0/void.ttl#';
            resourceURI = 'http://rdf.risis.eu/dataset/'+params.name+'/1.0/void.ttl#'+params.name+'_rdf_dataset';
            query = resourceQueryObject.getProperties(graphName, resourceURI);
            rp.get({uri: getHTTPGetURL(getHTTPQuery('read', query, endpointParameters, outputFormat))}).then(function(res){
                //console.log(res);
                callback(null, {
                    name: params.name,
                    WebURI: 'http://datasets.risis.eu/metadata/' + params.name,
                    resourceURI: resourceURI,
                    resourceGraphName: graphName,
                    properties: utilObject.parseResourceprops(resourceUtilObject.parseProperties(res, graphName, resourceURI, '', ''))
                });
            }).catch(function (err) {
                console.log(err);
                callback(null, {properties: []});
            });
        }
    }
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
};
