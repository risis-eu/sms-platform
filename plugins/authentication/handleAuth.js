'use strict';
//required for authentication
let passwordHash = require('password-hash');
let passport = require ('passport');
let passportConfig = require('./passport-config');
passportConfig.enable(passport);
//----------------------
let handleEmail = require('../../plugins/email/handleEmail');
let rp = require('request-promise');
let config = require('../../configs/server');
let generalConfig = require('../../configs/general');
let helpers = require('../../services/utils/helpers');

let appShortTitle = generalConfig.appShortTitle;
let appFullTitle = generalConfig.appFullTitle;

const outputFormat = 'application/sparql-results+json';
const headers = {'Accept': 'application/sparql-results+json'};

let getPropertyLabel = (uri) => {
    var property = '';
    var tmp = uri;
    var tmp2 = tmp.split('#');
    if (tmp2.length > 1) {
        property = tmp2[1];
    } else {
        tmp2 = tmp.split('/');
        property = tmp2[tmp2.length - 1];
        tmp2 = property.split(':');
        property = tmp2[tmp2.length - 1];
    }
    //make first letter capital case
    property = property.charAt(0).toUpperCase() + property.slice(1);
    return property;
}
module.exports = function handleAuthentication(server) {
    server.use(passport.initialize());
    server.use(passport.session());
    server.get('/login', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, user: req.user });
        }else{
            return res.redirect('/');
        }
    });
    //----------------handle OAuth authentication
    const oauth2 = require('simple-oauth2').create({
        client: {
            id: config.OAuth.risis.clientID,
            secret: config.OAuth.risis.clientSecret,
        },
        auth: {
            tokenHost: config.OAuth.risis.site,
            tokenPath: config.OAuth.risis.tokenPath,
            authorizePath: config.OAuth.risis.authorizationPath,
        },
    });
    // Authorization uri definition
    const authorization_uri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: config.OAuth.risis.redirectURI,
        state: '3(#sadsd0/!~',
    });
    // Initial page redirecting to RISIS OAuth server
    server.get('/auth', function (req, res) {
        res.redirect(authorization_uri);
    });
    // Callback service parsing the authorization token and asking for the access token
    server.get('/callback', function (req, res) {
        let code = req.query.code;
        oauth2.authorizationCode.getToken({
            code: code,
            redirect_uri: config.OAuth.risis.redirectURI
        }, saveToken);
        function saveToken(error, result) {
            if (error || error !== null) { console.log('Access Token Error', error.message); res.end('Error!')}else{
            //console.log(error, result);
            //token = oauth2.accessToken.create(result);
            //check if user already exist in the system, if not make a new SMS user
            //first: retrive user data using the token
                let accessURL = 'https://auth-risis.cortext.net/auth/access?access_token=' + result.access_token;
                rp.get({uri: accessURL}).then(function(resq){
                    let parsed = JSON.parse(resq);
                    let endpoint = helpers.getStaticEndpointParameters(generalConfig.authDatasetURI);
                    let query = getUserExistsQuery(parsed.username, parsed.email);
                    let rpPath = helpers.getHTTPGetURL(helpers.getHTTPQuery('read', query, endpoint, outputFormat), {headers: headers});
                    //send request
                    console.log('uri', rpPath);
                    rp.get({uri: rpPath}).then(function(resq2){
                        let parsed2 = JSON.parse(resq2);
                        if(parsed2.results.bindings.length){
                            if(parsed2.results.bindings[0].exists.value ==='0'){
                                //user needs to be registered in SMS
                                console.log('user needs to be registered in SMS');
                                let reqObj = {
                                    editorofgraph: '0',
                                    orcidid: '',
                                    firstname: parsed.name,
                                    lastname: '-',
                                    organization: parsed.institution,
                                    position: 'not added!',
                                    email: parsed.email,
                                    username: parsed.username,
                                    password: 'user' + Math.round(+new Date() / 1000) + '$$risis',
                                };
                                addUserQueries(req, res, '');
                            }else{
                                console.log('user is already registred in the system');
                                //user is already registred in the system
                                //have to retrieve username and password from SMS
                                query = getUserDataQuery(parsed.email);
                                //console.log(query);
                                //send request
                                let rpPath = helpers.getHTTPGetURL(helpers.getHTTPQuery('read', query, endpoint, outputFormat), {headers: headers});
                                rp.get({uri: rpPath}).then(function(resqq){
                                    let parsed = JSON.parse(resqq);
                                    //console.log(parsed);
                                    let user={};
                                    if(parsed.results.bindings.length){
                                        parsed.results.bindings.forEach(function(el) {
                                            user[getPropertyLabel(el.p.value)] = el.o.value;
                                        });
                                        user.id = parsed.results.bindings[0].s.value;
                                        //console.log(user);
                                        if(user.isActive === '0'){
                                            res.end('Your account is not yet confirmed in the system... Please wait one or two more days until you receive the confirmation email.');
                                        }else{
                                            req.logIn(user, function(err2l) {
                                                if (err2l) { res.end('Error in login to SMS...'); }
                                                //console.log('auth is OK!');
                                                return res.redirect('/');
                                            });
                                        }
                                    }else{
                                        res.end('Error in retrieving user data from SMS...');
                                    }
                                }).catch(function (errqq) {
                                    console.log(errqq);
                                    res.end('Error in accessing user data from SMS...');
                                });
                            }
                        }
                    }).catch(function (err3) {
                        console.log(err3);
                        res.end('Error in retrieving user data from the SMS platform...');
                        //return res.redirect('/');
                    });
                }).catch(function (err2) {
                    console.log(err2);
                    res.end('Error in retrieving your user data from our authentication server...');
                    //return res.redirect('/');
                });
            }
        }
    });
    //-----------------------end OAuth----------------------------
    server.post('/login', function(req, res, next) {
        let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
        delete req.session.redirectTo;
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                console.log('auth failed! ' + info.message);
                res.render('login', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Authentication failed... ' + info.message});
            }else{
                req.logIn(user, function(err2) {
                    if (err2) { return next(err2); }
                    // console.log('auth is OK!');
                    return res.redirect(redirectTo);
                });
            }
        })(req, res, next);
    });
    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    server.get('/profile/:id', function(req, res) {
        res.redirect('/dataset/' + encodeURIComponent(generalConfig.authDatasetURI)+'/resource/'+ encodeURIComponent(req.params.id));
    });
    server.get('/confirmation', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('confirmation', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, needsConfirmation: generalConfig.enableUserConfirmation});
        }else{
            return res.redirect('/');
        }
    });
    server.get('/register', function(req, res) {
        let recaptchaSiteKey = '';
        if(generalConfig.useGoogleRecaptcha && config.googleRecaptchaService){
            recaptchaSiteKey = config.googleRecaptchaService.siteKey[0];
        }
        if(!req.isAuthenticated()){
            res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, recaptchaSiteKey: recaptchaSiteKey});
        }else{
            return res.redirect('/');
        }
    });
    server.post('/register', function(req, res, next) {
        let recaptchaSiteKey = '';
        let recaptchaSecretKey = '';
        if(generalConfig.useGoogleRecaptcha && config.googleRecaptchaService){
            recaptchaSiteKey = config.googleRecaptchaService.siteKey[0];
            recaptchaSecretKey = config.googleRecaptchaService.secretKey[0];
        }

        let error= '';
        if(req.body.password !== req.body.cpassword){
            error = 'Error! password mismatch...';
        }else{
            for (let prop in req.body) {
                if(!req.body[prop]){
                    error = error + ' missing value for "' + prop +'"';
                }
            }
        }
        if(error){
            console.log(error);
            res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, recaptchaSiteKey: recaptchaSiteKey, data: req.body, errorMsg: 'Error... '+error});
        }else{
            //successfull
            //check recaptcha if enabled
            if(recaptchaSiteKey){
                let recaptchaValidationURL = 'https://www.google.com/recaptcha/api/siteverify';
                let recpostOptions = {
                    method: 'POST',
                    uri: recaptchaValidationURL + '?secret='+recaptchaSecretKey + '&response=' + encodeURIComponent(req.body['g-recaptcha-response'])
                };
                rp(recpostOptions).then(function(recres){
                    let recapRes = JSON.parse(recres);
                    //console.log(recapRes);
                    if(recapRes.success !== undefined && !recapRes.success){
                        //error in recaptcha validation
                        res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, recaptchaSiteKey: recaptchaSiteKey, data: req.body, errorMsg: 'Error... Captcha is not validated! You seem to be a robot...'});
                        return 0;
                    }else{
                        addUserQueries(req, res, recaptchaSiteKey);
                    }
                }).catch(function (errRecap) {
                    console.log(errRecap);
                });
            }else{
                addUserQueries(req, res, recaptchaSiteKey);
            }

        }
    });
};
let prepareGraphName = (graphName)=> {
    let gStart = 'GRAPH <'+ graphName +'> { ';
    let gEnd = ' } ';
    if(!graphName || graphName === 'default'){
        gStart =' ';
        gEnd = ' ';
    }
    return {gStart: gStart, gEnd: gEnd}
};
let getUserExistsQuery = (username, email) => {
    let query = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ( COUNT(?s) AS ?exists ) FROM <${generalConfig.authDatasetURI}> WHERE {
      {
          ?s a foaf:Person .
          ?s foaf:accountName ?accountName .
          ?s foaf:mbox ?mbox .
          FILTER (?accountName="${username}" || ?mbox=<${email}> || ?mbox=<mailto:${email}>)
      }
    }
    `;
    return query;
}
let getUserDataQuery = (email)=>{
    var query = `
    PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?s ?p ?o FROM <${generalConfig.authDatasetURI}> WHERE {
      {
          ?s a foaf:Person .
          ?s foaf:accountName ?accountName .
          ?s foaf:mbox ?mbox .
          ?s ?p ?o .
          FILTER (?accountName="${email}" || ?mbox=<${email}> || ?mbox=<mailto:${email}>)
      }
    }
    `;
    return query;
}
let addUserQueries = (req, res, recaptchaSiteKey) => {
    //first check if user already exists
    let endpoint = helpers.getStaticEndpointParameters(generalConfig.authDatasetURI);
    let {gStart, gEnd} = helpers.prepareGraphName(endpoint.graphName);
    let query = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
    SELECT ( COUNT(?s) AS ?exists ) WHERE {
      ${gStart}
          ?s a ldr:User .
          ?s foaf:accountName """${req.body.username}""" .
      ${gEnd}
    }
    `;
    let rpPath = helpers.getHTTPGetURL(helpers.getHTTPQuery('read', query, endpoint, outputFormat));
    //send request
    rp.get({uri: rpPath}).then(function(resq){
        let parsed = JSON.parse(resq);
        if(parsed.results.bindings.length){
            if(parsed.results.bindings[0].exists.value ==='0'){
                //register as new user
                console.log('start registration');
                let rnd = Math.round(+new Date() / 1000);
                let resourceURI = generalConfig.baseResourceDomain + '/user/' + rnd;
                //let dresourceURI = generalConfig.baseResourceDomain + '/resource/' + rnd;
                let datasetURI = generalConfig.baseResourceDomain + '/dataset/' + rnd;
                let blanknode = generalConfig.baseResourceDomain + '/editorship/' + rnd;
                let tmpE= [];
                let isActive = generalConfig.enableUserConfirmation? 0 : 1;
                let date = new Date();
                let currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
                query = `
                    PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#>
                    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                    PREFIX dcterms: <http://purl.org/dc/terms/>
                    INSERT DATA  {
                        ${gStart}
                            <${resourceURI}> a foaf:Person , ldr:User ;
                                             foaf:firstName """${req.body.firstname}""";
                                             foaf:lastName """${req.body.lastname}""";
                                             foaf:organization """${req.body.organization}""";
                                             foaf:accountName """${req.body.username}""";
                                             rdfs:label """${req.body.username}""";
                                             foaf:member ldr:NormalUser ;
                                             foaf:mbox <mailto:${req.body.email}>;
                                             dcterms:created "${currentDate}"^^xsd:dateTime;
                                             ldr:password """${passwordHash.generate(req.body.password)}""";
                                             ldr:isActive "${isActive}"^^xsd:Integer;
                                             ldr:isSuperUser "0"^^xsd:Integer;
                                             ldr:viewerOf <${blanknode}0> ;
                                             ldr:editorOf <${blanknode}1>, <${blanknode}2>, <${blanknode}3>, <${blanknode}4> .
                                             <${blanknode}1> ldr:scope "RP" ; ldr:resource <${resourceURI}> ;
                                                             ldr:property foaf:firstName .
                                             <${blanknode}2> ldr:scope "RP" ; ldr:resource <${resourceURI}> ;
                                                             ldr:property foaf:lastName .
                                             <${blanknode}3> ldr:scope "RP" ; ldr:resource <${resourceURI}> ;
                                                             ldr:property foaf:organization .
                                             <${blanknode}4> ldr:scope "RP" ; ldr:resource <${resourceURI}> ;
                                                             ldr:property ldr:password .
                        ${gEnd}
                    }
                `;
                let HTTPQueryObject = helpers.getHTTPQuery('update', query, endpoint, outputFormat);
                rp.post({uri: HTTPQueryObject.uri, form: HTTPQueryObject.params}).then(function(){
                    console.log('User is created!');
                    //send email notifications
                    if(generalConfig.enableEmailNotifications){
                        handleEmail.sendMail('userRegistration', req.body.email, '', '', '', '');
                    }
                    return res.redirect('/confirmation');
                }).catch(function (err2) {
                    console.log(err2);
                });
            }else{
                res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, recaptchaSiteKey: recaptchaSiteKey, data: req.body, errorMsg: 'Error... User already exists!'});
                console.log('User already exists!');
            }

        }else{
            res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, recaptchaSiteKey: recaptchaSiteKey, data: req.body, errorMsg: 'Error... Unknown Error!'});
        }
    }).catch(function (errq) {
        console.log(errq);
    });
}
