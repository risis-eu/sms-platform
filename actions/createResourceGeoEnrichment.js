export default function createResourceGeoEnrichment(context, payload, done) {
    context.service.create('resource.geoEnrichment', payload, {}, function (err, res) {
        if (err) {
            context.dispatch('CREATE_RESOURCE_GEOENRICHMENT_FAILURE', err);
            done(err, res);
        } else {
            context.dispatch('CREATE_RESOURCE_GEOENRICHMENT_SUCCESS', res);
            done(null, res);
        }
    });
}
