let rp = require('request-promise');
let async = require('async');


let asyncTasks = [];
let output=[];

let unis= require('./nl_universities');
unis.forEach((uni)=>{
    var lat = uni.processed.geometry.location.lat;
    var lng = uni.processed.geometry.location.lng;
    var oecdURL = 'http://sms.risis.eu/api/geo.PointToOECDFUA;smsKey=wefHWDFWF$$235EFGWFGle;lat='+lat+';long='+lng+';country=NLD;level=F';
    var gadmURL = 'http://sms.risis.eu/api/geo.PointToGADM28Admin;smsKey=wefHWDFWF$$235EFGWFGle;lat='+lat+';long='+lng+';country=NLD;level=2';
    var flickrURL = 'http://sms.risis.eu/api/geo.PointToFlickrAdmin;smsKey=wefHWDFWF$$235EFGWFGle;lat='+lat+';long='+lng+';country=NLD;level=3';
    var osmURL = 'http://sms.risis.eu/api/geo.PointToOSMAdmin;smsKey=wefHWDFWF$$235EFGWFGle;lat='+lat+';long='+lng+';country=NLD;level=8';
    asyncTasks.push(function(callback){
        rp.get({uri: osmURL}).then(function(body){
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
