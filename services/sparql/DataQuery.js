'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class DataQuery{
    constructor() {
        /*jshint multistr: true */
        this.prefixes='\
        PREFIX risis: <http://risis.eu/> \
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
        PREFIX owl: <http://www.w3.org/2002/07/owl#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX pav: <http://purl.org/pav/> \
        PREFIX wv: <http://vocab.org/waiver/terms/norms> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
        PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
        PREFIX vaem: <http://www.linkedmodel.org/schema/vaem#>  \
         ';
        this.query='';
    }
    //-----------RISIS------------
    getDatasetsList(graph) {
      /*jshint multistr: true */
        this.query = '\
      SELECT DISTINCT ?dataset ?metadata ?title ?description WHERE { \
        { \
          GRAPH <'+graph+'>  { \
            ?dataset a void:Dataset. \
            OPTIONAL { \
                ?dataset vaem:hasMetadata ?metadata .  \
                GRAPH ?metadata { \
                    ?subject a void:Dataset ; dcterms:title ?title ; dcterms:description ?description . \
                } \
            } \
          } \
        } \
      } ORDER BY ASC(?title) \
      ';
        return this.prefixes + this.query;
    }
    getDatasetEntityTypes(graph, entityType) {
        let ext ='';
        if(entityType){
            ext = `?s a <${entityType}> .`;
        }
        this.query = `
      SELECT DISTINCT ?entityType (COUNT(DISTINCT ?s) AS ?total) WHERE {
        {
          GRAPH <${graph}>  {
            ?s a ?entityType .
            ${ext}
          }
        }
      } ORDER BY ASC(?total)
      `;
        return this.prefixes + this.query;
    }
    getDatasetEntities(graph, entityTypeURI , offset, limit) {
        this.query = `
      SELECT DISTINCT ?entity ?property ?object WHERE {
        GRAPH <${graph}> {
              ?entity ?property ?object .
            {
                SELECT DISTINCT ?entity WHERE {
                    GRAPH <${graph}> {
                        ?entity a <${entityTypeURI}>  .
                    }
                }
                LIMIT ${limit} OFFSET ${offset}
            }
        }
    } ORDER BY ?entity
      `;
        return this.prefixes + this.query;
    }
    getDatasetEntity(graph, entityURI) {
      /*jshint multistr: true */
        this.query = '\
      SELECT DISTINCT ?property ?object WHERE { \
        { \
          GRAPH <'+graph+'>  { \
            <'+entityURI+'> ?property ?object . \
          } \
        } \
    } ORDER BY ASC(?property) \
      ';
        return this.prefixes + this.query;
    }

}
export default DataQuery;
