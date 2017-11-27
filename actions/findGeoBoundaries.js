export default function findGeoBoundaries(context, payload, done) {
    context.service.read('dbpedia.address2boundary', payload, {timeout: 20 * 1000}, function (err, res) {
        if (err) {
            let error_res = {enrichment: {location: 0, boundarySource: payload.boundarySource, boundaries: []}, id: payload.id, query: payload.query, msg: err};
            context.dispatch('UPDATE_GEO_BOUNDARIES__FAILURE', error_res);
        } else {
            context.dispatch('UPDATE_GEO_BOUNDARIES', res);
        }
        done(null, res);
    });
}
