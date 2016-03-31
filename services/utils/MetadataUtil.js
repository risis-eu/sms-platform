'use strict';
class MetadataUtil{
    constructor() {

    }
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
                output.push({title: el.title.value, name: name, URL: 'http://datasets.risis.eu/metadata/' + name, resourceURI: el.subject.value, resourceGraphName: 'http://rdf.risis.eu/dataset/'+name+'/1.0/void.ttl#'});
            });
            return output;
        }
    }
    parseResourceprops(parsed) {
        let output=[];
        parsed.props.forEach(function(el) {
            output.push({uri: el.propertyURI, name: el.property, category: el.config.category, label: el.config.label, hint: el.config.hint, values: el.instances});
        });
        return output;
    }
}
export default MetadataUtil;
