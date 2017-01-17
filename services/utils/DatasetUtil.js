'use strict';
import {checkAccess} from './helpers';

class DatasetUtil {
    constructor() {

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
<<<<<<< HEAD
    parseDatasetsList(body) {
      let parsed = JSON.parse(body);
      let output=[];
      if(parsed.results.bindings.length){
        parsed.results.bindings.forEach(function(el) {
          let tmp=el.subject.value;
          let tmp2=tmp.split('#');
          tmp=tmp2[1];
          tmp2=tmp.split('_rdf_dataset');
          let name=tmp2[0];
          output.push({title: el.title.value, name: name, v: el.subject.value, g: 'http://rdf.risis.eu/dataset/'+name+'/1.0/void.ttl#'});
        });
        return output;
      }
    }
    getResourceFocusType(config){
=======
    parseResourcesByType(user, body, datasetURI) {
>>>>>>> 8801343676a50d998df565eeae18272d36a57af7
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
                        accessLevel=checkAccess(user, datasetURI, el.resource.value, 0);
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
        let parsed = JSON.parse(body);
        if (parsed.results.bindings.length) {
            parsed.results.bindings.forEach(function(el) {
                output.push({
                    r: el.resource.value,
                    ov: el.objectValue ? el.objectValue.value : '',
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
