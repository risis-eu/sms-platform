'use strict';
//required for authentication
var helper = require('./auth-helper');
var passwordHash = require('password-hash');
var passport = require ('passport');
var passportConfig = require('./passport-config');
passportConfig.enable(passport);
//----------------------
var handleEmail = require('../../plugins/email/handleEmail');
var rp = require('request-promise');
var config = require('../../configs/server');
var generalConfig = require('../../configs/general');
var httpOptions, g;
if(config.sparqlEndpoint[generalConfig.authGraphName[0]]){
    g = generalConfig.authGraphName[0];
}else{
    //go for generic SPARQL endpoint
    g = 'generic';
}
httpOptions = {
  host: config.sparqlEndpoint[g].host,
  port: config.sparqlEndpoint[g].port,
  path: config.sparqlEndpoint[g].path
};
var appShortTitle = generalConfig.appShortTitle;
var appFullTitle = generalConfig.appFullTitle;
var outputFormat = 'application/sparql-results+json';
var getDatasetsListQuery = function(){
    //get the list of datasets
    /*jshint multistr: true */
    var query = '\
    PREFIX dcterms: <http://purl.org/dc/terms/> \
    PREFIX void: <http://rdfs.org/ns/void#> \
    PREFIX risisVoid: <http://rdf.risis.eu/dataset/risis/1.0/void.ttl#> \
    SELECT DISTINCT ?dataset ?subject ?title WHERE { \
      { \
        GRAPH risisVoid:  { \
          risisVoid:risis_rdf_dataset void:subset ?dataset . \
        } \
        GRAPH ?dataset {?subject a void:Dataset. ?subject dcterms:title ?title .} \
      } \
    } ORDER BY ASC(?title) \
    ';
    return query;
}

