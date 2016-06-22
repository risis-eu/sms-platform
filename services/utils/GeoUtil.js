'use strict';
import {convertToISO3, ISOtoCountryName} from '../utils/helpers';

class GeoUtil{
    constructor() {

    }
    getPropertyLabel(uri) {
        let property = '';
        let tmp = uri;
        let tmp2 = tmp.split('#');
        if(tmp2.length > 1){
            property = tmp2[1];
        }else{
            tmp2 = tmp.split('/');
            property = tmp2[tmp2.length - 1];
        }
        return property;
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
        return output;
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
        return output;
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
        return output;
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
        return output;
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
        return output;
    }
    parsePointToMunicipality(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({id: el.municipalityID.value, name: el.name.value, country: el.country.value});
            });
            return output;
        }
        return output;
    }
    parsePointToGADM28Admin(res, country){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        let cISO = '';
        if(country){
            cISO = convertToISO3(country);
        }
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(country){
                    if(el.country.value === cISO){
                        output.push({id: self.getPropertyLabel(el.uri.value), title: el.title.value, level: el.level.value, country: el.country.value});
                    }
                }else{
                    output.push({id: self.getPropertyLabel(el.uri.value), title: el.title.value, level: el.level.value, country: el.country.value});
                }
            });
            return output;
        }
        return output;
    }
    parsePointToOSMAdmin(res, country){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        let cISO = '';
        if(country){
            cISO = convertToISO3(country);
        }
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(country){
                    if(el.country.value === cISO){
                        output.push({id: el.uri.value.replace('http://geo.risis.eu/osm/', ''), title: el.title.value, level: el.level.value, country: el.country.value});
                    }
                }else{
                    output.push({id: el.uri.value.replace('http://geo.risis.eu/osm/', ''), title: el.title.value, level: el.level.value, country: el.country.value});
                }
            });
            return output;
        }
        return output;
    }
    parsePointToOSMAdminMapIt(res, country){
        let self = this;
        let parsed = JSON.parse(res);
        //console.log(parsed);
        let output=[];
        let cISO = '';
        if(country){
            cISO = convertToISO3(country);
        }
        let tmp;
        for(let prop in parsed){
            tmp = parsed[prop].type_name.split('OSM Administrative Boundary Level ');
            if(tmp.length > 1){
                output.push({id: 'relation_'+parsed[prop].codes.osm_rel, title: parsed[prop].name, level: tmp[1], country: cISO});
            }
        }
        return output;
    }
    parsePointToFlickrAdmin(res, country){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        let cISO = '';
        if(country){
            cISO = convertToISO3(country);
        }
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(country){
                    if(el.country.value === cISO){
                        output.push({id: el.uri.value.replace('http://geo.risis.eu/flickr/', ''), title: el.title.value, level: el.level.value, country: el.country.value});
                    }
                }else{
                    output.push({id: el.uri.value.replace('http://geo.risis.eu/flickr/', ''), title: el.title.value, level: el.level.value, country: el.country.value});
                }
            });
            return output;
        }
        return output;
    }
    parsePointToOECDFUA(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({id: el.uri.value.replace('http://geo.risis.eu/oecd/fua/', ''), title: el.title.value, country: el.country.value});
            });
            return output;
        }
        return output;
    }
    parseMunicipalityToPolygon(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({name: el.name.value, polygon: el.polygon.value});
            });
            return output;
        }
        return output;
    }
    parseGADM28AdminToPolygon(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({name: el.name.value, polygon: el.polygon.value});
            });
            return output;
        }
        return output;
    }
    parseGADM28Admin(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output={};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(el.property.value.indexOf('parent') === -1){
                    output[self.getPropertyLabel(el.property.value)] =  el.value.value;
                }else{
                    output[self.getPropertyLabel(el.property.value) + '_ID'] =  self.getPropertyLabel(el.value.value);
                }
            });
            return output;
        }
        return output;
    }
    parseOSMAdmin(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output={};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output[self.getPropertyLabel(el.property.value)] =  el.value.value;
            });
            return output;
        }
        return output;
    }
    parseFlickrAdmin(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output={};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output[self.getPropertyLabel(el.property.value)] =  el.value.value;
            });
            return output;
        }
        return output;
    }
    parseOECDFUA(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output={};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output[self.getPropertyLabel(el.property.value)] =  el.value.value;
            });
            return output;
        }
        return output;
    }
    parseOECDFUAList(res, country){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            if(country){
                parsed.results.bindings.forEach(function(el) {
                    output.push({'id': self.getPropertyLabel(el.uri.value), 'title': el.title.value});
                });
            }else{
                parsed.results.bindings.forEach(function(el) {
                    output.push({'country': el.country ? el.country.value :'','id': self.getPropertyLabel(el.uri.value), 'title': el.title.value});
                });
            }
            return output;
        }
        return output;
    }
    parseAdminsByLevel(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({'id': self.getPropertyLabel(el.uri.value), 'title': el.title.value});
            });
            return output;
        }
        return output;
    }
    parseOSMAdminMetadata(res){
        let self = this;
        let parsed = JSON.parse(res);
        let output={};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output[self.getPropertyLabel(el.level.value)] = el.levelDesc.value;
            });
            return output;
        }
        return output;
    }
    parseOSMAdminToPolygon(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({name: el.name.value, polygon: el.polygon.value});
            });
            return output;
        }
        return output;
    }
    parseFlickrAdminToPolygon(res){
        let parsed = JSON.parse(res);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({name: el.name.value, polygon: el.polygon.value});
            });
            return output;
        }
        return output;
    }
}
export default GeoUtil;
