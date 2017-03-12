export default function countGeoEnrichedResourcesWithProp(context, payload, done) {
    context.service.read('dataset.countGeoEnrichedResourcesWithProp', payload, {}, function (err, res) {
        if (err) {
            context.dispatch('UPDATE_GEOENRICHED_STAT__FAILURE', err);
        } else {
            context.dispatch('UPDATE_GEOENRICHED_STAT', res);
        }
        done(null, res);
    });
}
