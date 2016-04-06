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
             /*jshint multistr: true */
             var query = '\
             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
             SELECT ( COUNT(?s) AS ?exists ) FROM <'+ generalConfig.authGraphName[0] +'> WHERE { \
               { \
                   ?s a foaf:Person . \
                   ?s foaf:accountName "'+ req.body.username +'" .\
               } \
             } \
             ';
             var rpPath = helper.getHTTPQuery('read', query, endpoint, outputFormat);
             //send request
             rp.get({uri: rpPath}).then(function(resq){
                 var parsed = JSON.parse(resq);
                 if(parsed.results.bindings.length){
                     if(parsed.results.bindings[0].exists.value ==='0'){
                         //register as new user
                         console.log('start registration');
                         var rnd = Math.round(+new Date() / 1000);
                         var resourceURI = generalConfig.baseResourceDomain + '/user/' + rnd;
                         var dresourceURI = generalConfig.baseResourceDomain + '/resource/' + rnd;
                         var dgraphURI = generalConfig.baseResourceDomain + '/graph/' + rnd;
                         var blanknode = generalConfig.baseResourceDomain + '/editorship/' + rnd;
                         var editorofgraph='';
                         var tmpE= [];
                         if(Array.isArray(req.body.editorofgraph)){
                            req.body.editorofgraph.forEach(function(el) {
                                if(el!=='0'){
                                    tmpE.push('<'+el+'>');
                                }
                            });
                            editorofgraph = tmpE.join(',');
                        }else{
                            if(req.body.editorofgraph!=='0'){
                                if(req.body.editorofgraph){
                                    editorofgraph = '<'+req.body.editorofgraph+'>';
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
                             query = '\
                             PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                             PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                             PREFIX dcterms: <http://purl.org/dc/terms/> \
                             INSERT DATA { GRAPH <'+ generalConfig.authGraphName[0] +'> { \
                             <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+req.body.firstname+'"""; foaf:lastName """'+req.body.lastname+'"""; foaf:organization """'+req.body.organization+'"""; vCard:ROLE """'+req.body.position+'""";foaf:mbox <mailto:'+req.body.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+req.body.username+'"""; ldr:password """'+passwordHash.generate(req.body.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph '+editorofgraph+'; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1> , <'+blanknode+'2> , <'+blanknode+'3> , <'+blanknode+'4> , <'+blanknode+'5> , <'+blanknode+'6>  , <'+blanknode+'7>  . \
                             <'+blanknode+'1> ldr:resource <'+resourceURI+'> ; ldr:property foaf:firstName . \
                             <'+blanknode+'2> ldr:resource <'+resourceURI+'> ; ldr:property foaf:lastName . \
                             <'+blanknode+'3> ldr:resource <'+resourceURI+'> ; ldr:property vCard:role . \
                             <'+blanknode+'4> ldr:resource <'+resourceURI+'> ; ldr:property vCard:adr . \
                             <'+blanknode+'5> ldr:resource <'+resourceURI+'> ; ldr:property foaf:organization . \
                             <'+blanknode+'6> ldr:resource <'+resourceURI+'> ; ldr:property ldr:password . \
                             <'+blanknode+'7> ldr:resource <'+resourceURI+'> ; ldr:property vivo:orcidId . \
                            }} \
                             ';
                         }else {
                             /*jshint multistr: true */
                             query = '\
                             PREFIX ldr: <https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#> \
                             PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#> \
                             PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
                             PREFIX dcterms: <http://purl.org/dc/terms/> \
                             INSERT DATA INTO <'+ generalConfig.authGraphName[0] +'> { \
                             <'+ resourceURI + '> a foaf:Person; foaf:firstName """'+req.body.firstname+'"""; foaf:lastName """'+req.body.lastname+'"""; foaf:organization """'+req.body.organization+'"""; vCard:ROLE """'+req.body.position+'"""; foaf:mbox <mailto:'+req.body.email+'>; dcterms:created "' + currentDate + '"^^xsd:dateTime; foaf:accountName """'+req.body.username+'"""; ldr:password """'+passwordHash.generate(req.body.password)+'"""; ldr:isActive "'+isActive+'"^^xsd:Integer; ldr:isSuperUser "0"^^xsd:Integer; ldr:editorOfGraph '+editorofgraph+'; ldr:editorOfResource <'+dresourceURI+'>; ldr:editorOfProperty <'+blanknode+'1> , <'+blanknode+'2> , <'+blanknode+'3> , <'+blanknode+'4> , <'+blanknode+'5> , <'+blanknode+'6>  , <'+blanknode+'7>  . \
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
                         console.log(rpPath);
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
                              res.render('register', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, datasets: output, data: req.body, errorMsg: 'Error... User already exists!'});
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
