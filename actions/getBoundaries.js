export default function getBoundaries(context, payload, done) {
    context.dispatch('LOADING_DATA', {});
    context.service.read('resource.boundaries', payload, {timeout: 20 * 1000}, function (err, res) {
        context.dispatch('LOADED_DATA', {});
        if (err) {
            context.dispatch('FIND_BOUNDARIES_FAILURE', err);
        } else {
            context.dispatch('FIND_BOUNDARIES_SUCCESS', res);
        }
        done();
    });
}
