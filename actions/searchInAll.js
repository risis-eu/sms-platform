export default function searchInAll(context, payload, done) {
    context.dispatch('START_TASK_SEARCHALL', {});
    context.service.read('admin.searchAllData', payload, {timeout: 15 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('SEARCHALL_FAILURE', err);
        } else {
            context.dispatch('SEARCHALL_SUCCESS', res);
        }
        done();
    });
}
