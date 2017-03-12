import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import authPlugin from './plugins/authentication';
import Application from './components/Application';
import RouteStore from './stores/RouteStore';
import ApplicationStore from './stores/ApplicationStore';
import DatasetStore from './stores/DatasetStore';
import UserStore from './stores/UserStore';
import ResourceStore from './stores/ResourceStore';
import IndividualObjectStore from './stores/IndividualObjectStore';
import DBpediaStore from './stores/DBpediaStore';
import DBpediaGMapStore from './stores/DBpediaGMapStore';
import FacetedBrowserStore from './stores/FacetedBrowserStore';
import DatasetsStore from './stores/DatasetsStore';
import BoundaryMapStore from './stores/BoundaryMapStore';
import LinksetStore from './stores/LinksetStore';
import DatasetAnnotationStore from './stores/DatasetAnnotationStore';
import DatasetGeoEnrichmentStore from './stores/DatasetGeoEnrichmentStore';

let app = new Fluxible({
    component: Application,
    stores: [
        RouteStore,
        ApplicationStore,
        DatasetsStore,
        DatasetStore,
        UserStore,
        ResourceStore,
        IndividualObjectStore,
        DBpediaStore,
        DBpediaGMapStore,
        FacetedBrowserStore,
        BoundaryMapStore,
        LinksetStore,
        DatasetAnnotationStore,
        DatasetGeoEnrichmentStore
    ]
});

app.plug(fetchrPlugin({
    xhrPath: '/api/v1.0' // Path for XHR to be served from
}));
app.plug(authPlugin({}));

export default app;
