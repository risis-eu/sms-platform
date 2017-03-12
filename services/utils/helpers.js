import {sparqlEndpoint, apiTokens} from '../../configs/server';
import {defaultDatasetURI, enableDynamicServerConfiguration, enableAuthentication} from '../../configs/general';
import validUrl from 'valid-url';
import queryString from 'query-string';

let prepareStaticDGFunc = (datasetURI)=>{
    let d = datasetURI, g = datasetURI;
    //try default graph if no datasetURI is given
    if(String(defaultDatasetURI[0]) !==''){
        if(!d) {
            d = defaultDatasetURI[0];
        }
    }
    if(sparqlEndpoint[d]){
        if(sparqlEndpoint[d].graphName){
            g = sparqlEndpoint[d].graphName;
        }else{
            if(d === 'generic'){
                g = 'default';
            }else{
                g = d;
            }
        }
    }else{
        //go for generic SPARQL endpoint
        if(sparqlEndpoint['generic'].graphName){
            g = sparqlEndpoint['generic'].graphName;
        }else{
            g = d;
        }
        d = 'generic';
    }
    return {d: d, g: g};
}

let includesDataset= (rights, dataset)=> {
    let out = false;
    rights.forEach(function(el) {
        if (el.scope === 'D') {
            if(el.dataset === dataset){
                out = true;
                return out;
            }
        }
    });
    return out;
}
let includesResource= (rights, dataset, resource, resourceType)=> {
    let out = false;
    rights.forEach(function(el) {
        if (el.scope === 'DR') {
            if(el.dataset === dataset && el.resource === resource){
                out = true;
                return out;
            }else{
                if(el.treatAsResourceType && el.dataset === dataset &&  resourceType.indexOf(el.resource)!==-1){
                    out = true;
                    return out;
                }
            }
        }else if (el.scope === 'R') {
            if(el.resource === resource){
                out = true;
                return out;
            }else{
                if(el.treatAsResourceType &&  resourceType.indexOf(el.resource)!==-1){
                    out = true;
                    return out;
                }
            }
        }
    });
    return out;
}
let includesProperty= (rights, dataset, resource, resourceType, property)=> {
    let out = false;
    rights.forEach(function(el) {
        if (el.scope  && el.scope === 'DP') {
            if(el.dataset === dataset && el.property === property){
                out = true;
                return out;
            }
        }else if (el.scope  && el.scope === 'RP') {
            if(el.resource === resource && el.property === property){
                out = true;
                return out;
            }else{
                if(el.treatAsResourceType && el.resource === resourceType && el.property === property){
                    out = true;
                    return out;
                }
            }
        }else if (el.scope  && el.scope === 'DRP') {
            if(el.dataset === dataset && el.resource === resource && el.property === property){
                out = true;
                return out;
            }else{
                if(el.treatAsResourceType && el.dataset === dataset && el.resource === resourceType && el.property === property){
                    out = true;
                    return out;
                }
            }
        }else if (el.scope  && el.scope === 'P') {
            if(el.property === property){
                out = true;
                return out;
            }
        }
    });
    return out;
}

