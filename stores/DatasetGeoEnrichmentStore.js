import {BaseStore} from 'fluxible/addons';

class DatasetGeoEnrichmentStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.stats = {annotated: 0, total: 0};
        this.currentText = '';
        this.formattedText = '';
        this.geometry = '';
        this.currentID = '';
        this.tags = {};
    }
    updateStatsEnriched(payload) {
        this.stats.annotated = payload.annotated;
        this.emitChange();
    }
    updateStatsTotal(payload) {
        this.stats.total = payload.total;
        this.emitChange();
    }
    updateBoundaries(payload) {
        this.currentText = payload.query;
        this.currentID = payload.id;
        let preURI = '';
        if(payload.enrichment && payload.enrichment.location){
            this.formattedText = payload.enrichment.location.formattedAddress;
            this.geometry = 'POINT(' +payload.enrichment.location.longitude +' ' + payload.enrichment.location.latitude + ')';
            if(payload.enrichment.boundarySource.toLowerCase() === 'gadm'){
                preURI = '/dataset/'+encodeURIComponent('http://geo.risis.eu/gadm')+'/resource/'+encodeURIComponent('http://geo.risis.eu/gadm/');
            }else if(payload.enrichment.boundarySource.toLowerCase() === 'osm'){
                preURI = '/dataset/'+encodeURIComponent('http://geo.risis.eu/osm')+'/resource/'+encodeURIComponent('http://geo.risis.eu/osm/');
            }else if(payload.enrichment.boundarySource.toLowerCase() === 'flickr'){
                preURI = '/dataset/'+encodeURIComponent('http://geo.risis.eu/flickr')+'/resource/'+encodeURIComponent('http://geo.risis.eu/flickr/');
            }
            payload.enrichment.boundaries.forEach((tag)=>{
                if(this.tags[tag.id]){
                    this.tags[tag.id].count++;
                }else{
                    this.tags[tag.id]={count: 1, text: tag.title+', ' + tag.country, level: tag.level, uri: preURI+tag.id};
                }
            });
        }else{
            this.formattedText = '';
            this.geometry = '';
        }
        this.emitChange();
    }
    getState() {
        return {
            stats: this.stats,
            currentText: this.currentText,
            currentID: this.currentID,
            formattedText: this.formattedText,
            geometry: this.geometry,
            tags: this.tags
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.stats = state.stats;
        this.currentText = state.currentText;
        this.currentID = state.currentID;
        this.tags = state.tags;
        this.formattedText = state.formattedText;
        this.geometry = state.geometry;
    }
}

DatasetGeoEnrichmentStore.storeName = 'DatasetGeoEnrichmentStore'; // PR open in dispatchr to remove this need
DatasetGeoEnrichmentStore.handlers = {
    'UPDATE_GEOENRICHED_STAT': 'updateStatsEnriched',
    'UPDATE_ANNOTATION_STAT_TOTAL': 'updateStatsTotal',
    'UPDATE_GEO_BOUNDARIES': 'updateBoundaries'
};

export default DatasetGeoEnrichmentStore;
