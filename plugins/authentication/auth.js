'use strict';
let rp = require('request-promise');
let config = require('../../configs/server');
let generalConfig = require('../../configs/general');
let helpers = require('../../services/utils/helpers');
let outputFormat = 'application/sparql-results+json';
//this is visible to the server-side
module.exports = {
    getPropertyLabel: function(uri) {
        let property = '';
        let tmp = uri;
        let tmp2 = tmp.split('#');
        if (tmp2.length > 1) {
            property = tmp2[1];
        } else {
            tmp2 = tmp.split('/');
            property = tmp2[tmp2.length - 1];
        }
        return property;
    },
    findById: function(id, fn) {
        let self = this;
        let endpoint = helpers.getStaticEndpointParameters([generalConfig.authDatasetURI[0]]);
        let {gStart, gEnd} = helpers.prepareGraphName(endpoint.graphName);
        let query = `
            PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT ?p ?o ?pr ?pp WHERE {
                ${gStart}
                    <${id}> a ldr:User ; ?p ?o .
                    OPTIONAL {?o ldr:resource ?pr . ?o ldr:property ?pp .}
                ${gEnd}
            }
        `;
        //send request
        let rpPath = helpers.getHTTPGetURL(helpers.getHTTPQuery('read', query, endpoint, outputFormat));
        rp.get({
            uri: rpPath
        }).then(function(res) {
            let parsed = JSON.parse(res);
            let user = {};
            user.editorOfDataset = [];
            user.editorOfResource = [];
            user.editorOfProperty = [];
            if (parsed.results.bindings.length) {
                parsed.results.bindings.forEach(function(el) {
                    if (self.getPropertyLabel(el.p.value) === 'editorOfDataset') {
                        user.editorOfDataset.push(el.o.value);
                    } else {
                        if (self.getPropertyLabel(el.p.value) === 'editorOfResource') {
                            user.editorOfResource.push(el.o.value);
                        } else {
                            if (self.getPropertyLabel(el.p.value) === 'editorOfProperty') {
                                if (el.pp && el.pr) {
                                    user.editorOfProperty.push({
                                        p: el.pp.value,
                                        r: el.pr.value
                                    })
                                }
                            } else {
                                user[self.getPropertyLabel(el.p.value)] = el.o.value;
                            }
                        }
                    }
                });
                //to not show password in session
                delete user.password;
                user.datasetURI = generalConfig.authDatasetURI[0];
                user.id = id;
                return fn(null, user);
            }
        }).catch(function(err) {
            console.log(err);
            return fn(null, null);
        });
    },
    findByUsername: function(username, fn) {
        let self = this;
        let endpoint = helpers.getStaticEndpointParameters([generalConfig.authDatasetURI[0]]);
        let {gStart, gEnd} = helpers.prepareGraphName(endpoint.graphName);
        let query = `
            PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>
            SELECT ?s ?p ?o WHERE {
                ${gStart}
                    ?s a ldr:User ;
                       foaf:accountName "${username}" ;
                       ?p ?o .
                ${gEnd}
            }
        `;
        let rpPath = helpers.getHTTPGetURL(helpers.getHTTPQuery('read', query, endpoint, outputFormat));
        //send request
        rp.get({
            uri: rpPath
        }).then(function(res) {
            let parsed = JSON.parse(res);
            let user = {};
            if (parsed.results.bindings.length) {
                parsed.results.bindings.forEach(function(el) {
                    user[self.getPropertyLabel(el.p.value)] = el.o.value;
                });
                user.id = parsed.results.bindings[0].s.value;
                // console.log(user);
                return fn(null, user);
            }
        }).catch(function(err) {
            console.log(err);
            return fn(null, null);
        });
    }
};