var getUserExistsQuery = function(username, email){
    /*jshint multistr: true */
    var query = '\
    PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
    SELECT ( COUNT(?s) AS ?exists ) FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
      { \
          ?s a foaf:Person . \
          ?s foaf:accountName ?accountName .\
          ?s foaf:mbox ?mbox .\
          FILTER (?accountName="'+username+'" || ?mbox=<'+email+'> || ?mbox=<mailto:'+email+'>) \
      } \
    } \
    ';
    return query;
}
var getUserRegistrationQuery = function (endpoint, reqObject){
    var rnd = Math.round(+new Date() / 1000);
    var resourceURI = generalConfig.baseResourceDomain + '/user/' + rnd;
    var dresourceURI = generalConfig.baseResourceDomain + '/resource/' + rnd;
    var dgraphURI = generalConfig.baseResourceDomain + '/graph/' + rnd;
    var blanknode = generalConfig.baseResourceDomain + '/editorship/' + rnd;
    var editorofgraph='';
    var orcidid;
    if(reqObject.orcidid) {
        orcidid = 'http://orcid.org/' + reqObject.orcidid;
    }else{
        orcidid = 'http://';
    }
    var tmpE= [];
    if(Array.isArray(reqObject.editorofgraph)){
        reqObject.editorofgraph.forEach(function(el) {
            if(el!=='0'){
                tmpE.push('<'+el+'>');
            }
        });
        editorofgraph = tmpE.join(',');
    }else{
        if(reqObject.editorofgraph!=='0'){
            if(reqObject.editorofgraph){
                editorofgraph = '<'+reqObject.editorofgraph+'>';
            }else{
                editorofgraph = '<'+dgraphURI+'>';
            }
        }else{
            editorofgraph = '<'+dgraphURI+'>';
        }
    }
    var isActive = generalConfig.enableUserConfirmation? 0 : 1;
    var date = new Date();
    var currentDate = date.toISOString(); //"2011-12-19T15:28:46.493Z"
    if(endpoint.type === 'sesame'){
        /*jshint multistr: true */
        var query = '\
        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
        PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX vivo: <http://vivoweb.org/ontology/core#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        INSERT DATA { GRAPH <'+ generalConfig.authGraphName[0] +'> { \
        <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+reqObject.firstname+'"""; foaf:lastName """'+reqObject.lastname+'"""; foaf:organization """'+reqObject.organization+'"""; vCard:role """'+reqObject.position+'"""; vivo:orcidId <'+orcidid+'> ; foaf:member <http://rdf.risis.eu/user/RISISUsers> ; vCard:adr """'+reqObject.address+'"""; foaf:mbox <mailto:'+reqObject.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+reqObject.username+'"""; ldr:password """'+passwordHash.generate(reqObject.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph <'+dgraphURI+'>; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1> , <'+blanknode+'2> , <'+blanknode+'3> , <'+blanknode+'4> , <'+blanknode+'5> , <'+blanknode+'6>  , <'+blanknode+'7>  . \
        <'+blanknode+'1> ldr:resource <'+resourceURI+'> ; ldr:property foaf:firstName . \
        <'+blanknode+'2> ldr:resource <'+resourceURI+'> ; ldr:property foaf:lastName . \
        <'+blanknode+'3> ldr:resource <'+resourceURI+'> ; ldr:property vCard:role . \
        <'+blanknode+'4> ldr:resource <'+resourceURI+'> ; ldr:property vCard:adr . \
        <'+blanknode+'5> ldr:resource <'+resourceURI+'> ; ldr:property foaf:organization . \
        <'+blanknode+'6> ldr:resource <'+resourceURI+'> ; ldr:property ldr:password . \
        <'+blanknode+'7> ldr:resource <'+resourceURI+'> ; ldr:property vivo:orcidId . \
        }} \
       ';
    } else {
        /*jshint multistr: true */
        var query = '\
        PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
        PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX vivo: <http://vivoweb.org/ontology/core#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        INSERT DATA INTO <'+ generalConfig.authGraphName[0] +'> { \
        <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+reqObject.firstname+'"""; foaf:lastName """'+reqObject.lastname+'"""; foaf:organization """'+reqObject.organization+'"""; vCard:role """'+reqObject.position+'"""; vivo:orcidId <'+orcidid+'> ; foaf:member <http://rdf.risis.eu/user/RISISUsers> ; vCard:adr """'+reqObject.address+'"""; foaf:mbox <mailto:'+reqObject.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+reqObject.username+'"""; ldr:password """'+passwordHash.generate(reqObject.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph <'+dgraphURI+'>; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1> , <'+blanknode+'2> , <'+blanknode+'3> , <'+blanknode+'4> , <'+blanknode+'5> , <'+blanknode+'6>  , <'+blanknode+'7>  . \
        <'+blanknode+'1> ldr:resource <'+resourceURI+'> ; ldr:property foaf:firstName . \
        <'+blanknode+'2> ldr:resource <'+resourceURI+'> ; ldr:property foaf:lastName . \
        <'+blanknode+'3> ldr:resource <'+resourceURI+'> ; ldr:property vCard:role . \
        <'+blanknode+'4> ldr:resource <'+resourceURI+'> ; ldr:property vCard:adr . \
        <'+blanknode+'5> ldr:resource <'+resourceURI+'> ; ldr:property foaf:organization . \
        <'+blanknode+'6> ldr:resource <'+resourceURI+'> ; ldr:property ldr:password . \
        <'+blanknode+'7> ldr:resource <'+resourceURI+'> ; ldr:property vivo:orcidId . \
        } \
        ';
    }
    return query;
};
var getUserDataQuery = function(email){
    /*jshint multistr: true */
    var query = '\
    PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
    PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
    SELECT ?s ?p ?o FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
      { \
          ?s a foaf:Person . \
          ?s foaf:accountName ?accountName .\
          ?s foaf:mbox ?mbox .\
          ?s ?p ?o . \
          FILTER (?accountName="'+email+'" || ?mbox=<'+email+'> || ?mbox=<mailto:'+email+'>) \
      } \
    } \
    ';
    return query;
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
    let oauth2 = require('simple-oauth2')({
        clientID: config.OAuth.risis.clientID,
        clientSecret: config.OAuth.risis.clientSecret,
        site: config.OAuth.risis.site,
        tokenPath: config.OAuth.risis.tokenPath,
        authorizationPath: config.OAuth.risis.authorizationPath
    });
     // Authorization uri definition
    let authorization_uri = oauth2.authCode.authorizeURL({
        redirect_uri: config.OAuth.risis.redirectURI,
        state: '3sdfdsfXXX2'
    });
     // Initial page redirecting to RISIS OAuth server
    server.get('/auth', function (req, res) {
        res.redirect(authorization_uri);
    });
     // Callback service parsing the authorization token and asking for the access token
    server.get('/callback', function (req, res) {
        let code = req.query.code;
        oauth2.authCode.getToken({
            code: code,
            redirect_uri: config.OAuth.risis.redirectURI
        }, saveToken);

        function saveToken(error, result) {
            if (error || error !== null) { console.log('Access Token Error', error.message); res.end('Error!')}else{
                //console.log(error, result);
                //token = oauth2.accessToken.create(result);
                //check if user already exist in the system, if not make a new SMS user
                //first: retrive user data using the token
                var accessURL = 'https://auth-risis.cortext.net/auth/access?access_token=' + result.access_token;
                rp.get({uri: accessURL}).then(function(resq){
                    var parsed = JSON.parse(resq);
                    var endpoint = helper.getEndpointParameters('generic');
                    var query = getUserExistsQuery(parsed.username, parsed.email);
                    var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
                    //send request
                    rp.get({uri: rpPath}).then(function(resq2){
                        var parsed2 = JSON.parse(resq2);
                        if(parsed2.results.bindings.length){
                            if(parsed2.results.bindings[0].exists.value ==='0'){
                                //user needs to be registered in SMS
                                console.log('user needs to be registered in SMS');
                                var reqObj = {
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
                                query = getUserRegistrationQuery(endpoint, reqObj);
                                rpPath = helper.getHTTPQuery('update', query, endpoint, outputFormat);
                                rp.post({uri: rpPath}).then(function(){
                                    console.log('User is registered in SMS!');
                                    //user needs to be activated on SMS
                                    //send email notifications
                                    if(generalConfig.enableEmailNotifications){
                                        handleEmail.sendMail('userRegistration', reqObj.email, '', '', '', '');
                                    }
                                    return res.redirect('/confirmation');
                                }).catch(function (err4) {
                                    console.log(err4);
                                });
                            }else{
                                console.log('user is already registred in the system');
                                //user is already registred in the system
                                //have to retrieve username and password from SMS
                                query = getUserDataQuery(parsed.email);
                                //console.log(query);
                                var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
                                //send request
                                rp.get({uri: rpPath}).then(function(resqq){
                                    var parsed = JSON.parse(resqq);
                                    //console.log(parsed);
                                    var user={};
                                    if(parsed.results.bindings.length){
                                        parsed.results.bindings.forEach(function(el) {
                                            user[helper.getPropertyLabel(el.p.value)] = el.o.value;
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
     //end OAuth---------------------------
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
        res.redirect('/dataset/' + encodeURIComponent(generalConfig.authGraphName)+'/resource/'+ encodeURIComponent(req.params.id));
    });
    server.get('/confirmation', function(req, res) {
        if(!req.isAuthenticated()){
            res.render('confirmation', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, needsConfirmation: generalConfig.enableUserConfirmation});
        }else{
            return res.redirect('/');
        }
     });
    server.get('/register', function(req, res) {
        if(!req.isAuthenticated()){
            var endpoint = helper.getEndpointParameters('generic');
            var rpPath = helper.getHTTPQuery('read', getDatasetsListQuery(), endpoint, outputFormat);
            rp.get({uri: rpPath}).then(function(resq){
                var parsed = JSON.parse(resq);
                var output=[];
                if(parsed.results.bindings.length){
                  parsed.results.bindings.forEach(function(el) {
                    var tmp=el.subject.value;
                    var tmp2=tmp.split('#');
                    tmp=tmp2[1];
                    tmp2=tmp.split('_rdf_dataset');
                    var name=tmp2[0];
                    output.push({title:el.title.value, v: el.subject.value, g: 'http://rdf.risis.eu/dataset/'+name+'/1.0/void.ttl#'});
                  });
                }
                res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, datasets: output});
            }).catch(function (err2) {
                console.log(err2);
                return res.redirect('/');
            });
        }else{
            return res.redirect('/');
        }
     });
     server.post('/register', function(req, res, next) {
         var endpoint = helper.getEndpointParameters('generic');
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
             var rpPath = helper.getHTTPQuery('read', getDatasetsListQuery(), endpoint, outputFormat);
             rp.get({uri: rpPath}).then(function(resq){
                  var parsed = JSON.parse(resq);
                  var output=[];
                  if(parsed.results.bindings.length){
                    parsed.results.bindings.forEach(function(el) {
                      var tmp=el.subject.value;
                      var tmp2=tmp.split('#');
                      tmp=tmp2[1];
                      tmp2=tmp.split('_rdf_dataset');
                      var name=tmp2[0];
                      output.push({title:el.title.value, v: el.subject.value, g: 'http://rdf.risis.eu/dataset/'+name+'/1.0/void.ttl#'});
                    });
                  }
                  res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, datasets: output, data: req.body, errorMsg: 'Error... '+error});
              }).catch(function (err2) {
                  console.log(err2);
                  return res.redirect('/');
              });
         }else{
             //successfull
             //first check if user already exists
             var query = getUserExistsQuery(req.body.username, req.body.email);
             var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
             //send request
             rp.get({uri: rpPath}).then(function(resq){
                 var parsed = JSON.parse(resq);
                 if(parsed.results.bindings.length){
                     if(parsed.results.bindings[0].exists.value ==='0'){
                         //register as new user
                         console.log('start registration');
                         query = getUserRegistrationQuery(endpoint, req.body);
                         rpPath = helper.getHTTPQuery('update', query, endpoint, outputFormat);
                         rp.post({uri: rpPath}).then(function(){
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
                         var rpPath = helper.getHTTPQuery('read', getDatasetsListQuery(), endpoint, outputFormat);
                         //console.log(rpPath);
                         rp.get({uri: rpPath}).then(function(resq){
                              var parsed = JSON.parse(resq);
                              var output=[];
                              if(parsed.results.bindings.length){
                                parsed.results.bindings.forEach(function(el) {
                                  var tmp=el.subject.value;
                                  var tmp2=tmp.split('#');
                                  tmp=tmp2[1];
                                  tmp2=tmp.split('_rdf_dataset');
                                  var name=tmp2[0];
                                  output.push({title:el.title.value, v: el.subject.value, g: 'http://rdf.risis.eu/dataset/'+name+'/1.0/void.ttl#'});
                                });
                              }
                              res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, datasets: output, data: req.body, errorMsg: 'Error... User/Email already exists!'});
                          }).catch(function (err2) {
                              console.log(err2);
                              return res.redirect('/');
                          });
                     }
                 }else{
                     res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, data: req.body, errorMsg: 'Error... Unknown Error!'});
                 }
             }).catch(function (errq) {
                 console.log(errq);
             });
         }
     });
};
