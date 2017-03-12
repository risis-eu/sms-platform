import {appFullTitle} from '../configs/general';

export default function loadDatasetsMetadataList(context, payload, done) {
    context.service.read('dataset.metadataList', payload, {timeout: 10 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_DATASET_FAILURE', err);
        } else {
            context.dispatch('LOAD_DATASET_SUCCESS', res);
            context.dispatch('UPDATE_DATASET_TOTAL_SUCCESS', {total: res.total});
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: (appFullTitle + ' | Datasets Metadata') || ''
        });
        done();
    });
}
