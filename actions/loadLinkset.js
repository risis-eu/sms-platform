import {appFullTitle} from '../configs/general';
import async from 'async';
import getLinksCount from './getLinksCount';

export default function loadLinkset(context, payload, done) {
    context.dispatch('LOADING_DATA', {});
    //load all required actions in parallel
    async.parallel([
        (callback) => {
            context.service.read('dataset.linkset', payload, {timeout: 20 * 1000}, function (err, res) {
                if (err) {
                    context.dispatch('LOAD_LINKSET_FAILURE', err);
                } else {
                    context.dispatch('LOAD_LINKSET_SUCCESS', res);
                }
                callback();
            });
        },
        (callback) => {
            context.executeAction(getLinksCount, {id: payload.id}, callback);
        }
    ],
    // final callback
    (err, results) => {
        if (err){
            return;
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: (appFullTitle + ' | Linkset | ' + payload.id) || ''
        });
        context.dispatch('LOADED_DATA', {});
        done();
    });
}
