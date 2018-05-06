import {BaseStore} from 'fluxible/addons';

class SearchInAllStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.cleanAll();
    }
    lookupAll(payload) {
        let tmp = {};
        payload.results.forEach((item)=>{
            if(tmp[item.graphName]){
                tmp[item.graphName].push({resource: item.resource, property: item.property, text: item.text});
            }else{
                tmp[item.graphName]=[{resource: item.resource, property: item.property, text: item.text}]
            }

        });
        this.suggestions = tmp;
        this.count = payload.count;
        this.isComplete = 1;
        this.emitChange();
    }
    cleanAll() {
        this.suggestions = {};
        this.isComplete = 1;
        this.count = 0;
    }
    startTask () {
        this.isComplete = 0;
        this.emitChange();
    }
    getState() {
        return {
            suggestions: this.suggestions,
            isComplete: this.isComplete,
            count: this.count
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.suggestions = state.suggestions;
        this.count = state.count;
    }
}

SearchInAllStore.storeName = 'SearchInAllStore'; // PR open in dispatchr to remove this need
SearchInAllStore.handlers = {
    'START_TASK_SEARCHALL': 'startTask',
    'SEARCHALL_SUCCESS': 'lookupAll'
};

export default SearchInAllStore;
