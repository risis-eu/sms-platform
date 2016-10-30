import queryString from 'query-string';
import {sparqlEndpoint, apiTokens} from '../../configs/server';
import {listOfCountries} from '../../data/countries';
import validUrl from 'valid-url';
export default {
    isValidAPIToken(token) {
         if(apiTokens.indexOf(token) === -1){
             return 0;
         }else{
             return 1;
         }
     },
     convertToISO3(country) {
         let inputCountry = country.toLowerCase().trim();
         let predefined = {'aland islands': 'ALA', 'macau': 'MAC', 'the bahamas': 'BHS', 'bolivia': 'BOL', 'brunei': 'BRN', 'democratic republic of congo': 'COD', 'cape verde': 'CPV', 'falkland islands': 'FLK', 'federated states of micronesia': 'FSM', 'the gambia': 'GMB', 'ivory coast': 'CIV', 'north korea': 'PRK', 'south korea': 'KOR', 'macedonia': 'MKD', 'netherlands antilles': 'ANT', 'pitcairn islands': 'PCN', 'spratly islands': 'Spratly Islands', 'russia': 'RUS', 'saint helena': 'SHN', 'st. lucia': 'LCA', 'east timor': 'TLS', 'taiwan': 'TWN', 'tanzania': 'TZA', 'united kingdom': 'GBR', 'united states': 'USA', 'venezuela': 'VEN', 'british virgin islands': 'VGB', 'us virgin islands': 'VIR', 'vatican city': 'VAT', 'palestinian occupied territories': 'PSE', 'saint-barthélémy': 'BLM', 'saint-martin': 'MAF', 'vietnam': 'VNM', 'the united states': 'USA', 'the isle of man': 'IMN', 'moldova': 'MDA', 'democratic republic of the congo': 'COD', 'the central african republic': 'CAF', 'bangeladesh': 'BGD', 'iran': 'IRN'};
         let out = inputCountry;
         if(inputCountry.length === 3){
             return country;
         }else if(inputCountry.length === 2){
             listOfCountries.forEach((row)=>{
                 if(row['alpha-2'].toLowerCase() === inputCountry){
                     out = row['alpha-3'];
                     return out;
                 }
             });
         }else{
             if(predefined[inputCountry]){
                 out = predefined[inputCountry];
                 return out;
             }else{
                 listOfCountries.forEach((row)=>{
                     if(row['name'].toLowerCase() === inputCountry){
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
         if(country.length === 3){
             listOfCountries.forEach((row)=>{
                 if(row['alpha-3'] === country){
                     out = row['name'];
                     return out;
                 }
             });
         }else if(country.length === 2){
             listOfCountries.forEach((row)=>{
                 if(row['alpha-2'] === country){
                     out = row['name'];
                     return out;
                 }
             });
         }else{
             return out;
         }
         return out;
     },
    getHTTPOptions: function(graphName) {
        let httpOptions, g;
        if(sparqlEndpoint[graphName]){
            g = graphName;
        }else{
            //go for generic SPARQL endpoint
            g = 'generic';
        }
        httpOptions = {
          host: sparqlEndpoint[g].host,
          port: sparqlEndpoint[g].port,
          path: sparqlEndpoint[g].path
        };
        return httpOptions;
    },
    getEndpointParameters: function(graphName) {
        let httpOptions, g;
        if(sparqlEndpoint[graphName]){
            g = graphName;
        }else{
            //go for generic SPARQL endpoint
            g = 'generic';
        }
        httpOptions = {
          host: sparqlEndpoint[g].host,
          port: sparqlEndpoint[g].port,
          path: sparqlEndpoint[g].path
        };
        let useDefaultGraph = 0;
        if(sparqlEndpoint[g].useDefaultGraph){
            useDefaultGraph = 1;
        }
        let useReasoning = 0;
        if(sparqlEndpoint[g].useReasoning){
            useReasoning = 1;
        }
        let etype = sparqlEndpoint[g].type ? sparqlEndpoint[g].type : 'virtuoso';
        return {httpOptions: httpOptions, type: etype, useDefaultGraph: useDefaultGraph, useReasoning: useReasoning};
    },
    //build the write URI and params for different SPARQL endpoints
    getHTTPQuery: function(mode, query, endpointParameters, outputFormat) {
        let outputObject = {uri: '', params: {}};

        if(endpointParameters.useReasoning){
            outputObject.params['reasoning'] = 'true';
        }

        switch (endpointParameters.type) {
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
        //todo: check the differences for other triple stores
        case 'sesame':
            if(mode === 'update'){
                ext = '';
                outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path + '/statements';
                outputObject.params['update'] = query;
            }else{
                outputObject.params['query'] = query;
                outputObject.uri = 'http://' + endpointParameters.httpOptions.host + ':' + endpointParameters.httpOptions.port + endpointParameters.httpOptions.path;
                outputObject.params['Accept'] = outputFormat;
            }

            break;
        }
        return outputObject;
    },
    ///builds the HTTP get URL for SPARQL requests
    getHTTPGetURL(object){
        let uri = object.uri + '?' + queryString.stringify(object.params);
        return uri;
    },
    getQueryDataTypeValue(valueType, dataType, objectValue) {
        let newValue, dtype;
        switch (valueType) {
            case 'uri':
            // RISIS case to allow literal values on URI fields
             if(validUrl.is_web_uri(objectValue.toString())){
                 newValue='<'+objectValue+'>';
                 dtype = 'uri';
             }else{
                 newValue='"""'+objectValue+'"""';
                 dtype = 'str';
             }
             break;
            case 'bnode':
              newValue='<'+objectValue+'>';
              dtype = 'uri';
              break;
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
                        //dtype = 'xsd:dateTime';
                        dtype = 'str';
                        //newValue='"'+objectValue+'"^^' + dtype;
                        newValue='"'+objectValue+'"';
                        break;
                    case 'http://www.w3.org/2001/XMLSchema#date':
                        //dtype = 'xsd:date';
                        dtype = 'str';
                        newValue='"'+objectValue+'"';
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
    }
}
