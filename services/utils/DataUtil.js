'use strict';
class DataUtil{
    parseDatasetsList(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({URI: el.dataset.value, title: el.title ? el.title.value : '', description: el.description ? el.description.value : '', metadataURI: el.metadata ? el.metadata.value : '', entityTypesAPIPath: '/data.dataset.entityTypes?datasetURI='+encodeURIComponent(el.dataset.value)});
            });
            return output;
        }
        return output;
    }
    parseDatasetEntityTypes(datasetURI, body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({URI: el.entityType.value, count: el.total.value, entitiesAPIPath: '/data.dataset.entities?datasetURI='+encodeURIComponent(datasetURI)+'&entityTypeURI='+encodeURIComponent(el.entityType.value)});
            });
            return output;
        }
        return output;
    }
    parseDatasetEntities(datasetURI, entityTypeURI, body, filters) {
        let filertObj={};
        if(filters){
            filertObj =JSON.parse(filters);
        }
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(filertObj.accept && filertObj.accept.length){
                    if(filertObj.accept.indexOf(el.property.value) !== -1){
                        output.push({URI: el.entity.value, property: el.property.value, value: el.object.value , entityAPIPath: '/data.dataset.entity?datasetURI='+encodeURIComponent(datasetURI)+'&entityURI='+encodeURIComponent(el.entity.value)});
                    }
                }else{
                    if(filertObj.ignore && filertObj.ignore.length){
                        if(filertObj.ignore.indexOf(el.property.value) == -1){
                            output.push({URI: el.entity.value, property: el.property.value, value: el.object.value , entityAPIPath: '/data.dataset.entity?datasetURI='+encodeURIComponent(datasetURI)+'&entityURI='+encodeURIComponent(el.entity.value)});
                        }
                    }else{
                        output.push({URI: el.entity.value, property: el.property.value, value: el.object.value , entityAPIPath: '/data.dataset.entity?datasetURI='+encodeURIComponent(datasetURI)+'&entityURI='+encodeURIComponent(el.entity.value)});
                    }

                }

            });
            let finalObj={};
            //group by entity
            output.forEach((e)=>{
                if(finalObj[e.URI]){
                    finalObj[e.URI].properties.push({property: e.property, value: e.value});
                }else{
                    finalObj[e.URI] = {URI: e.URI, entityAPIPath: e.entityAPIPath, properties: []};
                    finalObj[e.URI].properties = [{property: e.property, value: e.value}]
                }
            })
            return finalObj;
        }
        return output;
    }
    parseDatasetEntity(body) {
        let parsed = JSON.parse(body);
        let output=[];
        let tmpE = {};
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                if(!tmpE[el.property.value]){
                    tmpE[el.property.value] = [el.object.value];
                }else{
                    tmpE[el.property.value].push(el.object.value);
                }
            });
            for(let prop in tmpE){
                output.push({property: prop, value: tmpE[prop]});
            }
            return output;
        }
        return output;
    }

}
export default DataUtil;
