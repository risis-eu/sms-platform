'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class DatasetQuery{
    constructor() {
        this.prefixes=`
        PREFIX risis: <http://risis.eu/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX void: <http://rdfs.org/ns/void#>
        PREFIX pav: <http://purl.org/pav/>
        PREFIX wv: <http://vocab.org/waiver/terms/norms>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#>
        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
        `;
        this.query='';
    }
    //-----------RISIS------------
    getDatasetsMetadataList() {
        this.query = `
        SELECT DISTINCT ?dataset ?resource ?title WHERE {
          {
            GRAPH risisVoid:  {
              risisVoid:risis_rdf_dataset void:subset ?dataset .
            }
            GRAPH ?dataset {?resource a void:Dataset ; dcterms:title ?title .}
          }
        } ORDER BY ASC(?title)
        `;
        return this.prefixes + this.query;
    }
    //--------------------------------
    prepareGraphName(graphName){
        let gStart = 'GRAPH <'+ graphName +'> { ';
        let gEnd = ' } ';
        if(!graphName || graphName === 'default'){
            gStart =' ';
            gEnd = ' ';
        }
        return {gStart: gStart, gEnd: gEnd}
    }
    filterPropertyPath(propertyURI){
        if(propertyURI.indexOf('->')!== -1){
            let tmp2 =[], tmp = propertyURI.split('->');
            tmp.forEach((el)=> {
                tmp2.push('<'+el.trim()+'>');
            });
            return tmp2.join('/');
        }else{
            return '<'+ propertyURI + '>';
        }
    }
    addDataTypeToFilter(el){
        let oval = '';
        if(el.indexOf('[dt]') === -1){
            //no data type is set
            oval = (el.indexOf('http:\/\/') === -1 && el.indexOf('https:\/\/') === -1) ? '"""' +el + '"""' : '<'+el+'>';
        }else{
            //add data type to query to literal value
            let tmp = el.split('[dt]');
            oval = '"""' +tmp[0] + '"""^^<'+tmp[1]+'>'
        }
        return oval;
    }
    makeExtraTypeFilters(endpointParameters, rconfig){
        let self = this;
        let type = rconfig.resourceFocusType;
        //---to support resource focus types
        let st_extra = ' ?resource rdf:type <'+ type + '> .';
        //will get all the types
        if(!type || !type.length || (type.length && !type[0]) ){
            st_extra = '?resource a ?type .';
        }
        //if we have multiple type, get all of them
        let tmp2, typeURIs = [];
        if(type && type.length > 1){
            type.forEach(function(uri) {
                typeURIs.push('<' + uri + '>');
            });
            if(endpointParameters.type === 'stardog' || endpointParameters.type === 'sesame'){
                ///---for sesame
                tmp2 = [];
                typeURIs.forEach(function(fl){
                    tmp2.push('?type=' + fl);
                });
                st_extra = ' ?resource rdf:type ?type . FILTER (' + tmp2.join(' || ') + ')';
                //---------------
            }else{
                //---for virtuoso
                st_extra = ' ?resource rdf:type ?type . FILTER (?type IN (' + typeURIs.join(',') + '))';
            }
        }
        //-----------------------------------------------
        //handle pre constraints for a dataset
        let constraint;
        if(rconfig.constraint){
            constraint = rconfig.constraint;
        }
        let constraintPhrase = '';
        let oval = '';
        let pi = 0;
        if(constraint){
            for(let prop in constraint){
                pi++;
                if(constraint[prop].length>1){
                    let parts1 = ' ?resource ' + self.filterPropertyPath(prop) + ' ?cp' + pi +' . ';
                    let parts2 = [];
                    constraint[prop].forEach((el, index)=>{
                        oval = self.addDataTypeToFilter(el);
                        parts2.push('?cp' + pi + '=' + oval);
                    });
                    constraintPhrase = constraintPhrase + parts1 +  ' FILTER( ' + parts2.join(' || ') + ' ) ' ;
                }else{
                    oval = self.addDataTypeToFilter(constraint[prop][0]);
                    constraintPhrase = constraintPhrase + ' ?resource ' + self.filterPropertyPath(prop) + ' '+ oval + ' . ' ;
                }
            }
            st_extra = constraintPhrase + st_extra;
        }
        return st_extra;
    }
    countResourcesByType(endpointParameters, graphName, rconfig) {
        let self = this;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let st = this.makeExtraTypeFilters(endpointParameters, rconfig);
        //go to default graph if no graph name is given
        this.query = `
        SELECT (count(?resource) AS ?total) WHERE {
            ${gStart}
                ${st}
            ${gEnd}
        }
        `;
        return this.prefixes + this.query;
    }
    countLinks(endpointParameters, graphName) {
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        this.query = `
        SELECT (count(?source) AS ?total) WHERE {
            ${gStart}
                ?source owl:sameAs ?target .
            ${gEnd}
        }
        `;
        return this.prefixes + this.query;
    }
    getLinkset(endpointParameters, graphName, source, target, rconfig, limit, offset) {
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        this.query = `
        SELECT DISTINCT ?source ?target  WHERE {
            ${gStart}
                ?source owl:sameAs ?target .
            ${gEnd}
        }
        LIMIT ${limit} OFFSET ${offset}
        `;
        return this.prefixes + this.query;
    }
    getLinksetDetails(endpointParameters, source, target, entities) {
        let sourceSt ='';
        let targetSt ='';
        let sources = [];
        let targets = [];
        entities.forEach((entity, index)=> {
            sources.push('?s = <' + entity.s + '>');
            targets.push('?t = <' + entity.t + '>');
        })
        sourceSt = 'FILTER ('+ sources.join(' || ') +')';
        targetSt = 'FILTER ('+ targets.join(' || ') +')';
        this.query = `
        SELECT DISTINCT ?s ?sprop ?sobj ?t ?tprop ?tobj WHERE {
            {
                GRAPH <${source}> {
                    ?s ?sprop ?sobj .
                    FILTER (?sprop != geo:geometry)
                    ${sourceSt}

                }
            }
            UNION
            {
                GRAPH <${target}> {
                    ?t ?tprop ?tobj .
                    FILTER (?tprop != geo:geometry)
                    ${targetSt}
                }
            }
        }
        `;
        return this.prefixes + this.query;
    }
    getResourcesByType(endpointParameters, graphName, searchTerm, rconfig, limit, offset) {
        let self = this;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let resourceLabelProperty, resourceImageProperty, resourceGeoProperty;
        if(rconfig.resourceLabelProperty){
            resourceLabelProperty = rconfig.resourceLabelProperty;
        }
        if(rconfig.resourceImageProperty){
            resourceImageProperty = rconfig.resourceImageProperty;
        }
        if(rconfig.resourceGeoProperty){
            resourceGeoProperty = rconfig.resourceGeoProperty;
        }
        let selectSt = '';
        //specify the right label for resources
        let optPhase = 'OPTIONAL { ?resource dcterms:title ?title .} ';
        let searchPhase='';
        if(searchTerm && searchTerm.length>2){
            if(searchTerm === 'ldr_showAll'){
                searchPhase =' ';
            }else{
                searchPhase = 'FILTER( regex(?title, "'+searchTerm+'", "i") || regex(?label, "'+searchTerm+'", "i") || regex(STR(?resource), "'+searchTerm+'", "i"))';
            }
        }
        let bindPhase = '';
        if(resourceLabelProperty && resourceLabelProperty.length){
            if(resourceLabelProperty.length === 1){
                optPhase = 'OPTIONAL { ?resource ' + self.filterPropertyPath(resourceLabelProperty[0]) + ' ?title .} ';
            }else {
                optPhase = '';
                let tmpA = [];
                resourceLabelProperty.forEach(function(prop, index) {
                    optPhase = optPhase + 'OPTIONAL { ?resource ' + self.filterPropertyPath(prop) + ' ?vp'+index+' .} ';
                    tmpA.push('?vp' + index);
                });
                bindPhase = ' BIND(CONCAT('+tmpA.join(',"-",')+') AS ?title) '
            }
        }
        if(resourceImageProperty && resourceImageProperty.length){
            optPhase = optPhase + ' OPTIONAL { ?resource ' + self.filterPropertyPath(resourceImageProperty[0]) + ' ?image .} ';
            selectSt = selectSt + ' ?image';
        }
        if(resourceGeoProperty && resourceGeoProperty.length){
            optPhase = optPhase + ' OPTIONAL { ?resource ' + self.filterPropertyPath(resourceGeoProperty[0]) + ' ?geo .} ';
            selectSt = selectSt + ' ?geo';
        }
        let st = this.makeExtraTypeFilters(endpointParameters, rconfig);
        let limitOffsetPharse =`LIMIT ${limit} OFFSET ${offset}`;
        if(searchPhase){
            limitOffsetPharse = '';
        }
        this.query = `
        SELECT DISTINCT ?resource ?title ?label ${selectSt} WHERE {
            ${gStart}
                {
                    SELECT DISTINCT ?resource  WHERE {
                        ${gStart}
                            ${st}
                        ${gEnd}
                    }
                    ${limitOffsetPharse}
                }
                OPTIONAL { ?resource rdfs:label ?label .}
                OPTIONAL { FILTER langMatches( lang(?label), "EN" )}
                ${optPhase}
                ${bindPhase}
                ${searchPhase}
            ${gEnd}

        }
        `;
        return this.prefixes + this.query;
    }
    //only gives us unannotated ones
    getResourcePropForAnnotation(endpointParameters, graphName, rconfig, resourceType, propertyURI, limit, offset, inNewDataset, boundarySource, longPropertyURI, latPropertyURI, countryPropertyURI) {
    //todo: does not work if new and original graphs are on different endpoints
        let self = this;
        let type = resourceType ? [resourceType] : rconfig.resourceFocusType;
        let rconfig2 = {};
        rconfig2 = rconfig;
        rconfig2.resourceFocusType = type;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let st = this.makeExtraTypeFilters(endpointParameters, rconfig2);
        let existingCoordsStQ = ` ?resource ${self.filterPropertyPath(propertyURI)} ?objectValue . `;
        let existingCoordsStS = ' ?objectValue ';
        if(longPropertyURI && latPropertyURI){
            let countrySt = '';
            if(countryPropertyURI){
                countrySt = `
                    ?resource ${self.filterPropertyPath(countryPropertyURI)} ?country .
                `;
                existingCoordsStS = ' ?longitude ?latitude ?country ';
            }else{
                existingCoordsStS = ' ?longitude ?latitude ';
            }
            existingCoordsStQ = `
                ?resource ${self.filterPropertyPath(longPropertyURI)} ?longitude .
                ?resource ${self.filterPropertyPath(latPropertyURI)} ?latitude .
                ${countrySt}
            `;
        }
        let notExistFilterSt= `
            ?resource ldr:annotatedBy ?annotationD .
            ?annotationD ldr:property "${propertyURI}" .
        `;
        if(boundarySource){
            notExistFilterSt= `
                ?resource ldr:geoEnrichedBy ?annotationD .
                ?annotationD ldr:boundarySource "${boundarySource}" ; ldr:property "${propertyURI}" .
            `;
        }
        //do not care about already annotated ones if annotations are stored in a new dataset
        if(inNewDataset){
            this.query = `
            SELECT DISTINCT ?resource ${existingCoordsStS} WHERE {
                {
                        {
                            SELECT DISTINCT ?resource ${existingCoordsStS} WHERE {
                                    ${gStart}
                                        ${st}
                                        ${existingCoordsStQ}
                                    ${gEnd}
                                    GRAPH <${inNewDataset}> {
                                        filter not exists {
                                            ${notExistFilterSt}
                                        }
                                    }
                            } LIMIT ${limit}
                        }
                }
            }
            `;
        }else{
            this.query = `
            SELECT DISTINCT ?resource ${existingCoordsStS} WHERE {
                ${gStart}
                    ${st}
                    ${existingCoordsStQ}
                    filter not exists {
                        ${notExistFilterSt}
                    }
                ${gEnd}
            }
            LIMIT ${limit}
            `;
        }
        //console.log(this.prefixes + this.query);
        return this.prefixes + this.query;
    }
    /* just for the record: to get both stats at the same time
    this.query = `
    SELECT DISTINCT ?atotal ?total WHERE {
        {
            SELECT (count(DISTINCT ?resource) AS ?atotal) WHERE {
                ${gStart}
                    ${st}
                    ?resource ldr:annotations ?annotation .
                    ?annotation ldr:property <${propertyURI}> .
                ${gEnd}
            }
        }
        {
            SELECT (count(DISTINCT ?resource) AS ?total) WHERE {
                ${gStart}
                    ${st}
                    ?resource <${propertyURI}> ?objectValue .
                ${gEnd}
            }
        }
    }
    `;
    */
    countTotalResourcesWithProp(endpointParameters, graphName, rconfig, resourceType, propertyURI, inNewDataset) {
        let self = this;
        let type = resourceType ? [resourceType] : rconfig.resourceFocusType;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let rconfig2 = {};
        rconfig2 = rconfig;
        rconfig2.resourceFocusType = type;
        let st = this.makeExtraTypeFilters(endpointParameters, rconfig2);
        //in case of storing a new dataset, ignore the type
        if(inNewDataset){
            st = '';
        }
        this.query = `
        SELECT (count(DISTINCT ?resource) AS ?total) WHERE {
            ${gStart}
                ${st}
                ?resource ${self.filterPropertyPath(propertyURI)} ?objectValue .
            ${gEnd}
        }
        `;
        return this.prefixes + this.query;
    }
    countAnnotatedResourcesWithProp(endpointParameters, graphName, rconfig, resourceType, propertyURI, inNewDataset) {
        let self = this;
        let type = resourceType ? [resourceType] : rconfig.resourceFocusType;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let rconfig2 = {};
        rconfig2 = rconfig;
        rconfig2.resourceFocusType = type;
        let st = this.makeExtraTypeFilters(endpointParameters, rconfig2);
        //in case of storing a new dataset, ignore the type
        if(inNewDataset){
            st = '';
        }
        this.query = `
        SELECT (count(DISTINCT ?resource) AS ?atotal) WHERE {
            ${gStart}
                ${st}
                ?resource ldr:annotatedBy ?annotationD .
                ?annotationD ldr:property "${propertyURI}" .
            ${gEnd}
        }
        `;
        return this.prefixes + this.query;
    }
    countGeoEnrichedResourcesWithProp(endpointParameters, graphName, type, propertyURI, inNewDataset, boundarySource) {
        let self = this;
        let {gStart, gEnd} = this.prepareGraphName(graphName);
        let st = '?resource a <'+ type + '> .';
        //will get all the types
        if(!type.length || (type.length && !type[0]) ){
            st = '?resource a ?type .';
        }
        //if we have multiple type, get all of them
        let typeURIs = [];
        if(type.length > 1){
            type.forEach(function(uri) {
                typeURIs.push('<' + uri + '>');
            });
            st = '?resource a ?type . FILTER (?type IN (' + typeURIs.join(',') + '))';
        }
        //in case of storing a new dataset, ignore the type
        if(inNewDataset){
            st = '';
        }
        this.query = `
        SELECT (count(DISTINCT ?resource) AS ?atotal) WHERE {
            ${gStart}
                ${st}
                ?resource ldr:geoEnrichedBy ?annotationD .
                ?annotationD ldr:boundarySource "${boundarySource}" ; ldr:property "${propertyURI}" .
            ${gEnd}
        }
        `;
        return this.prefixes + this.query;
    }
}
export default DatasetQuery;
