'use strict';
var rp = require('request-promise');
var async = require('async');
var path = require('path');
var fs = require ('fs');
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
    server.get('/demos/geo/PointToNUTS/:long?/:lat?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToNUTS;lat=' + pointLat + ';long=' + pointLong;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            var regions = parsed.resources;
            var regionLinks = [];
            regions.forEach(function(item){
                regionLinks[parseInt(item.level)] = {id: item.code, title: item.name, uri: item.uri};
            });
            var out = '<div class="ui divided list">';
            var dv = '-';
            regionLinks.forEach(function(item, i){
                out = out + '<a target="_blank" class="ui item" href="/demos/geo/NUTS/'+item.id+'""><span class="ui mini grey circular label">'+i+'</span>'+ dv +' '+item.title +' ('+item.id+')</a>';
                dv = dv + '-';
            });
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to NUTS</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/PointToNUTS/'+pointLong+'/'+pointLat+'">Coordinates to NUTS Boundaries</a></h3> </div> <div class="ui segment"> '+out+' </div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/PointToNUTSMap/:long/:lat/:width?/:height?/:sep?', function(req, res) {
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
    server.get('/demos/geo/GADM28Admin/:id', function(req, res) {
        if(!req.params.id){
            res.send('a parameter is missing: id');
            return 0;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.GADM28Admin;id=' + req.params.id;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of properties
            var props = parsed.resources;
            var out = '<div class="ui divided list">';
            out = out + '<span class="ui item">GADM ID: <b>'+req.params.id+'</b></span>';
            for(var prop in props){
                if(prop==='shapeType'){
                    out = out + '<span class="ui item">Shape Type: <a target="_blank" href="/demos/geo/GADM28AdminToPolygon/'+req.params.id+'">'+props[prop]+'</a></span>';
                }else if(prop.indexOf('parent') !== -1) {
                    out = out + '<span class="ui item">'+prop+': <a target="_blank" href="/demos/geo/GADM28Admin/'+props[prop]+'">'+props[prop]+'</a></span>';
                }else{
                    out = out + '<span class="ui item">'+prop+': <b>'+props[prop]+'</b></span>';
                }
            }
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to OSM Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/GADM28Admin/'+req.params.id+'">GADM Admin Boundary Properties</a></h3> </div> <div class="ui segment"> '+out+' </div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/FlickrAdmin/:id', function(req, res) {
        if(!req.params.id){
            res.send('a parameter is missing: id');
            return 0;
        }
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.FlickrAdmin;id=' + req.params.id;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of properties
            var props = parsed.resources;
            var out = '<div class="ui divided list">';
            out = out + '<span class="ui item">Flickr ID: <b>'+req.params.id+'</b></span>';
            for(var prop in props){
                if(prop==='shapeType'){
                    out = out + '<span class="ui item">Shape Type: <a target="_blank" href="/demos/geo/FlickrAdminToPolygon/'+req.params.id+'">'+props[prop]+'</a></span>';
                }else{
                    out = out + '<span class="ui item">'+prop+': <b>'+props[prop]+'</b></span>';
                }
            }
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to Flickr Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/GADM28Admin/'+req.params.id+'">Flickr Admin Boundary Properties</a></h3> </div> <div class="ui segment"> '+out+' </div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/GADM28AdminToPolygon/:code?/:width?/:height?/:color?', function(req, res) {
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
    server.get('/demos/geo/FlickrAdminToPolygon/:code?/:width?/:height?/:color?', function(req, res) {
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
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.FlickrAdminToPolygon;id=' + req.params.code;
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
            var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> FlickrAdmin: '+req.params.code+'</title><script src="http://maps.googleapis.com/maps/api/js"></script><script> '+ output + ' function initialize(){var mapProp = {center: arr[0],zoom:7,mapTypeId: google.maps.MapTypeId.ROADMAP};' + ' var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);' + ' var regionPath=new google.maps.Polygon({path: arr,strokeColor:"'+color+'",strokeOpacity:0.8,strokeWeight:2,fillColor:"'+color+'",fillOpacity:0.4});' + ' regionPath.setMap(map);}' + ' google.maps.event.addDomListener(window, "load", initialize); '+ '</script></head><body><div id="googleMap" style="width:'+width+'px;height:'+height+'px;"></div></body></html>';
            res.send(finalScript);
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/PointToFlickrAdmin/:long?/:lat?/:country?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var countryPart = '';
        if(req.params.country){
            countryPart = ';country=' + req.params.country;
        }
        var lmetadata= {
            'resource': {
                'level1': 'country',
                'level2': 'region',
                'level3': 'county',
                'level4': 'locality',
                'level5': 'neighbourhood',
            }
        };
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        var country = req.params.country;
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToFlickrAdmin;lat=' + pointLat + ';long=' + pointLong+countryPart;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            var regions = parsed.resources;
            var regionLinks = [];
            regions.forEach(function(item){
                if(!regionLinks[parseInt(item.level)]){
                    regionLinks[parseInt(item.level)] = [{id: item.id, title: item.title}];
                }else{
                    regionLinks[parseInt(item.level)].push({id: item.id, title: item.title});
                }
            });
            var out = '<div class="ui divided list">';
            var dv = '-';
            var oecdDetectList = [];
            regionLinks.forEach(function(item, i){
                var itemDIV = [];
                item.forEach(function(subitem, ii){
                    itemDIV.push('<a target="_blank" href="/demos/geo/FlickrAdmin/'+subitem.id+'"">'+subitem.title +'</a>');
                    if(i>2){
                        var tt=subitem.title.split(',');
                        oecdDetectList.push(tt[0]);
                    }
                });
                out = out + '<div class="ui item" title="'+lmetadata.resource['level'+i]+'"><span class="ui mini teal circular label">'+i+'</span>'+ dv +' '+itemDIV.join(' | ') +'</div>';
                dv = dv + '-';
            });
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to Flickr Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/PointToFlickrAdmin/'+pointLong+'/'+pointLat+'/'+country+'">Coordinates to Flickr Admin Boundaries</a></h3> </div> <div class="ui segment"> '+out+' </div><div class="ui segment"> <iframe src=\'/demos/geo/DetectOECDFUAs/'+country+'/'+JSON.stringify(oecdDetectList)+'\' height="150" width="100%" style="border:none;overflow: scroll;"></iframe></div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });

    server.get('/demos/geo/PointToGADM28Admin/:long?/:lat?/:country?', function(req, res) {
        if(!req.params.lat || !req.params.long){
            res.send('a parameter is missing: lat or long');
            return 0;
        }
        var countryPart = '';
        if(req.params.country){
            countryPart = ';country=' + req.params.country;
        }
        //provinces, departments, bibhag, bundeslander, daerah istimewa, fivondronana, krong, landsvæðun, opština, sous-préfectures, counties, and thana
        var lmetadata= {
            'resource': {
                'level0': 'country',
                'level1': 'provinces',
                'level2': 'region',
                'level3': 'county',
                'level4': 'locality',
                'level5': 'neighbourhood',
                'level6': 'neighbourhood',
            }
        };
        var pointLong = req.params.long;
        var pointLat = req.params.lat;
        var country = req.params.country;
        var apiURI = 'http://' + req.headers.host + smsAPI +  '/geo.PointToGADM28Admin;lat=' + pointLat + ';long=' + pointLong + countryPart;
        //console.log(apiURI);
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            var regions = parsed.resources;
            var regionLinks = [];
            regions.forEach(function(item){
                if(!regionLinks[parseInt(item.level)]){
                    regionLinks[parseInt(item.level)] = [{id: item.id, title: item.title}];
                }else{
                    regionLinks[parseInt(item.level)].push({id: item.id, title: item.title});
                }
            });
            var out = '<div class="ui divided list">';
            var dv = '-';
            var oecdDetectList = [];
            regionLinks.forEach(function(item, i){
                var itemDIV = [];
                item.forEach(function(subitem, ii){
                    if(i>1){
                        var tt=subitem.title.split(',');
                        oecdDetectList.push(tt[0]);
                    }
                    itemDIV.push('<a target="_blank" href="/demos/geo/GADM28Admin/'+subitem.id+'"">'+subitem.title +'</a>')
                });
                out = out + '<div class="ui item"><span class="ui mini teal circular label">'+i+'</span>'+ dv +' '+itemDIV.join(' | ') +'</div>';
                dv = dv + '-';
            });
            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to GADM Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/PointToGADM28Admin/'+pointLong+'/'+pointLat+'/'+country+'">Coordinates to GADM Admin Boundaries</a></h3> </div> <div class="ui segment"> '+out+' </div><div class="ui segment"> <iframe src=\'/demos/geo/DetectOECDFUAs/'+country+'/'+JSON.stringify(oecdDetectList)+'\' height="150" width="100%" style="border:none;overflow: scroll;"></iframe></div></div></div></div></body></html>');
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/PointToGADM28AdminMap/:long?/:lat?/:country?/:width?/:height?/:sep?', function(req, res) {
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

            //collect metadata
            var apiURI2 = 'http://' + req.headers.host + smsAPI +  '/geo.OSMAdminMetadata'+ countryPart;
            rp.get({uri: apiURI2}).then(function(body2){
                var lmetadata = JSON.parse(body2);

                            var parsed = JSON.parse(body);
                            //list of regions
                            var regions = parsed.resources;
                            var regionLinks = [];
                            regions.forEach(function(item){
                                if(!regionLinks[parseInt(item.level)]){
                                    regionLinks[parseInt(item.level)] = [{id: item.id, title: item.title}];
                                }else{
                                    regionLinks[parseInt(item.level)].push({id: item.id, title: item.title});
                                }
                            });
                            var out = '<div class="ui divided list">';
                            var dv = '-';
                            var oecdDetectList = [];
                            regionLinks.forEach(function(item, i){
                                var itemDIV = [];
                                item.forEach(function(subitem, ii){
                                    if(i>3){
                                        var tt=subitem.title.split(',');
                                        oecdDetectList.push(tt[0]);
                                    }
                                    itemDIV.push('<a target="_blank" href="/demos/geo/OSMAdmin/'+subitem.id+'"">'+subitem.title +'</a>')
                                });
                                out = out + '<div class="ui item" title="'+(lmetadata && lmetadata.resource && lmetadata.resource['level'+i] ? lmetadata.resource['level'+i] : 'no metadata available!')+'"><span class="ui mini teal circular label">'+i+'</span>'+ dv +' '+itemDIV.join(' | ') +'</div>';
                                dv = dv + '-';
                            });
                            res.send('<!DOCTYPE html><html><head><meta charset="utf-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><title>'+appShortTitle+': demos/geo -> Point to OSM Admin</title></head><body><div class="ui page grid"> <div class="row"> <div class="ui segments column"><div class="ui orange segment"><h3><a target="_blank" href="/demos/geo/PointToOSMAdmin/'+pointLong+'/'+pointLat+'/'+country+'">Coordinates to OSM Admin Boundaries</a></h3> </div> <div class="ui segment"> '+out+' </div><div class="ui segment"> <iframe src=\'/demos/geo/DetectOECDFUAs/'+country+'/'+JSON.stringify(oecdDetectList)+'\' height="150" width="100%" style="border:none;overflow: scroll;"></iframe></div></div></div></div></body></html>');

            }).catch(function (err2) {
                console.log(err2);
                res.send('');
                return 0;
            });
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
                res.render('addressToOSMAdmin', {appShortTitle: appShortTitle, appFullTitle: appFullTitle, input: req.body.addr, address: encodeURIComponent(req.body.addr), point:{long: longitude, lat: latitude, country: country}});
            }else{
                res.send('No result!');
            }
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/addressToFlickrAdmin', function(req, res) {
        res.render('addressToFlickrAdmin', {input: '', appShortTitle: appShortTitle, appFullTitle: appFullTitle});
    });
    server.post('/demos/geo/addressToFlickrAdmin', function(req, res) {
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
                res.render('addressToFlickrAdmin', {appFullTitle: appFullTitle, input: req.body.addr, address: encodeURIComponent(req.body.addr), point:{long: longitude, lat: latitude, country: country}});
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
    server.get('/demos/geo/addressToAdmin', function(req, res) {
        res.render('addressToAdmin', {input: '', appShortTitle: appShortTitle, appFullTitle: appFullTitle});
    });
    server.post('/demos/geo/addressToAdmin', function(req, res) {
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
                res.render('addressToAdmin', {appFullTitle: appFullTitle, input: req.body.addr, address: encodeURIComponent(req.body.addr), point:{long: longitude, lat: latitude, country: country}});
            }else{
                res.send('No result!');
            }
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });


    function get_random_color() {var letters = "ABCDE".split("");var color = "#";for (var i=0; i<3; i++ ) {color += letters[Math.floor(Math.random() * letters.length)];}return color;}

    server.get('/demos/geo/AdminCountryLevels/:country/:level/:source/:width?/:height?/:offset?/:limit?', function(req, res) {
        if(!req.params.country || !req.params.level || !req.params.source){
            res.send('A parameter is missing, you need something like: /NLD/2/gadm');
            return 0;
        }
        var width = 500;
        var height = 500;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        var limitSTR='', offsetSTR='';
        if(req.params.offset){
            offsetSTR = 'offset='+req.params.offset+';';
        }
        if(req.params.limit){
            limitSTR = 'limit='+req.params.limit+';';
        }
        var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.AdminsByLevel;level='+req.params.level+';country='+req.params.country+';source='+req.params.source +';'+offsetSTR+limitSTR;
        var sourceSTR = '';
        var  source = req.params.source;
        if(source === 'gadm'){
            sourceSTR = 'GADM28Admin';
        }else if(source === 'osm'){
            sourceSTR = 'OSMAdmin';
        }else if(source === 'flickr'){
            sourceSTR = 'FlickrAdmin';
        }else if(source === 'oecd'){
            sourceSTR = 'OECDFUA';
            var apiURI = 'http://' + req.headers.host + smsAPI + '/geo.OECDFUAList;country='+req.params.country;
        }
        var codes;
        var colors = ['#0bc4a7', '#1a48eb', '#ecdc0b', '#ed1ec6', '#d9990b', '#0c0d17', '#e3104f', '#6d8ecf', '#0bc4a7'];
        rp.get({uri: apiURI}).then(function(body){
            var parsed = JSON.parse(body);
            //list of regions
            codes = parsed.resources;
            if(!Array.isArray(codes)){
                codes = [codes];
            }
            var asyncTasks = [];
            var polygons = [];
            var nutsLinks = [];
            codes.forEach(function(item){
                nutsLinks.push('<a target="_blank" class="ui label" href="/demos/geo/'+sourceSTR+'/'+item.id+'"">'+item.title+'(#'+item.id+')</a>');
              // We don't actually execute the async action here
              // We add a function containing it to an array of "tasks"
                asyncTasks.push(function(callback){
                    rp.get({uri: 'http://' + req.headers.host + smsAPI +'/geo.'+sourceSTR+';id=' + item.id}).then(function(body2){
                        rp.get({uri: 'http://' + req.headers.host + smsAPI + '/geo.'+sourceSTR+'ToPolygon;id=' + item.id}).then(function(body3){
                            var parsed2 = JSON.parse(body2);
                            var parsed3 = JSON.parse(body3);
                            //console.log(parsed2.result.primaryTopic.label);
                            var input = parsed3.resources[0].polygon;
                            polygons.push({geometry: input, id: item.id, name: item.title});
                            callback();
                        }).catch(function (err3) {
                            console.log('atomic3: ', err3);
                            callback();
                        });
                    }).catch(function (err) {
                        console.log('atomic2: ', err);
                        callback();
                    });
                });
            });
            async.parallelLimit(asyncTasks, 20, function(){
                // All tasks are done now
                var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" /><style>		.info {padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.8);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px;}.info h4 {margin: 0 0 5px;color: #777;}</style><title>Administrative Areas: ('+req.params.country+'), Level: '+req.params.level+', Source: '+req.params.source+'</title> ';
                var features = [];
                var colorsObject = {};
                polygons.forEach(function(input, i){
                    //console.log(input.name, input.id);
                    //handling each polygon in the list
                    var polygons2 = parseVirtPolygon(input.geometry);
                    var multiPLG = [];
                    var polgArr = [];
                    polygons2.forEach(function(plg){
                        polgArr = [];
                        plg.forEach(function(el){
                            if(typeof el == 'string'){
                                var tmp = el.split(' ');
                                polgArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])]);
                            }
                        });
                        if(polgArr.length){
                            multiPLG.push(polgArr);
                        }
                    });
                    var shapeType, coordinatesArr;
                    if(multiPLG.length > 1){
                        shapeType = 'MultiPolygon';
                        coordinatesArr = multiPLG;

                    }else{
                        shapeType = 'Polygon';
                        coordinatesArr = multiPLG[0];

                    }

                    features.push({'type': 'Feature', 'id': input.id, 'properties': {'name': input.name}, 'geometry': {'type': shapeType, coordinates: [coordinatesArr]}});
                });
                var focusPoint;
                if(features[0].geometry.type == 'Polygon'){
                    focusPoint = features[0].geometry.coordinates[0][0];
                }else{
                    focusPoint = features[0].geometry.coordinates[0][0][0];
                }
                var mapboxAccessToken = config.mapboxKey;
                var mcpData = {'type':'FeatureCollection','features': features};
                finalScript = finalScript +  '</head><body><div class="ui segments"><div class="ui segment"><h3><a target="_blank" href="/demos/geo/AdminCountryLevels/'+req.params.country+'/'+req.params.level+'/'+req.params.source+'">Administrative Areas Per Country</a></h3></div><div class="ui segment"><div id="map" style="width:'+width+'px;height:'+height+'px;"></div><b></b>'+nutsLinks.length+' boundaries found:<br/> '+nutsLinks.join(' ')+'</div></div><script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script><script> var colorObject = '+JSON.stringify(colorsObject)+'; function getColor(d) { return colorObject[d];}	function style(feature) {return {weight: 2,opacity: 1,color: "black",dashArray: "3",fillOpacity: 0.35, fillColor: "#CD0074"};} var map = L.map("map").setView([ '+(focusPoint? focusPoint[1]: 0)+', '+(focusPoint? focusPoint[0]: 1)+'], 7); var info = L.control();info.onAdd = function (map) {this._div = L.DomUtil.create("div", "info");this.update();return this._div;};info.update = function (props) {this._div.innerHTML = "<h4>Municipality: </h4>" +  (props ? ("<b>" + props.name + "</b>") : "Hover over a region");}; info.addTo(map);function highlightFeature(e) {var layer = e.target;layer.setStyle({weight: 5,color: "#666",dashArray: "",fillOpacity: 0.7}); if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); } info.update(layer.feature.properties); } function resetHighlight(e) { geojson.resetStyle(e.target); info.update();} function zoomToFeature(e) {map.fitBounds(e.target.getBounds());} function onEachFeature(feature, layer) {layer.on({mouseover: highlightFeature,mouseout: resetHighlight,click: zoomToFeature});}  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {attribution: \'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>\',maxZoom: 18,id: "mapbox.light",accessToken: "'+mapboxAccessToken+'"}).addTo(map); var geojson = L.geoJson('+JSON.stringify(mcpData)+', {style: style, onEachFeature: onEachFeature}).addTo(map);</script></body></html>';
                res.send(finalScript);
            });
        }).catch(function (err) {
            console.log(err);
            res.send('');
            return 0;
        });
    });
    server.get('/demos/geo/NL_Universities/:width?/:height?', function(req, res) {
        var nl_unis_oecd_polygons = require('../../data/nl_universities/nl_unis_oecd_polygons');
        var nl_unis_osm_polygons = require('../../data/nl_universities/nl_unis_osm_polygons');
        var nl_unis_gadm_polygons = require('../../data/nl_universities/nl_unis_gadm_polygons');
        var nl_unis_flickr_polygons = require('../../data/nl_universities/nl_unis_flickr_polygons');
        var nl_universities = require('../../data/nl_universities/nl_universities');

        var width = 500;
        var height = 500;
        if(req.params.width){
            width = req.params.width;
        }
        if(req.params.height){
            height = req.params.height;
        }
        let flagID ={};
        var colors = ['#0bc4a7', '#1a48eb', '#ecdc0b', '#ed1ec6', '#d9990b', '#0c0d17', '#e3104f', '#6d8ecf', '#0bc4a7'];
        var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" /><style>		.info {padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.8);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px;}.info h4 {margin: 0 0 5px;color: #777;}</style><title>NL Universities</title> ';
        var features = [];
        var colorsObject = {};

        nl_unis_osm_polygons.forEach((uni)=>{
            if(!flagID[uni.processed.id]){
                var polygons2 = parseVirtPolygon(uni.processed.resources[0].polygon);
                var multiPLG = [];
                var polgArr = [];
                polygons2.forEach(function(plg){
                    polgArr = [];
                    plg.forEach(function(el){
                        if(typeof el == 'string'){
                            var tmp = el.split(' ');
                            polgArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])]);
                        }
                    });
                    if(polgArr.length){
                        multiPLG.push(polgArr);
                    }
                });
                var shapeType, coordinatesArr;
                if(multiPLG.length > 1){
                    shapeType = 'MultiPolygon';
                    coordinatesArr = multiPLG;

                }else{
                    shapeType = 'Polygon';
                    coordinatesArr = multiPLG[0];

                }
                flagID[uni.processed.id]=1;
                features.push({'type': 'Feature', 'id': uni.processed.id, 'properties': {'name': uni.processed.resources[0].name, source: 'osm'}, 'geometry': {'type': shapeType, coordinates: [coordinatesArr]}});
            }

        });
        nl_unis_gadm_polygons.forEach((uni)=>{
            if(!flagID[uni.processed.id]){
                var polygons2 = parseVirtPolygon(uni.processed.resources[0].polygon);
                var multiPLG = [];
                var polgArr = [];
                polygons2.forEach(function(plg){
                    polgArr = [];
                    plg.forEach(function(el){
                        if(typeof el == 'string'){
                            var tmp = el.split(' ');
                            polgArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])]);
                        }
                    });
                    if(polgArr.length){
                        multiPLG.push(polgArr);
                    }
                });
                var shapeType, coordinatesArr;
                if(multiPLG.length > 1){
                    shapeType = 'MultiPolygon';
                    coordinatesArr = multiPLG;

                }else{
                    shapeType = 'Polygon';
                    coordinatesArr = multiPLG[0];

                }
                flagID[uni.processed.id]=1;
                features.push({'type': 'Feature', 'id': uni.processed.id, 'properties': {'name': uni.processed.resources[0].name, source: 'gadm'}, 'geometry': {'type': shapeType, coordinates: [coordinatesArr]}});
            }

        });
        nl_unis_flickr_polygons.forEach((uni)=>{
            if(!flagID[uni.processed.id]){
                var polygons2 = parseVirtPolygon(uni.processed.resources[0].polygon);
                var multiPLG = [];
                var polgArr = [];
                polygons2.forEach(function(plg){
                    polgArr = [];
                    plg.forEach(function(el){
                        if(typeof el == 'string'){
                            var tmp = el.split(' ');
                            polgArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])]);
                        }
                    });
                    if(polgArr.length){
                        multiPLG.push(polgArr);
                    }
                });
                var shapeType, coordinatesArr;
                if(multiPLG.length > 1){
                    shapeType = 'MultiPolygon';
                    coordinatesArr = multiPLG;

                }else{
                    shapeType = 'Polygon';
                    coordinatesArr = multiPLG[0];

                }
                flagID[uni.processed.id]=1;
                features.push({'type': 'Feature', 'id': uni.processed.id, 'properties': {'name': uni.processed.resources[0].name, source: 'flickr'}, 'geometry': {'type': shapeType, coordinates: [coordinatesArr]}});
            }

        });
        nl_unis_oecd_polygons.forEach((uni)=>{
            if(!flagID[uni.processed.id]){
                var polygons2 = parseVirtPolygon(uni.processed.resources[0].polygon);
                var multiPLG = [];
                var polgArr = [];
                polygons2.forEach(function(plg){
                    polgArr = [];
                    plg.forEach(function(el){
                        if(typeof el == 'string'){
                            var tmp = el.split(' ');
                            polgArr.push([parseFloat(tmp[0]), parseFloat(tmp[1])]);
                        }
                    });
                    if(polgArr.length){
                        multiPLG.push(polgArr);
                    }
                });
                var shapeType, coordinatesArr;
                if(multiPLG.length > 1){
                    shapeType = 'MultiPolygon';
                    coordinatesArr = multiPLG;

                }else{
                    shapeType = 'Polygon';
                    coordinatesArr = multiPLG[0];

                }
                flagID[uni.processed.id]=1;
                features.push({'type': 'Feature', 'id': uni.processed.id, 'properties': {'name': uni.processed.resources[0].name, source: 'oecd'}, 'geometry': {'type': shapeType, coordinates: [coordinatesArr]}});
            }

        });
        var tmpn;
        nl_universities.forEach((uni)=>{
            tmpn = uni.addr.split(',');
            features.push({'type': 'Feature', 'id': tmpn[0], 'properties': {'name': tmpn[0]}, 'geometry': {'type': 'Point', coordinates: [uni.processed.geometry.location.lng, uni.processed.geometry.location.lat]}});
        });
        var focusPoint;
        if(features[0].geometry.type == 'Polygon'){
            focusPoint = features[0].geometry.coordinates[0][0];
        }else{
            focusPoint = features[0].geometry.coordinates[0][0][0];
        }
        var mapboxAccessToken = config.mapboxKey;
        var mcpData = {'type':'FeatureCollection','features': features};
        finalScript = finalScript +  '</head><body><div id="map" style="width:'+width+'px;height:'+height+'px;"></div><script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script><script> var colorObject = '+JSON.stringify(colorsObject)+'; function getColor(d) { return colorObject[d];}	function style(feature) {return {weight: 2,opacity: 1,color: feature.properties.source == "oecd" ? "#CD0074" : (feature.properties.source =="osm" ? "#ecdc0b" : (feature.properties.source =="gadm" ? "#6d8ecf" : "#0bc4a7")),dashArray: "3",fillOpacity: 0.35, fillColor: feature.properties.source == "oecd" ? "#CD0074" : (feature.properties.source =="osm" ? "#ecdc0b" : (feature.properties.source =="gadm" ? "#6d8ecf" : "#0bc4a7"))};} var map = L.map("map").setView([ '+(focusPoint? focusPoint[1]: 0)+', '+(focusPoint? focusPoint[0]: 1)+'], 7); var info = L.control();info.onAdd = function (map) {this._div = L.DomUtil.create("div", "info");this.update();return this._div;};info.update = function (props) {this._div.innerHTML = "<h4>Boundary: </h4>" +  (props ? ("<b>" + props.name + "</b>") : "Hover over a region");}; info.addTo(map);function highlightFeature(e) {var layer = e.target;if(layer.feature.geometry.type !="Point"){layer.setStyle({weight: 5,color: "#666",dashArray: "",fillOpacity: 0.7}); if (!L.Browser.ie && !L.Browser.opera) { layer.bringToFront(); }} info.update(layer.feature.properties);} function resetHighlight(e) { geojson.resetStyle(e.target); info.update();} function zoomToFeature(e) {map.fitBounds(e.target.getBounds());} function onEachFeature(feature, layer) {layer.on({mouseover: highlightFeature,mouseout: resetHighlight,click: zoomToFeature});}  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {attribution: \'Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>\',maxZoom: 18,id: "mapbox.light",accessToken: "'+mapboxAccessToken+'"}).addTo(map); var geojson = L.geoJson('+JSON.stringify(mcpData)+', {style: style, onEachFeature: onEachFeature}).addTo(map);</script><div class="ui segment"><span style="background-color: #CD0074; opacity: 0.35;">OECD</span><span style="background-color: #ecdc0b; opacity: 0.35;">OSM</span><span style="background-color: #6d8ecf; opacity: 0.35;">GADM</span><span style="background-color: #0bc4a7; opacity: 0.35;">Flickr</span></div></body></html>';
        res.send(finalScript);

    });
    server.get('/demos/geo/DetectOECDFUAs/:country/:list', function(req, res) {
        if(!req.params.list || !req.params.country){
            res.send('A parameter is missing');
            return 0;
        }
        var list = JSON.parse(req.params.list);
        var country = req.params.country;
        var output=[];
        var asyncTasks = [];
        list.forEach(function(item){
              // We add a function containing it to an array of "tasks"
            asyncTasks.push(function(callback){
                rp.get({uri: 'http://' + req.headers.host + smsAPI +'/geo.BoundaryToOECDFUA'+';name=' + item+';country='+ country}).then(function(body2){
                    var parsed2 = JSON.parse(body2);
                    if(parsed2.resources){
                        output.push(parsed2);
                    }
                    callback();
                }).catch(function (err) {
                    console.log('atomic2: ', err);
                    callback();
                });
            });
        });
        async.parallelLimit(asyncTasks, 2, function(){
            // All tasks are done now
            var finalScript = '<!DOCTYPE html><html><head><link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.3/semantic.min.css" rel="stylesheet" type="text/css" /><link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" /><style>	.info {padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.8);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px;}.info h4 {margin: 0 0 5px;color: #777;}</style><title>Boundaries to FUA: ('+country+'), list: '+list+'</title> ';
            let outputItems=[];
            var logitems = [];
            output.forEach(function(input, i){
                if(logitems.indexOf(input.resources[0].funactionalUrbanArea.code) == -1){
                    logitems.push(input.resources[0].funactionalUrbanArea.code);
                    outputItems.push('<div class="item"><b>'+input.resources[0].funactionalUrbanArea.name+'</b> ('+input.resources[0].funactionalUrbanArea.code+')</div>')
                }
            });
            finalScript = finalScript +  '</head><body><div class="ui segments"><div class="ui segment"><h3><a target="_blank" href=\'/demos/geo/DetectOECDFUAs/'+country+'/'+JSON.stringify(list)+'/'+'\'>Boundaries to OECD FUAs</a></h3></div><div class="ui segment"><div class="ui list">'+outputItems.join(' ')+'</div></div></body></html>';
            res.send(finalScript);
        });
    });
};
