export default {
    //full page title
    appFullTitle: ['SMS Platform'],
    //short page title
    appShortTitle: ['SMS'],
    //Default Named Graph under observation, if not set , will consider all existing graph names
    defaultGraphName: [''],
    //will prevent access if not logged in
    enableAuthentication: 1,
    //graph that stores users data, must be loaded beforehand
    authGraphName: ['http://rdf.risis.eu/sms/users.ttl#'],
    //the domain name under which basic dynamic resources and user resources will be defined
    baseResourceDomain: ['http://risis.eu'],
    //will allow super users to confirm and activate regiastered users
    enableUserConfirmation: 1,
    //will enable email notifications
    enableEmailNotifications: 1,
    //will put all update actions in log folder
    enableLogs: 1
};
