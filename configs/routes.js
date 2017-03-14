import loadDatasets from '../actions/loadDatasets';
import loadDataset from '../actions/loadDataset';
import loadDatasetsMetadataList from '../actions/loadDatasetsMetadataList';
import loadLinkset from '../actions/loadLinkset';
import loadResource from '../actions/loadResource';
import loadUsersList from '../actions/loadUsersList';
import loadFacets from '../actions/loadFacets';
import {appFullTitle, appShortTitle, authDatasetURI, baseResourceDomain} from '../configs/general';

export default {
    home: {
        path: '/',
        method: 'get',
        handler: require('../components/Home'),
        label: appShortTitle,
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Home'});
            done();
        }
    },
    about: {
        path: '/about',
        method: 'get',
        handler: require('../components/About'),
        label: 'About',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | About'});
            done();
        }
    },
    contact: {
        path: '/contact',
        method: 'get',
        handler: require('../components/Contact'),
        label: 'Contact Us',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Contact Us'});
            done();
        }
    },
    dataIngestion: {
        path: '/dataIngestion',
        method: 'get',
        handler: require('../components/DataIngestion'),
        label: 'Data Ingestion',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Data Ingestion, Conversion & Linking'});
            done();
        }
    },
    conceptualModel: {
        path: '/conceptualModel',
        method: 'get',
        handler: require('../components/conceptualModel'),
        label: 'Conceptual Model',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Conceptual Model & Technical Architecture'});
            done();
        }
    },
    ldServices: {
        path: '/ldServices',
        method: 'get',
        handler: require('../components/ldServices'),
        label: 'Linked Data Services',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Linked Data Services & Applications'});
            done();
        }
    },
    usecases: {
        path: '/usecases',
        method: 'get',
        handler: require('../components/usecases'),
        label: 'Use Cases',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Use Cases'});
            done();
        }
    },
    usecase1: {
        path: '/usecase1',
        method: 'get',
        handler: require('../components/usecase1'),
        label: 'Use Case 1',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Use Case 1'});
            done();
        }
    },
    usecase2: {
        path: '/usecase2',
        method: 'get',
        handler: require('../components/usecase2'),
        label: 'Use Case 2',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Use Case 2'});
            done();
        }
    },
    usecase3: {
        path: '/usecase3',
        method: 'get',
        handler: require('../components/usecase3'),
        label: 'Use Case 3',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Use Case 3'});
            done();
        }
    },
    usecase4: {
        path: '/usecase4',
        method: 'get',
        handler: require('../components/usecase4'),
        label: 'Use Case 4',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Use Case 4'});
            done();
        }
    },
    newDataset: {
        path: '/newDataset',
        method: 'get',
        handler: require('../components/NewDataset'),
        label: 'NewDataset',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Add a new dataset'});
            done();
        }
    },
    annotateDataset: {
        path: '/annotateDataset',
        method: 'get',
        handler: require('../components/DatasetAnnotation'),
        label: 'DatasetAnnotation',
        action: (context, payload, done) => {
            context.executeAction(loadDatasets, {pageTitle: 'Annotate a dataset'}, done);
        }
    },
    geoEnrichDataset: {
        path: '/geoEnrichDataset',
        method: 'get',
        handler: require('../components/DatasetGeoEnrichment'),
        label: 'DatasetGeoEnrichment',
        action: (context, payload, done) => {
            context.executeAction(loadDatasets, {pageTitle: 'Geo-enrich a dataset'}, done);
        }
    },
    facets: {
        path: '/browse/:id?',
        method: 'get',
        handler: require('../components/dataset/FacetedBrowser'),
        label: 'Faceted Browser',
        action: (context, payload, done) => {
            let datasetURI, page;
            datasetURI = payload.params.id;
            if (!datasetURI) {
                datasetURI = 0;
            }
            context.executeAction(loadFacets, {mode: 'init', id: decodeURIComponent(datasetURI), selection: 0, page: 1}, done);
        }
    },
    metadataList: {
        path: '/metadataList',
        method: 'get',
        handler: require('../components/reactors/DatasetReactor'),
        label: 'Datasets Metadata',
        action: (context, payload, done) => {
            context.executeAction(loadDatasetsMetadataList, {}, done);
        }
    },
    datasets: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: '/datasets',
        method: 'get',
        handler: require('../components/Datasets'),
        label: 'Datasets',
        action: (context, payload, done) => {
            context.executeAction(loadDatasets, {}, done);
        }
    },
    dataset: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: '/dataset/:page?/:id?',
        method: 'get',
        handler: require('../components/reactors/DatasetReactor'),
        label: 'Dataset',
        action: (context, payload, done) => {
            let datasetURI, page;
            datasetURI = decodeURIComponent(payload.params.id);
            if (!datasetURI) {
                datasetURI = 0;
            }
            page = payload.params.page;
            if (!page) {
                page = 1;
            }
            //do not allow to browse user graph
            if(datasetURI===authDatasetURI[0]){
                datasetURI = 0
            }
            context.executeAction(loadDataset, { id: datasetURI, page: page}, done);
        }
    },
    linkset: {
        //if no id is provided -> will start by defaultDatasetURI in reactor.config
        path: '/linkset/:page?/:id/source/:source/target/:target',
        method: 'get',
        handler: require('../components/dataset/Linkset'),
        label: 'Linkset',
        action: (context, payload, done) => {
            let datasetURI, source, target, page;
            datasetURI = decodeURIComponent(payload.params.id);
            source = decodeURIComponent(payload.params.source);
            target = decodeURIComponent(payload.params.target);
            page = payload.params.page;
            if (!page) {
                page = 1;
            }
            context.executeAction(loadLinkset, { id: datasetURI, source: source, target: target, page: page}, done);
        }
    },
    resource: {
        path: '/dataset/:did/:resource/:rid/:pcategory?/:propertyPath?',
        method: 'get',
        handler: require('../components/reactors/ResourceReactor'),
        label: 'Resource',
        action: (context, payload, done) => {
            //predicate Category
            let category = payload.params.pcategory;
            if(!category){
                category = 0;
            }
            let propertyPath = payload.params.propertyPath;
            if(!propertyPath){
                propertyPath = [];
            }
            let datasetURI = payload.params.did;
            if (!datasetURI) {
                datasetURI = 0;
            }
            context.executeAction(loadResource, { dataset: decodeURIComponent(datasetURI), resource: decodeURIComponent(payload.params.rid), category: category, propertyPath: propertyPath}, done);
        }
    },
    user: {
        path: '/user/:id',
        method: 'get',
        handler: require('../components/reactors/ResourceReactor'),
        label: 'User',
        action: (context, payload, done) => {
            let category = 0;
            context.executeAction(loadResource, { dataset: authDatasetURI[0], resource: baseResourceDomain + '/user/' + decodeURIComponent(payload.params.id), category: category}, done);
        }
    },
    users: {
        path: '/users',
        method: 'get',
        handler: require('../components/admin/UsersList'),
        label: 'Users List',
        action: (context, payload, done) => {
            context.executeAction(loadUsersList, {}, done);
        }
    },
    demos: {
        path: '/demos',
        method: 'get',
        handler: require('../components/Demos'),
        label: 'Demos',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: appFullTitle + ' | Demos'
            });
            done();
        }
    },
    boundariesMap: {
        path: '/boundariesMap',
        method: 'get',
        handler: require('../components/BoundariesMap'),
        label: 'boundariesMap',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: appFullTitle + ' | Example Boundaries Map'
            });
            done();
        }
    },
};
