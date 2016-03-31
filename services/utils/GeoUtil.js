'use strict';
class GeoUtil{
    constructor() {

    }
    parsePointToNUTS(res) {
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({uri: el.uri.value, name: el.name.value, level: parseInt(el.level.value), code: el.code.value});
            });
            return output;
        }
    }
    parseNUTStoPolygon(res) {
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({uri: el.uri.value, name: el.name.value, level: parseInt(el.level.value), code: el.code.value, polygon: el.polygon.value});
            });
            return output;
        }
    }
    MunicipalitiesPerCountry(res) {
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({id: el.municipalityID.value, name: el.name.value});
            });
            return output;
        }
    }
    parseNUTStoMunicipality(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({id: el.municipalityID.value, name: el.name.value, isCore: el.isCore.value, funactionalUrbanArea: el.fua.value});
            });
            return output;
        }
    }
    parseNameToMunicipality(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({id: el.municipalityID.value, name: el.name.value, isCore: el.isCore.value, funactionalUrbanArea: {uri: el.fua.value, name: el.fuaName.value, code: el.fuaCode.value, population: el.population.value}});
            });
            return output;
        }
    }
    parseMunicipalityToPolygon(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({osmID: el.osmID.value, polygon: el.polygon.value});
            });
            return output;
        }
    }
}
export default GeoUtil;
