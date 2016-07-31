import loadDataset from '../actions/loadDataset';
import loadDatasetsList from '../actions/loadDatasetsList';
import loadResource from '../actions/loadResource';
import loadUsersList from '../actions/loadUsersList';
import loadFacets from '../actions/loadFacets';
import {appFullTitle, appShortTitle, authGraphName, baseResourceDomain} from '../configs/general';

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
    tripleStore: {
        path: '/tripleStore',
        method: 'get',
        handler: require('../components/architecturePages/TripleStore'),
        label: 'TripleStore',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Triple Store'});
            done();
        }
    },
    integrationRISIS: {
        path: '/integrationRISIS',
        method: 'get',
        handler: require('../components/architecturePages/IntegrationRISIS'),
        label: 'IntegrationRISIS',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Integration RISIS'});
            done();
        }
    },
    integrationPublic: {
        path: '/integrationPublic',
        method: 'get',
        handler: require('../components/architecturePages/IntegrationPublic'),
        label: 'IntegrationPublic',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Integration Public'});
            done();
        }
    },
    integrationSocial: {
        path: '/integrationSocial',
        method: 'get',
        handler: require('../components/architecturePages/IntegrationSocial'),
        label: 'IntegrationSocial',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Integration Social'});
            done();
        }
    },
    ner: {
        path: '/ner',
        method: 'get',
        handler: require('../components/architecturePages/NER'),
        label: 'NER',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Named Entity Recognition'});
            done();
        }
    },
    innovativeGeoServices: {
        path: '/innovativeGeoServices',
        method: 'get',
        handler: require('../components/architecturePages/InnovativeGeoServices'),
        label: 'InnovativeGeoServices',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Innovative Geo Services'});
            done();
        }
    },
    basicGeoServices: {
        path: '/basicGeoServices',
        method: 'get',
        handler: require('../components/architecturePages/BasicGeoServices'),
        label: 'BasicGeoServices',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Basic Geo Services'});
            done();
        }
    },
    identityServices: {
        path: '/identityServices',
        method: 'get',
        handler: require('../components/architecturePages/IdentityServices'),
        label: 'IdentityServices',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Identity Services'});
            done();
        }
    },
    categoryServices: {
        path: '/categoryServices',
        method: 'get',
        handler: require('../components/architecturePages/CategoryServices'),
        label: 'CategoryServices',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Category Services'});
            done();
        }
    },
    ACPs: {
        path: '/ACPs',
        method: 'get',
        handler: require('../components/architecturePages/ACPs'),
        label: 'ACPs',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | ACPs'});
            done();
        }
    },
    PDF2Text: {
        path: '/PDF2Text',
        method: 'get',
        handler: require('../components/architecturePages/PDF2Text'),
        label: 'PDF2Text',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | PDF to Text'});
            done();
        }
    },
    otherApps: {
        path: '/otherApps',
        method: 'get',
        handler: require('../components/architecturePages/OtherApps'),
        label: 'OtherApps',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Other Apps'});
            done();
        }
    },
    demos: {
        path: '/demos',
        method: 'get',
        handler: require('../components/Demos'),
        label: 'Demos',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Demos'});
            done();
        }
    },
    boundariesMap: {
        path: '/boundariesMap',
        method: 'get',
        handler: require('../components/BoundariesMap'),
        label: 'boundariesMap',
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', { pageTitle: appFullTitle + ' | Example Boundaries Map'});
            done();
        }
    },
    facets: {
        path: '/browse/:id?',
        method: 'get',
        handler: require('../components/FacetedBrowser'),
        label: 'Faceted Browser',
        action: (context, payload, done) => {
            let graphName, page;
            graphName = payload.params.id;
            if (!graphName) {
                graphName = 0;
            }
            context.executeAction(loadFacets, {mode: 'init', id: graphName, selection: 0, page: 1}, done);
        }
    },
    datasets: {
        //if no id is provided -> will start by defaultGraphName in reactor.config
        path: '/datasets',
        method: 'get',
        handler: require('../components/DatasetsList'),
        label: 'RISIS Datasets',
        action: (context, payload, done) => {
            context.executeAction(loadDatasetsList, {}, done);
        }
    },
    dataset: {
        //if no id is provided -> will start by defaultGraphName in reactor.config
        path: '/dataset/:page?/:id?',
        method: 'get',
        handler: require('../components/reactors/DatasetReactor'),
        label: 'Dataset',
        action: (context, payload, done) => {
            let graphName, page;
            graphName = payload.params.id;
            page = payload.params.page;
            if (!graphName) {
                graphName = 0;
            }
            if (!page) {
                page = 1;
            }
            context.executeAction(loadDataset, { id: graphName, page: page}, done);
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
            let graphName = decodeURIComponent(payload.params.did);
            if (!graphName) {
                graphName = 0;
            }
            context.executeAction(loadResource, { dataset: graphName, resource: decodeURIComponent(payload.params.rid), category: category, propertyPath: propertyPath}, done);
        }
    },
    user: {
        path: '/user/:id',
        method: 'get',
        handler: require('../components/reactors/ResourceReactor'),
        label: 'User',
        action: (context, payload, done) => {
            let category = 0;
            context.executeAction(loadResource, { dataset: authGraphName, resource: baseResourceDomain + '/user/' + decodeURIComponent(payload.params.id), category: category}, done);
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
    }
};
