'use strict';
class AdminUtil{

    parseUsers(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({username: el.username.value, v: el.subject.value, isActive: el.isActive.value, isSuperUser: el.isSuperUser.value, mbox: el.mbox.value, firstName: el.firstName.value, lastName: el.lastName.value, created: el.created ? el.created.value: '', membership: el.membership.value});
            });
            return output;
        }
    }
    parseSearchAllData(body) {
        let parsed = JSON.parse(body);
        let output=[];
        if(parsed.results.bindings.length){
            parsed.results.bindings.forEach(function(el) {
                output.push({graphName: el.g.value, resource: el.s.value, property: el.p.value, text: el.label.value});
            });
            return output;
        }
    }

}
export default AdminUtil;
