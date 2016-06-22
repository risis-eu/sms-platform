'use strict';
import {getEndpointParameters, getHTTPQuery, isValidAPIToken} from './utils/helpers';
import {defaultGraphName} from '../configs/general';
import GeoQuery from './sparql/GeoQuery';
import GeoUtil from './utils/GeoUtil';
import rp from 'request-promise';
import redis from 'redis';
/*-------------config-------------*/
const outputFormat = 'application/sparql-results+json';
const redisServer = {'host': '127.0.0.1', 'port': '6379'}; //defaukt: 127.0.0.1 and 6379
/*-----------------------------------*/
let endpointParameters, graphName, query, queryObject, utilObject;
queryObject = new GeoQuery();
utilObject = new GeoUtil();
//redis for caching
let redisClient = redis.createClient(redisServer.port, redisServer.host); //creates a new client
redisClient.on('connect', function() {
    console.log('redis cache server connected...');
});
redisClient.on('error', function (err) {
    //console.log(err);
    console.log('redis Error ' + err);
    //stop in case of bad connection
    if(err.code === 'ECONNREFUSED'){
        //redisClient.quit();
    }
});
export default {
    name: 'geo',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if(resource === 'geo.googleGeocode'){
            let address = encodeURIComponent(decodeURIComponent(params.addr));
            let apiURI = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=' + params.apiKey;
            //start to get it from the cache
            redisClient.get(['googleGeocode', address].join('-'), function(err, reply) {
                if(reply){
                    //console.log('GoogleGeocode response from cache...');
                    callback(null, {
                        address: decodeURIComponent(params.addr),
                        resources: JSON.parse(reply)
                    });
                }else{
                    //send request
                    rp.get({uri: apiURI}).then(function(res){
                        //console.log(res);
                        let gres = JSON.parse(res);
                        if(!gres.error_message){
                            redisClient.set(['googleGeocode', address].join('-'), res);
                        }
                        callback(null, {
                            address: params.addr,
                            resources: gres
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {
                            address: params.addr,
                            resources: {results: []}
                        });
                    });
                }
            });
        } else if(resource === 'geo.PointToNUTS'){
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            let queryGADM = queryObject.getPointToGADM28Admin(params.lat, params.long, params.country, params.level);
            //console.log(query);
            //start to get it from the cache
            let hashID = ['GADM', params.lat, params.long, params.country, params.level].join('-');
            redisClient.get(hashID, function(error, reply) {
                if(reply){
                    //console.log('GADM response from cache...');
                    callback(null, {
                        latitude: parseFloat(params.lat),
                        longitude: parseFloat(params.long),
                        resources: JSON.parse(reply)
                    });
                }else{
                    //send request
                    rp.get({uri: getHTTPQuery('read', queryGADM, endpointParameters, outputFormat)}).then(function(res){
                        //console.log(res);
                        let resGADM = utilObject.parsePointToGADM28Admin(res, params.country);
                        //if(!resGADM.error){
                            redisClient.set(hashID, JSON.stringify(resGADM));
                        //}
                        callback(null, {
                            latitude: parseFloat(params.lat),
                            longitude: parseFloat(params.long),
                            resources: resGADM
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {resources: []});
                    });
                }
            });
        } else if (resource === 'geo.GADM28AdminToPolygon') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            let queryOSM = queryObject.getPointToOSMAdmin(params.lat, params.long, params.country, params.level);
            //start to get it from the cache
            let hashID = ['OSM',params.lat, params.long, params.country, params.level].join('-');
            redisClient.get(hashID, function(error, reply) {
                if(reply){
                    //console.log('OSM response from cache...');
                    callback(null, {
                        latitude: parseFloat(params.lat),
                        longitude: parseFloat(params.long),
                        resources: JSON.parse(reply)
                    });
                }else{
                    if(params.useExternal){
                        if(params.useExternal === 'MapIt'){
                            //send request
                            let externalURI = 'http://global.mapit.mysociety.org/point/4326/'+params.long+','+ params.lat;
                            //console.log(externalURI);
                            rp.get({uri: externalURI}).then(function(res){
                                //console.log(res);
                                let resOSM = utilObject.parsePointToOSMAdminMapIt(res, params.country);
                                //if(!resOSM.error){
                                    redisClient.set(hashID, JSON.stringify(resOSM));
                                //}
                                callback(null, {
                                    latitude: parseFloat(params.lat),
                                    longitude: parseFloat(params.long),
                                    resources: resOSM
                                });
                            }).catch(function (err) {
                                console.log(err);
                                callback(null, {resources: []});
                            });
                        }else{
                            callback(null, {resources: []});
                        }
                    }else{
                        //send request
                        //console.log(queryOSM);
                        rp.get({uri: getHTTPQuery('read', queryOSM, endpointParameters, outputFormat)}).then(function(res){
                            //console.log(res);
                            let resOSM = utilObject.parsePointToOSMAdmin(res, params.country);
                            //if(!resOSM.error){
                                redisClient.set(hashID, JSON.stringify(resOSM));
                            //}
                            callback(null, {
                                latitude: parseFloat(params.lat),
                                longitude: parseFloat(params.long),
                                resources: resOSM
                            });
                        }).catch(function (err) {
                            console.log(err);
                            callback(null, {resources: []});
                        });
                    }
                }
            });

        } else if (resource === 'geo.OSMAdmin') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            let queryFlickr = queryObject.getPointToFlickrAdmin(params.lat, params.long, params.country, params.level);
            //start to get it from the cache
            let hashID = ['Flickr', params.lat, params.long, params.country, params.level].join('-');
            redisClient.get(hashID, function(error, reply) {
                if(reply){
                    //console.log('Flickr response from cache...');
                    callback(null, {
                        latitude: parseFloat(params.lat),
                        longitude: parseFloat(params.long),
                        resources: JSON.parse(reply)
                    });
                }else{
                    //send request
                    rp.get({uri: getHTTPQuery('read', queryFlickr, endpointParameters, outputFormat)}).then(function(res){
                        //console.log(res);
                        let resFlickr = utilObject.parsePointToFlickrAdmin(res, params.country);
                        //if(!resFlickr.error){
                            redisClient.set(hashID, JSON.stringify(resFlickr));
                        //}
                        callback(null, {
                            latitude: parseFloat(params.lat),
                            longitude: parseFloat(params.long),
                            resources: resFlickr
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {resources: []});
                    });
                }
            });
        } else if (resource === 'geo.FlickrAdmin') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
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
        } else if (resource === 'geo.PointToOECDFUA') {
            if(!params.smsKey || !isValidAPIToken(params.smsKey)){
                callback(null, {resources: [], error: {'type':'access', 'msg': 'Invalid SMS API Key!'}}); return 0;
            }
            graphName = 'big-data-endpoint';
            endpointParameters = getEndpointParameters(graphName);
            //SPARQL QUERY
            let queryFUA = queryObject.getPointToOECDFUA(params.lat, params.long, params.country);
            let hashID = ['OECDFUA', params.lat, params.long, params.country].join('-');
            redisClient.get(hashID, function(error, reply) {
                if(reply){
                    //console.log('GADM response from cache...', JSON.parse(reply));
                    callback(null, {
                        latitude: parseFloat(params.lat),
                        longitude: parseFloat(params.long),
                        resources: JSON.parse(reply)
                    });
                }else{
                    //send request
                    rp.get({uri: getHTTPQuery('read', queryFUA, endpointParameters, outputFormat)}).then(function(res){
                        //console.log(res);
                        let resFUA = utilObject.parsePointToOECDFUA(res);
                        //if(!resGADM.error){
                            redisClient.set(hashID, JSON.stringify(resFUA));
                        //}
                        callback(null, {
                            latitude: parseFloat(params.lat),
                            longitude: parseFloat(params.long),
                            resources: resFUA
                        });
                    }).catch(function (err) {
                        console.log(err);
                        callback(null, {resources: []});
                    });
                }
            });
        }
    }
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
};