export default {
    //returns dataset and graphName
    prepareDG(datasetURI){
        return prepareStaticDGFunc(datasetURI);
    },
    //it is used for users and configs
    getStaticEndpointParameters(datasetURI){
        let httpOptions, {d, g} = prepareStaticDGFunc(datasetURI);
        httpOptions = {
            host: sparqlEndpoint[d].host,
            port: sparqlEndpoint[d].port,
            path: sparqlEndpoint[d].path
        };
        let useReasoning = 0;
        if(sparqlEndpoint[d].useReasoning){
            useReasoning = 1;
        }
        let etype = sparqlEndpoint[d].endpointType ? sparqlEndpoint[d].endpointType : 'virtuoso';
        return {httpOptions: httpOptions, type: etype.toLowerCase(), graphName: g, useReasoning: useReasoning};
    },
    //build the write URI and params for different SPARQL endpoints
    getHTTPQuery(mode, query, endpointParameters, outputFormat) {
        let outputObject = {uri: '', params: {}};

        if(endpointParameters.useReasoning){
            outputObject.params['reasoning'] = 'true';
        }

        switch (endpointParameters.type.toLowerCase()) {
            case 'virtuoso':

                outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                outputObject.params['query'] = query;
                outputObject.params['format'] = outputFormat;

                break;
            case 'stardog':
                outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                outputObject.params['query'] = query;
                outputObject.params['Accept'] = outputFormat;

                break;
            case 'cliopatria':
                if(mode === 'update'){
                    outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path + 'update';
                    outputObject.params['update'] = query;
                }else{
                    outputObject.params['query'] = query;
                    outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                    outputObject.params['format'] = outputFormat;
                }

                break;
        //todo: check the differences for other triple stores
            case 'sesame':
                if(mode === 'update'){
                    outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path + '/statements';
                    outputObject.params['update'] = query;
                }else{
                    outputObject.params['query'] = query;
                    outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                    outputObject.params['Accept'] = outputFormat;
                }

                break;
            default:
                outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                outputObject.params['query'] = query;
                outputObject.params['format'] = outputFormat;
        }
        return outputObject;
    },
    ///builds the HTTP get URL for SPARQL requests
    getHTTPGetURL(object){
        let uri = object.uri + '?' + queryString.stringify(object.params);
        return uri;
    },
    prepareGraphName(graphName){
        let gStart = 'GRAPH <'+ graphName +'> { ';
        let gEnd = ' } ';
        if(!graphName || graphName === 'default'){
            gStart =' ';
            gEnd = ' ';
        }
        return {gStart: gStart, gEnd: gEnd}
    },
    getQueryDataTypeValue(valueType, dataType, objectValue) {
        let newValue, dtype;
        switch (valueType) {
            case 'uri':
            case 'bnode':
            case 'literal':
                // automatically detect uris even in literal values
                if(validUrl.is_web_uri(objectValue.toString())){
                    newValue='<'+objectValue+'>';
                    dtype = 'uri';
                }else{
                    newValue='"""'+objectValue+'"""';
                    dtype = 'str';
                }
                break;
            case 'typed-literal':
            //handle typed-literal values
                switch (dataType) {
                    case 'http://www.w3.org/2001/XMLSchema#integer':
                        dtype = 'xsd:integer';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#decimal':
                        dtype = 'xsd:decimal';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#float':
                        dtype = 'xsd:float';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#double':
                        dtype = 'xsd:double';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#dateTime':
                        dtype = 'xsd:dateTime';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#date':
                        dtype = 'xsd:date';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#boolean':
                        dtype = 'xsd:boolean';
                        newValue='"'+objectValue+'"^^' + dtype;
                        break;
                    default:
                        newValue='"""'+objectValue+'"""';
                        dtype = 'str';
                }
                break;
            default:
                // default: handle as string
                newValue='"""'+objectValue+'"""';
                dtype = 'str';
        }
        //fix in virtuoso
        if(dtype === 'uri'){
            dtype = 'iri';
        }
        return {dtype: dtype, value: newValue};
    },
    isValidAPIToken(token) {
        if (apiTokens.indexOf(token) === -1) {
            return 0;
        } else {
            return 1;
        }
    },
    convertToISO3(country) {
        let inputCountry = country.toLowerCase().trim();
        let predefined = {
            'aland islands': 'ALA',
            'macau': 'MAC',
            'the bahamas': 'BHS',
            'bolivia': 'BOL',
            'brunei': 'BRN',
            'democratic republic of congo': 'COD',
            'cape verde': 'CPV',
            'falkland islands': 'FLK',
            'federated states of micronesia': 'FSM',
            'the gambia': 'GMB',
            'ivory coast': 'CIV',
            'north korea': 'PRK',
            'south korea': 'KOR',
            'macedonia': 'MKD',
            'netherlands antilles': 'ANT',
            'pitcairn islands': 'PCN',
            'spratly islands': 'Spratly Islands',
            'russia': 'RUS',
            'saint helena': 'SHN',
            'st. lucia': 'LCA',
            'east timor': 'TLS',
            'taiwan': 'TWN',
            'tanzania': 'TZA',
            'united kingdom': 'GBR',
            'united states': 'USA',
            'venezuela': 'VEN',
            'british virgin islands': 'VGB',
            'us virgin islands': 'VIR',
            'vatican city': 'VAT',
            'palestinian occupied territories': 'PSE',
            'saint-barthélémy': 'BLM',
            'saint-martin': 'MAF',
            'vietnam': 'VNM',
            'the united states': 'USA',
            'the isle of man': 'IMN',
            'moldova': 'MDA',
            'democratic republic of the congo': 'COD',
            'the central african republic': 'CAF',
            'bangeladesh': 'BGD',
            'iran': 'IRN'
        };
        let out = inputCountry;
        if (inputCountry.length === 3) {
            return country;
        } else if (inputCountry.length === 2) {
            listOfCountries.forEach((row) => {
                if (row['alpha-2'].toLowerCase() === inputCountry) {
                    out = row['alpha-3'];
                    return out;
                }
            });
        } else {
            if (predefined[inputCountry]) {
                out = predefined[inputCountry];
                return out;
            } else {
                listOfCountries.forEach((row) => {
                    if (row['name'].toLowerCase() === inputCountry) {
                        out = row['alpha-3'];
                        return out;
                    }
                });
            }
        }
        return out;
    },
    ISOtoCountryName(country) {
        let out = country;
        if (country.length === 3) {
            listOfCountries.forEach((row) => {
                if (row['alpha-3'] === country) {
                    out = row['name'];
                    return out;
                }
            });
        } else if (country.length === 2) {
            listOfCountries.forEach((row) => {
                if (row['alpha-2'] === country) {
                    out = row['name'];
                    return out;
                }
            });
        } else {
            return out;
        }
        return out;
    }
}
