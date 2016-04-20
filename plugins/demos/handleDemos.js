'use strict';
var rp = require('request-promise');
var async = require('async');
var path = require('path');

var config = require('./config');
var generalConfig = require('../../configs/general');
var appShortTitle = generalConfig.appShortTitle;
var appFullTitle = generalConfig.appFullTitle;
var smsAPI = '/api';

module.exports = function handleDemos(server) {

    server.get('/demos/geo', function(req, res) {
        res.json({'message' : 'Hello! I am a demo Geo app! Try this example: /demos/geo/NUTS/NL326'});
    });

    server.get('/demos/geo/geocode/:addr?', function(req, res) {
        if((!req.params.addr)){
            res.send('Please add an address in the URI: /demos/geo/geocode/{your address}');
            return 0;
        }
        var apiKey = config.googleKey;
        var apiURI = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(decodeURIComponent(req.params.addr))+'&key=' + apiKey;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //res.json(parsed);
            if(parsed.results.length){
                var formatted = parsed.results[0].formatted_address;
                var location = parsed.results[0].geometry.location;
                res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> geocode</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/geocode/'+encodeURIComponent(req.params.addr)+'">Address to Coordinates</a></h3> </div> <div class="ui segment"> <div class="content"> <div class="description"> <form method="post" class="ui form fields"><div class="field success"> <label>Fomatted Address</label> <div class="ui icon input"> <textarea rows="4">'+formatted+'</textarea> </div> </div> <div class="field success"> <label>Latitude</label> <div class="ui icon input"> <input type="text" value="'+location.lat+'" /> </div> </div> <div class="field success"> <label>Longitude</label> <div class="ui icon input"> <input type="text" value="'+location.lng+'" /> </div> </div> <div class="field"> </div></form></div> </div> </div> </div> </div></div> <div style="display:none">'+JSON.stringify(parsed)+'</div></body></html>');
            }else{
                res.send('No result!');
            }
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    //todo: handle multi polygons
    var parseVirtPolygon = function(input) {
        var out = [];
        if(input.indexOf('MULTIPOLYGON') !== -1){
            var res = input.replace('MULTIPOLYGON(', '');
            res = res.substring(0, res.length - 1);
            // ((----)),((------)),((---------))
            var parts = res.split('((');
            parts.forEach(function(el){
                var tmp = el.trim().replace(')),', '');
                var tmp = tmp.replace('))', '');
                if(tmp){
                    out.push(tmp.split(','));
                }
            })
            return out;
        }else{
            var tmp = input.split(')');
            var tl = tmp.length;
            if(tl){
                var tmp2 = tmp[0].split('(');
                if(tl === 3){
                    //normal polygon
                    //console.log(tmp);
                    var tmp3 = tmp2[2].split(',');
                }else if (tl > 3){
                    //polygon with holes or multipolygons
                    //console.log(tmp);
                    //get the first part only
                    var tmp3 = tmp2[3].split(',');
                }
                return [tmp3];
            }else{
                return [];
            }
        }
    };

    server.get('/demos/geo/NUTS/:code?/:width?/:height?/:color?', function(req, res) {
        if(!req.params.code){
            res.send('');
            return 0;
        }
        var color = '#0000FF';
        if(req.params.color){
            color = '#' + req.params.color;
        }
        var width = 500;
        var height = 500;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.NUTStoPolygon;code=' + req.params.code;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            var input = parsed.resources[0].polygon;
            var polygons = parseVirtPolygon(input);
            if(!polygons.length){
                res.send('');
                return 0;
            }
            var output = 'var arr = [];';
            polygons.forEach(function(points){
                points.forEach(function(el){
                    var tmp = el.split(' ');
                    output = output + 'arr.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                });
            });
            var finalScript = '<!DOCTYPE html><html><head><title>'+appShortTitle+': demos/geo -> NUTS: '+req.params.code+'</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> '+ output + ' function initialize(){var mapProp = {center: arr[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' + ' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);' + ' var regionPath=new google.maps.Polygon({path: arr,strokeColor:"'+color+'",strokeOpacity:0.8,strokeWeight:2,fillColor:"'+color+'",fillOpacity:0.4});' + ' regionPath.setMap(map);}' + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></body></html>';
            res.send(finalScript);
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/PointAndNUTS/:long?/:lat?/:code?/:width?/:height?', function(req, res) {
        if(!req.params.code || !req.params.lat || !req.params.long){
            res.send('a parameter is missing: long, lat or NUTS code');
            return 0;
        }
        var width = 500;
        var height = 500;
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.NUTStoPolygon;code=' + req.params.code;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            var input = parsed.resources[0].polygon;
            var polygons = parseVirtPolygon(input);
            if(!polygons.length){
                res.send('');
                return 0;
            }
            var output = 'var arr = [];';
            polygons.forEach(function(points){
                points.forEach(function(el){
                    var tmp = el.split(' ');
                    output = output + 'arr.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                });
            });
            var finalScript = '<!DOCTYPE html><html><head><title>'+appShortTitle+': demos/geo -> PointAndNUTS: ('+pointLat+','+pointLong+') and  '+req.params.code+'</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> '+ output + 'var myPoint=new google.maps.LatLng('+pointLat+','+pointLong+'); var marker;  function initialize(){var mapProp = {center: arr[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' + ' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp); var marker=new google.maps.Marker({position:myPoint,animation:google.maps.Animation.BOUNCE}); marker.setMap(map); ' + ' var regionPath=new google.maps.Polygon({path: arr,strokeColor:"#0000FF",strokeOpacity:0.8,strokeWeight:2,fillColor:"#0000FF",fillOpacity:0.4});' + ' regionPath.setMap(map);}' + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></body></html>';
            res.send(finalScript);
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/PointToNUTS/:long/:lat/:width?/:height?/:sep?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var sep = 0;
        if(req.params.sep){
            sep = 1;
        }
        var width = 500;
        var height = 500;
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToNUTS;lat=' + pointLat + ';long=' + pointLong;
        var codes;
        var colors = ['#0bc4a7', '#1a48eb', '#ecdc0b', '#ed1ec6', '#d9990b', '#0c0d17', '#e3104f', '#6d8ecf'];
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            codes = parsed.resources;
            var asyncTasks = [];
            var polygons = [];
            var nutsLinks = [];
            codes.forEach(function(item){
                nutsLinks.push('<a target="_blank" class="ui label" href="/demos/geo/NUTS/'+item.code+'"">'+item.code+'</a>');
              // We don't actually execute the async action here
              // We add a function containing it to an array of "tasks"
                asyncTasks.push(function(callback){
                    rp.get({uri: 'http://' + req.headers.host + smsAPI + '/geo.NUTStoPolygon;code=' + item.code}).then(function(body2){
                        var parsed2 = JSON.parse(body2);
                        var input = parsed2.resources[0].polygon;
                        polygons.push(input);
                        callback();
                    }).catch(function (err) {
                        callback();
                    });
                });
            });
            async.parallel(asyncTasks, function(){
                // All tasks are done now
                if(sep){
                    //render in different iframes
                    var finalScript = '<!DOCTYPE html><html><head><title>PointToNUTS: ('+pointLat+','+pointLong+')</title></head><body>';
                    codes.forEach(function(item, i){
                        finalScript = finalScript + '<iframe src="/demos/geo/NUTS/'+item.code+'/400/400/'+colors[i].split('#')[1]+'" width="400" height="400" style="border:none"></iframe> ';
                    });
                    finalScript = finalScript + '</body></html>';
                    res.send(finalScript);
                }else{
                    var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> PointToNUTS: ('+pointLat+','+pointLong+')</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> ' + ' var myPoint=new google.maps.LatLng('+pointLat+','+pointLong+'); var marker; ';
                    polygons.forEach(function(input, i){
                        var polygons2 = parseVirtPolygon(input);
                        var output = 'var arr'+i+' = [];';
                        polygons2.forEach(function(points){
                            points.forEach(function(el){
                                var tmp = el.split(' ');
                                output = output + 'arr'+i+'.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                            });
                        });
                        finalScript = finalScript + output;
                        if(i === 0){
                            finalScript = finalScript + ' function initialize(){var mapProp = {center: arr'+i+'[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' +' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp); ';
                        }
                        var opacity = i * 0.10 + 0.14;
                        if(opacity >= 0.70){
                            opacity = 0.50;
                        }
                        var sopacity = 1 - (i * 0.15);
                        if(sopacity <= 0){
                            sopacity = 0.18;
                        }
                        finalScript = finalScript + ' var regionPath'+i+'=new google.maps.Polygon({path: arr'+i+',strokeColor:"'+(colors[colors.length - i - 1])+'",strokeOpacity:'+sopacity+',strokeWeight:2,fillColor:"'+colors[i]+'",fillOpacity:'+opacity+'});' + ' regionPath'+i+'.setMap(map);';
                        if(i === (polygons.length - 1 )){
                            finalScript = finalScript + ' var marker=new google.maps.Marker({position:myPoint,animation:google.maps.Animation.BOUNCE}); marker.setMap(map); }';
                        }
                    })
                    finalScript = finalScript + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div class="ui segments"><div class="ui segment"><h3><a target="_blank" href="/PointToNUTS/'+pointLong+'/'+pointLat+'">Coordinates to NUTS</a></h3></div><div class="ui segment">'+nutsLinks.join(' ')+'<div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></div></div></body></html>';
                    res.send(finalScript);
                }
            });
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/GADM28Admin/:code?/:width?/:height?/:color?', function(req, res) {
        if(!req.params.code){
            res.send('identifier parameter is missing!');
            return 0;
        }
        var color = '#0000FF';
        if(req.params.color){
            color = '#' + req.params.color;
        }
        var width = 500;
        var height = 500;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.GADM28AdminToPolygon;id=' + req.params.code;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            var input = parsed.resources[0].polygon;
            var polygons = parseVirtPolygon(input);
            if(!polygons.length){
                res.send('');
                return 0;
            }
            var output = 'var arr = [];';
            polygons.forEach(function(points){
                points.forEach(function(el){
                    var tmp = el.split(' ');
                    output = output + 'arr.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                });
            });
            var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> GADM28Admin: '+req.params.code+'</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> '+ output + ' function initialize(){var mapProp = {center: arr[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' + ' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);' + ' var regionPath=new google.maps.Polygon({path: arr,strokeColor:"'+color+'",strokeOpacity:0.8,strokeWeight:2,fillColor:"'+color+'",fillOpacity:0.4});' + ' regionPath.setMap(map);}' + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></body></html>';
            res.send(finalScript);
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/PointToGADM28Admin/:long?/:lat?/:country?/:width?/:height?/:sep?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var countryPart = '';
        if(req.params.country){
            countryPart = ';country=' + req.params.country;
        }
        var sep = 0;
        if(req.params.sep){
            sep = 1;
        }
        var width = 500;
        var height = 500;
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        var country = req.params.country;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToGADM28Admin;lat=' + pointLat + ';long=' + pointLong + countryPart;
        //console.log(apiURI);
        var codes;
        var colors = ['#0bc4a7', '#1a48eb', '#ecdc0b', '#ed1ec6', '#d9990b', '#0c0d17', '#e3104f', '#6d8ecf'];
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            codes = parsed.resources;
            var asyncTasks = [];
            var polygons = [];
            var nutsLinks = [];
            codes.forEach(function(item){
                nutsLinks.push('<a target="_blank" class="ui label" href="/demos/geo/GADM28Admin/'+item.id+'"">'+item.id+ ': ' + item.title +'</a>');
              // We don't actually execute the async action here
              // We add a function containing it to an array of "tasks"
                asyncTasks.push(function(callback){
                    rp.get({uri: 'http://' + req.headers.host + smsAPI + '/geo.GADM28AdminToPolygon;id=' + item.id}).then(function(body2){
                        var parsed2 = JSON.parse(body2);
                        var input = parsed2.resources[0].polygon;
                        polygons.push(input);
                        callback();
                    }).catch(function (err) {
                        callback();
                    });
                });
            });
            async.parallel(asyncTasks, function(){
                // All tasks are done now
                if(sep){
                    //render in different iframes
                    var finalScript = '<!DOCTYPE html><html><head><title>'+appShortTitle+': demos/geo -> PointToGADM28Admin: ('+pointLat+','+pointLong+')</title></head><body>';
                    codes.forEach(function(item, i){
                        finalScript = finalScript + '<iframe src="/demos/geo/GADM28Admin/'+item.id+'/400/400/'+colors[i].split('#')[1]+'" width="400" height="400" style="border:none"></iframe> ';
                    });
                    finalScript = finalScript + '</body></html>';
                    res.send(finalScript);
                }else{
                    var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> PointToGADM28Admin: ('+pointLat+','+pointLong+')</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> ' + ' var myPoint=new google.maps.LatLng('+pointLat+','+pointLong+'); var marker; ';
                    polygons.forEach(function(input, i){
                        var polygons2 = parseVirtPolygon(input);
                        var output = 'var arr'+i+' = [];';
                        polygons2.forEach(function(points){
                            points.forEach(function(el){
                                var tmp = el.split(' ');
                                output = output + 'arr'+i+'.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                            });
                        });
                        finalScript = finalScript + output;
                        if(i === 0){
                            finalScript = finalScript + ' function initialize(){var mapProp = {center: arr'+i+'[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' +' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp); ';
                        }
                        var opacity = i * 0.10 + 0.14;
                        if(opacity >= 0.70){
                            opacity = 0.50;
                        }
                        var sopacity = 1 - (i * 0.15);
                        if(sopacity <= 0){
                            sopacity = 0.18;
                        }
                        finalScript = finalScript + ' var regionPath'+i+'=new google.maps.Polygon({path: arr'+i+',strokeColor:"'+(colors[colors.length - i - 1])+'",strokeOpacity:'+sopacity+',strokeWeight:2,fillColor:"'+colors[i]+'",fillOpacity:'+opacity+'});' + ' regionPath'+i+'.setMap(map);';
                        if(i === (polygons.length - 1 )){
                            finalScript = finalScript + ' var marker=new google.maps.Marker({position:myPoint,animation:google.maps.Animation.BOUNCE}); marker.setMap(map); }';
                        }
                    })
                    finalScript = finalScript + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div class="ui segments"><div class="ui segment"><h3><a target="_blank" href="/demos/geo/PointToGADM28Admin/'+pointLong+'/'+pointLat+'"/'+country+'>Coordinates to GADM28Admin</a></h3></div><div class="ui segment">'+nutsLinks.join(' ')+'<div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></div></div></body></html>';
                    res.send(finalScript);
                }
            });
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    var getCountryFromGoogleAPIResult = function(address_components){
        let shortName='',longName='';
        address_components.forEach(function(el){
            if(el.types.indexOf('country') !== -1){
                shortName = el.short_name;
                longName = el.long_name;
            }
        });
        return {shortName: shortName, longName: longName};
    }
    server.get('/demos/geo/addressToGADM28Admin', function(req, res) {
        res.render('addressToGADM28Admin', {input: '', appShortTitle: appShortTitle, appFullTitle: appFullTitle});
    });
    server.post('/demos/geo/addressToGADM28Admin', function(req, res) {
        if((!req.body.addr)){
            res.send('Please add an address in the URI: /demos/geo/geocode/{your address}');
            return 0;
        }
        var longitude, latitude, nCode, mCode, country;
        var apiKey = config.googleKey;
        var apiURI = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(decodeURIComponent(req.body.addr))+'&key=' + apiKey;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //res.json(parsed);
            if(parsed.results.length){
                //var formatted = parsed.results[0].formatted_address;
                var location = parsed.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
                country = getCountryFromGoogleAPIResult(parsed.results[0].address_components);
                res.render('addressToGADM28Admin', {input: req.body.addr, address: encodeURIComponent(req.body.addr), point:{long: longitude, lat: latitude, country: country}});
            }else{
                res.send('No result!');
            }
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/OSMAdmin/:id', function(req, res) {
        if(!req.params.id){
            res.send('a parameter is missing: id');
            return 0;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.OSMAdmin;id=' + req.params.id;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of properties
            var props = parsed.resources;
            var out = '<div class="ui divided list">';
            out = out + '<span class="ui item">OSM ID: <a target="_blank" href="http://www.openstreetmap.org/'+req.params.id.split('_')[0]+'/'+req.params.id.split('_')[1]+'">'+req.params.id.replace('_', '/')+'</a></span>';
            for(var prop in props){
                if(prop==='dbpedia'){
                    out = out + '<span class="ui item">DBPedia URI: <a target="_blank" href="'+props[prop]+'">'+props[prop]+'</a></span>';
                }else if(prop==='wikidata'){
                    out = out + '<span class="ui item">WikiData URI: <a target="_blank" href="'+props[prop]+'">'+props[prop]+'</a></span>';
                }else if(prop==='shapeType'){
                    out = out + '<span class="ui item">Shape Type: <a target="_blank" href="/demos/geo/OSMAdminToPolygon/'+req.params.id+'">'+props[prop]+'</a></span>';
                }else{
                    out = out + '<span class="ui item">'+prop+': <b>'+props[prop]+'</b></span>';
                }
            }

            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to OSM Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/OSMAdmin/'+req.params.id+'">OSM Admin Boundary Properties</a></h3> </div> <div class="ui segment"> '+out+' </div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/PointToOSMAdmin/:long?/:lat?/:country?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var countryPart = '';
        if(req.params.country){
            countryPart = ';country=' + req.params.country;
        }
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        var country = req.params.country;
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToOSMAdmin;lat=' + pointLat + ';long=' + pointLong + countryPart;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            var regions = parsed.resources;
            var regionLinks = [];
            regions.forEach(function(item){
                regionLinks[parseInt(item.level)] = {id: item.id, title: item.title};
            });
            var out = '<div class="ui divided list">';
            var dv = '-';
            regionLinks.forEach(function(item, i){
                out = out + '<a target="_blank" class="ui item" href="/demos/geo/OSMAdmin/'+item.id+'""><span class="ui mini olive circular label">'+(i+1)+'</span>'+ dv +' '+item.title +'</a>';
                dv = dv + '-';
            });
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to OSM Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/PointToOSMAdmin/'+pointLong+'/'+pointLat+'/'+country+'">Coordinates to OSM Admin Boundaries</a></h3> </div> <div class="ui segment"> '+out+' </div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/addressToOSMAdmin', function(req, res) {
        res.render('addressToOSMAdmin', {input: '', appShortTitle: appShortTitle, appFullTitle: appFullTitle});
    });
    server.post('/demos/geo/addressToOSMAdmin', function(req, res) {
        if((!req.body.addr)){
            res.send('Please add an address in the URI: /demos/geo/geocode/{your address}');
            return 0;
        }
        var longitude, latitude, nCode, mCode, country;
        var apiKey = config.googleKey;
        var apiURI = 'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(decodeURIComponent(req.body.addr))+'&key=' + apiKey;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //res.json(parsed);
            if(parsed.results.length){
                //var formatted = parsed.results[0].formatted_address;
                var location = parsed.results[0].geometry.location;
                latitude = location.lat;
                longitude = location.lng;
                country = getCountryFromGoogleAPIResult(parsed.results[0].address_components);
                res.render('addressToOSMAdmin', {input: req.body.addr, address: encodeURIComponent(req.body.addr), point:{long: longitude, lat: latitude, country: country}});
            }else{
                res.send('No result!');
            }
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/OSMAdminToPolygon/:code?/:width?/:height?/:color?', function(req, res) {
        if(!req.params.code){
            res.send('identifier parameter is missing!');
            return 0;
        }
        var color = '#0000FF';
        if(req.params.color){
            color = '#' + req.params.color;
        }
        var width = 500;
        var height = 500;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.OSMAdminToPolygon;id=' + req.params.code;
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            var input = parsed.resources[0].polygon;
            var polygons = parseVirtPolygon(input);
            if(!polygons.length){
                res.send('');
                return 0;
            }
            var output = 'var arr = [];';
            polygons.forEach(function(points){
                points.forEach(function(el){
                    var tmp = el.split(' ');
                    output = output + 'arr.push(new google.maps.LatLng('+tmp[1]+','+tmp[0]+')); ';
                });
            });
            var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> GADM28Admin: '+req.params.code+'</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> '+ output + ' function initialize(){var mapProp = {center: arr[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' + ' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);' + ' var regionPath=new google.maps.Polygon({path: arr,strokeColor:"'+color+'",strokeOpacity:0.8,strokeWeight:2,fillColor:"'+color+'",fillOpacity:0.4});' + ' regionPath.setMap(map);}' + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></body></html>';
            res.send(finalScript);
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
};
