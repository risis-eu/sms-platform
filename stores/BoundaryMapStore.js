import {BaseStore} from 'fluxible/addons';

class BoundaryMapStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.boundaries = {};
    }
    handleBoundaries(payload) {
        if(payload.property){
            this.boundaries[payload.property] = payload.boundaries;
        }
        this.emitChange();
    }
    cleanMap() {
        this.boundaries = {};
    }
    getState() {
        return {
            boundaries: this.boundaries
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.boundaries = state.boundaries;
    }
}

BoundaryMapStore.storeName = 'BoundaryMapStore'; // PR open in dispatchr to remove this need
BoundaryMapStore.handlers = {
    'FIND_BOUNDARIES_SUCCESS': 'handleBoundaries',
    'CLEAN_BOUNDARIES_SUCCESS': 'cleanMap'
};

export default BoundaryMapStore;
