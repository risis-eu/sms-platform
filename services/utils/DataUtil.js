'use strict';
class DataUtil{
    parseDatasetsList(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({URI: el.dataset.value, title: el.title ? el.title.value : '', description: el.description ? el.description.value : '', metadataURI: el.metadata ? el.metadata.value : ''});
            });
            return output;
        }
        return output;
    }
    parseDatasetEntityTypes(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({URI: el.entityType.value, count: el.total.value});
            });
            return output;
        }
        return output;
    }
    parseDatasetEntities(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({URI: el.entity.value});
            });
            return output;
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
