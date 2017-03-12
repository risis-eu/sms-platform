'use strict';
import {checkEditAccess} from './accessManagement';

class DatasetUtil {
    constructor() {

    }
    //to parse metadata which is on different graph names
    parseDatasetsMetadataList(user, body, datasetURI) {
        let output = [];
        let resources = [];
        let accessLevel = {access: false};
        let parsed = JSON.parse(body);
        let counter = 0;
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                if(resources.indexOf(el.resource.value) === -1){
                    resources.push(el.resource.value);
                    if(user){
                        /*
                        if(user.id == el.instances[0].value) {
                            userIsCreator = 1;
                        }*/
                        accessLevel=checkEditAccess(user, el.dataset.value, el.resource.value, 0 , 0);
                    }
                    counter++;
                    output.push({
                        v: el.resource.value,
                        d: el.dataset.value,
                        title: el.title ? el.title.value : '',
                        image: el.image ? el.image.value : '',
                        geo: el.geo ? el.geo.value : '',
                        label: el.label ? el.label.value : '',
                        accessLevel: accessLevel
                    });
                }
            });
        }
        return {resources: output, total: counter};
    }
    getPropertyLabel(uri) {
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
    }
    parseLinkset(user, body, datasetURI) {
        let output = [];
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                output.push({
                    s: el.source.value,
                    t: el.target.value
                });
            });
        }
        return output;
    }
    parseLinksetDetails(body) {
        let output = {};
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                if(el.s && el.s.value){
                    if(!output[el.s.value]){
                        output[el.s.value] = {};
                    }
                    if(!output[el.s.value][el.sprop.value]){
                        output[el.s.value][el.sprop.value] = [];
                    }
                    output[el.s.value][el.sprop.value].push(el.sobj.value);
                }
                if(el.t && el.t.value){
                    if(!output[el.t.value]){
                        output[el.t.value] = {};
                    }
                    if(!output[el.t.value][el.tprop.value]){
                        output[el.t.value][el.tprop.value] = [];
                    }
                    output[el.t.value][el.tprop.value].push(el.tobj.value);
                }
            });
        }
        return output;
    }
    parseResourcesByType(user, body, datasetURI, rconfig) {
        let output = [];
        let resources = [];
        let accessLevel = {access: false};
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                if(resources.indexOf(el.resource.value) === -1){
                    resources.push(el.resource.value);
                    if(user){
                        /*
                        if(user.id == el.instances[0].value) {
                            userIsCreator = 1;
                        }*/
                        accessLevel=checkEditAccess(user, datasetURI, el.resource.value, rconfig.resourceFocusType , 0);
                    }
                    output.push({
                        v: el.resource.value,
                        d: datasetURI,
                        title: el.title ? el.title.value : '',
                        image: el.image ? el.image.value : '',
                        geo: el.geo ? el.geo.value : '',
                        label: el.label ? el.label.value : '',
                        accessLevel: accessLevel
                    });
                }
            });
        }
        return output;
    }
    parseResourcePropForAnnotation(body) {
        let output = [];
        let enrichment = {};
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                enrichment = {formattedAddress: '----'};
                if(el.longitude){
                    if(el.longitude.value){
                        enrichment.longitude = el.longitude.value;
                    }else{
                        //to handle resources which do not have this value
                        enrichment.longitude = 'missing';
                    }
                }
                if(el.latitude && el.latitude.value){
                    enrichment.latitude = el.latitude.value;
                }
                if(el.country && el.country.value){
                    enrichment.country = el.country.value;
                }
                output.push({
                    r: el.resource.value,
                    ov: el.objectValue ? el.objectValue.value : '',
                    enrichment: enrichment
                });
            });
        }
        return output;
    }
    parseCountResourcesByType(body) {
        let total = 0;
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            total = parsed.results.bindings[0].total.value;
        }
        return total;
    }
    parseCountTotalResourcesWithProp(body) {
        let total = 0;
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            total = parsed.results.bindings[0].total.value;
        }
        return total;
    }
    parseCountAnnotatedResourcesWithProp(body) {
        let annotated = 0;
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            annotated = parsed.results.bindings[0].atotal.value;
        }
        return annotated;
    }
}
export default DatasetUtil;
