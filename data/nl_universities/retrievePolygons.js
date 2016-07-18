let rp = require('request-promise');
let async = require('async');


let asyncTasks = [];
let output=[];

let nl_unis_oecd= require('./nl_unis_oecd');
let nl_unis_flickr= require('./nl_unis_flickr');
let nl_unis_gadm= require('./nl_unis_gadm');
let nl_unis_osm= require('./nl_unis_osm');

let flag = {};
nl_unis_oecd.forEach((uni)=>{
    uni.processed.resources.forEach((boundary)=>{
        if(!flag[boundary.id]){
            var oecdURL = 'http://sms.risis.eu/api/geo.OECDFUAToPolygon;smsKey=wefHWDFWF$$235EFGWFGle;id='+boundary.id;
            asyncTasks.push(function(callback){
                rp.get({uri: oecdURL}).then(function(body){
                    var parsed = JSON.parse(body);
                    if(parsed.resources){
                        output.push({addr: uni.addr, processed: parsed});
                    }
                    flag[boundary.id]=parsed;
                    callback();
                }).catch(function (err) {
                    console.log('atomic2: ', err);
                    callback();
                });
            });
        }else{
            output.push({addr: uni.addr, processed: flag[boundary.id]});
        }
        /*
        if(boundary.level == 8){
            if(!flag[boundary.id]){
                var flickrURL = 'http://sms.risis.eu/api/geo.FlickrAdminToPolygon;id='+boundary.id;
                var gadmURL = 'http://sms.risis.eu/api/geo.GADM28AdminToPolygon;id='+boundary.id;
                var osmURL = 'http://sms.risis.eu/api/geo.OSMAdminToPolygon;id='+boundary.id;
                var oecdURL = 'http://sms.risis.eu/api/geo.OECDFUAToPolygon;id='+boundary.id;
                asyncTasks.push(function(callback){
                    rp.get({uri: osmURL}).then(function(body){
                        var parsed = JSON.parse(body);
                        if(parsed.resources){
                            output.push({addr: uni.addr, level: boundary.level, processed: parsed});
                        }
                        flag[boundary.id]=parsed;
                        callback();
                    }).catch(function (err) {
                        console.log('atomic2: ', err);
                        callback();
                    });
                });
            }else{
                output.push({addr: uni.addr, level: boundary.level, processed: flag[boundary.id]});
            }
        }
        */

    });
});


async.parallelLimit(asyncTasks, 3, function(){
    console.log(JSON.stringify(output));
});
