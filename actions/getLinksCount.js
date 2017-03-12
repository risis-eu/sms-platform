export default function getLinksCount(context, payload, done) {
    context.service.read('dataset.linksCount', payload, {timeout: 20 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('UPDATE_LINKSET_TOTAL_FAILURE', err);
        } else {
            context.dispatch('UPDATE_LINKSET_TOTAL_SUCCESS', res);
        }
        done();
    });
}
