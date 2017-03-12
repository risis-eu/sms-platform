export default function getLinksetDetails(context, payload, done) {
    context.service.read('dataset.linksetDetails', payload, {timeout: 20 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('UPDATE_LINKSET_DETAILS_FAILURE', err);
        } else {
            context.dispatch('UPDATE_LINKSET_DETAILS_SUCCESS', res);
        }
        done();
    });
}
