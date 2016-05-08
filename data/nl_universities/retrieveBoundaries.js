let rp = require('request-promise');
let async = require('async');


let asyncTasks = [];
let output=[];

let unis= require('./data/nl_universities/nl_universities');
unis.forEach((uni)=>{
    var lat = uni.processed.geometry.location.lat;
    var lng = uni.processed.geometry.location.lng;
    var oecdURL = 'http://sms.risis.eu/api/geo.PointToOECDFUA;lat='+lat+';long='+lng+';country=NLD';
    var gadmURL = 'http://sms.risis.eu/api/geo.PointToGADM28Admin;lat='+lat+';long='+lng+';country=NLD';
    var flickrURL = 'http://sms.risis.eu/api/geo.PointToFlickrAdmin;lat='+lat+';long='+lng+';country=NLD';
    var osmURL = 'http://sms.risis.eu/api/geo.PointToOSMAdmin;lat='+lat+';long='+lng+';country=NLD';
    asyncTasks.push(function(callback){
        rp.get({uri: oecdURL}).then(function(body){
            var parsed = JSON.parse(body);
            if(parsed.resources){
                output.push({addr: uni.addr, processed: parsed});
            }
            callback();
        }).catch(function (err) {
            console.log('atomic2: ', err);
            callback();
        });
    });
});


async.parallelLimit(asyncTasks, 3, function(){
    console.log(JSON.stringify(output));
});
