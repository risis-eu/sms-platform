'use strict';
import {dbpediaLookupService, dbpediaSpotlightService, googleMapsGeocodingAPIKey, smsAPIKey} from '../configs/server';
import rp from 'request-promise';
import DBpediaUtil from './utils/DBpediaUtil';
import DBpediaQuery from './sparql/DBpediaQuery';
const DBpediaEndpoint = 'http://dbpedia.org/sparql';
const DBpediaLiveEndpoint = 'http://live.dbpedia.org/sparql';
const outputFormat = 'application/sparql-results+json';
let query, lookupClass = '';
let utilObject = new DBpediaUtil();
let queryObject = new DBpediaQuery();

export default {
    // Name is the resource. Required.
    name: 'dbpedia',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        if (resource === 'dbpedia.lookup') {
            query = params.query;
            lookupClass = params.lookupClass ? params.lookupClass : '';
            //send request
            rp({method: 'get', headers: {'Accept': 'application/json'}, accept: 'application/json', uri: 'http://' + dbpediaLookupService[0].host + '/api/search.asmx/PrefixSearch?QueryClass=' + lookupClass + '&MaxHits=5&QueryString=' + query}).then(function(res){
                callback(null, {
                    suggestions: utilObject.parseDBpediaLookup(res)
                });
            }).catch(function (err) {
                console.log('\n dbpedia.lookup \n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                callback(null, {suggestions: []});
            });
        /////////////////////////////////////////////
        } else if (resource === 'dbpedia.coordinates') {
            let rpPath, uris = params.uris;
            query = queryObject.getPrefixes() + queryObject.getCoordinates(uris);
            // console.log(query);
            rpPath = DBpediaLiveEndpoint + '?query=' + encodeURIComponent(query) + '&format=' + encodeURIComponent(outputFormat);
            rp.get({uri: rpPath}).then(function(res){
                callback(null, {coordinates: utilObject.parseDBpediaCoordinates(res), property: params.property});
            }).catch(function () {
                //last chance: try DBpedia live endpoint!
                rpPath = DBpediaEndpoint + '?query=' + encodeURIComponent(query) + '&format=' + encodeURIComponent(outputFormat);
                rp.get({uri: rpPath}).then(function(res){
                    callback(null, {coordinates: utilObject.parseDBpediaCoordinates(res), property: params.property});
                }).catch(function (err) {
                    console.log(err);
                    callback(null, {coordinates: [], property: ''});
                });
            });
          /////////////////////////////////////////////
        } else if (resource === 'dbpedia.spotlight') {
            query = params.query;
            //send request
            rp.post({headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}, accept: 'application/json', uri: 'http://' + dbpediaSpotlightService[0].host + ':' + dbpediaSpotlightService[0].port + dbpediaSpotlightService[0].path, form: {'text': query}}).then(function(res){
                callback(null, {
                    tags: utilObject.parseDBpediaSpotlight(res),
                    id: params.id,
                    query: params.query
                });
            }).catch(function (err) {
                console.log('\n dbpedia.spotlight \n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                callback(null, {tags: [], id: params.id, query: params.query, error: 'spotlight service'});
            });
        } else if (resource === 'dbpedia.address2boundary') {
            let boundarySource = 'GADM';
            let boundaryService= 'GADM28Admin';
            if(params.boundarySource){
                if(params.boundarySource.toLowerCase() === 'gadm'){
                    boundarySource = 'GADM'
                    boundaryService = 'GADM28Admin'
                }else if(params.boundarySource.toLowerCase() === 'osm'){
                    boundarySource = 'OSM'
                    boundaryService = 'OSMAdmin'
                }else if(params.boundarySource.toLowerCase() === 'flickr'){
                    boundarySource = 'Flickr'
                    boundaryService = 'FlickrAdmin'
                }
            }
            //console.log('-->> ', params.id, params.query, params.enrichment);
            if(params.enrichment && params.enrichment.longitude){
                //it is when there is no need for geocoding
                if(params.enrichment.longitude === 'missing'){
                    callback(null, {enrichment: {location: 0, boundarySource: params.boundarySource, boundaries: []} , id: params.id, query: params.query, error: 'missing'});
                    return 0;
                }else{
                    let countryQs='';
                    if(params.enrichment.country){
                        countryQs= ';country='+params.enrichment.country;
                    }
                    //todo: by default it uses map it, change it later on
                    rp.get({headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}, accept: 'application/json', uri: 'http://sms.risis.eu/api/v1.0/geo.PointTo'+boundaryService+';useExternal=MapIt;smsKey='+smsAPIKey[0] + ';lat='+params.enrichment.latitude+';long='+params.enrichment.longitude+countryQs}).then(function(res2){
                        let parsed = JSON.parse(res2);
                        callback(null, {
                            id: params.id,
                            query: params.query,
                            enrichment: {
                                location: params.enrichment,
                                boundarySource: boundarySource,
                                boundaries: parsed.resources
                            }
                        });
                    }).catch(function (err2) {
                        console.log('\n sms boundaries \n Status Code: \n' + err2.statusCode + '\n Error Msg: \n' + err2.message);
                        callback(null, {enrichment: {location: 0, boundarySource: params.boundarySource, boundaries: []} , id: params.id, query: params.query, error: 'sms service'});
                    });
                }
            }else{
                query = params.query;
                //send request
                rp.get({headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}, accept: 'application/json', uri: 'http://sms.risis.eu/api/v1.0/geo.googleGeocode;addr=' + query + ';apiKey=' + googleMapsGeocodingAPIKey[0]}).then(function(res){
                    let enrichment = utilObject.parseGoogleGeocoding(res);
                    if(!enrichment){
                        callback(null, {enrichment: {location: 0, boundarySource: params.boundarySource, boundaries: []} , id: params.id, query: params.query});
                        return 0;
                    }
                    let countryQs='';
                    if(enrichment.country){
                        countryQs= ';country='+enrichment.country;
                    }
                    //todo: by default it uses map it, change it later on
                    rp.get({headers: {'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded'}, accept: 'application/json', uri: 'http://sms.risis.eu/api/v1.0/geo.PointTo'+boundaryService+';useExternal=MapIt;smsKey='+smsAPIKey[0] + ';lat='+enrichment.latitude+';long='+enrichment.longitude+countryQs}).then(function(res2){
                        let parsed = JSON.parse(res2);
                        callback(null, {
                            id: params.id,
                            query: params.query,
                            enrichment: {
                                location: enrichment,
                                boundarySource: boundarySource,
                                boundaries: parsed.resources
                            }
                        });
                    }).catch(function (err2) {
                        console.log('\n sms boundaries \n Status Code: \n' + err2.statusCode + '\n Error Msg: \n' + err2.message);
                        callback(null, {enrichment: {location: 0, boundarySource: params.boundarySource, boundaries: []} , id: params.id, query: params.query, error: 'sms service'});
                    });

                }).catch(function (err) {
                    console.log('\n googleGeocoding \n Status Code: \n' + err.statusCode + '\n Error Msg: \n' + err.message);
                    callback(null, {enrichment: {location: 0, boundarySource: params.boundarySource, boundaries: []} , id: params.id, query: params.query, error: 'google service'});
                });
            }

        }
    }
    // other methods
    // create: function(req, resource, params, body, config, callback) {},
    // update: function(req, resource, params, body, config, callback) {},
    // delete: function(req, resource, params, config, callback) {}
};
