import {BaseStore} from 'fluxible/addons';
class LinksetStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanAll();
    }
    cleanAll() {
        this.dataset = {total: 0, resources: [], details: {}};
    }
    cleanDataset() {
        this.cleanAll();
        this.emitChange();
    }
    updateResourceList(payload) {
        this.dataset = {
            graphName: payload.graphName,
            datasetURI: payload.datasetURI,
            resources: payload.resources,
            source: payload.source,
            target: payload.target,
            page: payload.page,
            config: payload.config,
            total: this.dataset.total,
            details: {}
        };
        this.emitChange();
    }
    updateDatasetTotal(payload) {
        this.dataset.total = payload.total;
        this.emitChange();
    }
    updateLinksetDetails(payload) {
        this.dataset.details = payload.details;
        this.emitChange();
    }
    getState() {
        return {
            dataset: this.dataset
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.dataset = state.dataset;
    }
}

LinksetStore.storeName = 'LinksetStore'; // PR open in dispatchr to remove this need
LinksetStore.handlers = {
    'LOAD_LINKSET_SUCCESS': 'updateResourceList',
    'UPDATE_LINKSET_TOTAL_SUCCESS': 'updateDatasetTotal',
    'UPDATE_LINKSET_DETAILS_SUCCESS': 'updateLinksetDetails',
    'CLEAN_LINKSET_SUCCESS': 'cleanDataset'
};

export default LinksetStore;
