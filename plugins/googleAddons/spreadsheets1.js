// The onOpen function is executed automatically every time a Spreadsheet is loaded
 function onOpen() {
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var menuEntries = [];

   menuEntries.push({name: "Step 1. Initialize", functionName: "createSpreadsheets"});
   menuEntries.push(null); // line separator
   menuEntries.push({name: "Step 2. Geocode addresses", functionName: "geoCodeAddresses"});
   menuEntries.push(null); // line separator
   menuEntries.push({name: "Step 3. Find GADM boundaries", functionName: "findGADMBoundaries"});
   menuEntries.push({name: "Step 3. Find Flickr boundaries", functionName: "findFlickrBoundaries"});
   menuEntries.push({name: "Step 3. Find OSM boundaries", functionName: "findOSMBoundaries"});
   menuEntries.push(null); // line separator
   menuEntries.push({name: "About SMS Platform", functionName: "showAbout"});
   ss.addMenu("SMS Web Services", menuEntries);
 }
function createSpreadsheets() {
   var ss = SpreadsheetApp.getActiveSpreadsheet();


   ss.insertSheet('api config', 0);
   var configSheet = ss.getSheetByName('api config');
   configSheet.setTabColor("ff0000");
   configSheet.getRange('A1:B1').setValues([['parameter','value']]).setFontWeight("bold");
   configSheet.getRange('A2:B2').setValues([['googleAPIKey','enter your Google Geocoding API key here']]).setWrap(true);
   configSheet.getRange('A3:B3').setValues([['smsKey','enter your SMS API key here']]).setWrap(true);

   ss.insertSheet('geocoding', 1);
   var geocodingSheet = ss.getSheetByName('geocoding');
   geocodingSheet.getRange('A1:F1').setValues([['ID','address', 'longitude', 'latitude', 'countryShort', 'countryLong']]).setFontWeight("bold");
   geocodingSheet.getRange('A2:B2').setValues([['1','Vrije Universiteit Amsterdam']]).setWrap(true);

   ss.insertSheet('GADM boundaries', 2);
   var gadmSheet = ss.getSheetByName('GADM boundaries');
   gadmSheet.getRange('A1:O1').setValues([['ID','address', 'level_0_name',	'level_1_name',	'level_2_name',	'level_3_name',	'level_4_name',	'level_5_name', '', 'level_0_id',	'level_1_id',	'level_2_id',	'level_3_id',	'level_4_id',	'level_5_id']]).setFontWeight("bold");


   ss.insertSheet('Flickr boundaries', 3);
   var flickrSheet = ss.getSheetByName('Flickr boundaries');
   flickrSheet.getRange('A1:M1').setValues([['ID','address', 'level_1_name',	'level_2_name',	'level_3_name',	'level_4_name',	'level_5_name', '',	'level_1_id',	'level_2_id',	'level_3_id',	'level_4_id',	'level_5_id']]).setFontWeight("bold");


   ss.insertSheet('OSM boundaries', 4);
   var osmSheet = ss.getSheetByName('OSM boundaries');
   osmSheet.getRange('A1:Y1').setValues([['ID','address', 'level_1_name',	'level_2_name',	'level_3_name',	'level_4_name',	'level_5_name', 'level_6_name', 'level_7_name', 'level_8_name', 'level_9_name', 'level_10_name', 'level_11_name', '',	'level_1_id',	'level_2_id',	'level_3_id',	'level_4_id','level_5_id','level_6_id','level_7_id','level_8_id','level_9_id','level_10_id','level_11_id']]).setFontWeight("bold");

   ss.insertSheet('OSM metadata', 5);
   var osmmSheet = ss.getSheetByName('OSM metadata');
   osmmSheet.getRange('A1:L1').setValues([['country', 'level_1',	'level_2',	'level_3',	'level_4',	'level_5',	'level_6',	'level_7',	'level_8',	'level_9',	'level_10', 'level_11']]).setFontWeight("bold");

}
function getCountryFromGoogleAPIResult(address_components){
        var shortName='',longName='';
        address_components.forEach(function(el){
            if(el.types.indexOf('country') != -1){
                shortName = el.short_name;
                longName = el.long_name;
            }
        });
        return {shortName: shortName, longName: longName};
}

function geoCodeAddresses() {

  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
  var googleAPIKey = configSheet.getRange(2, 2).getValues()[0];

  // Select the sheet named 'geocoding'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');

  // Store the address data in an array called
  // locationInfo. This is the data in cells A2:A20
  var locationInfo = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();

  var googleGeoCodeAPI;
  var googleResponse;
  var parsedResponse;
  var googleResponses = new Array();

  for (var i = 0; i < locationInfo.length; i++) {
    //call SMS APIs
   googleGeoCodeAPI='http://sms.risis.eu/api/geo.googleGeocode;apiKey='+googleAPIKey+';addr='+encodeURIComponent(locationInfo[i])
    googleResponse = UrlFetchApp.fetch(googleGeoCodeAPI);
    parsedResponse = JSON.parse(googleResponse);
    if(parsedResponse.resources.results.length){
      googleResponses.push({'lng': parsedResponse.resources.results[0].geometry.location.lng, 'lat': parsedResponse.resources.results[0].geometry.location.lat, 'country': getCountryFromGoogleAPIResult(parsedResponse.resources.results[0].address_components)});
    }else{
      googleResponses.push({'lng':'', 'lat':'', 'country': {'shortName': '', 'longName': ''}});
    }

  }

  var lngData = new Array();
  var latData = new Array();
  var shortCountryData = new Array();
  var longCountryData = new Array();
  for(var i = 0; i < googleResponses.length; i++){
    lngData.push([googleResponses[i].lng]);
    latData.push([googleResponses[i].lat]);
    shortCountryData.push([googleResponses[i].country.shortName]);
    longCountryData.push([googleResponses[i].country.longName]);
  }
  //Browser.msgBox(googleResponses[0]);
  //sheet.getRange("B2").setValue(lngData[0]);

  sheet.getRange(2,3, lngData.length).setValues(lngData);
  sheet.getRange(2,4, latData.length).setValues(latData);
  sheet.getRange(2,5, shortCountryData.length).setValues(shortCountryData);
  sheet.getRange(2,6, longCountryData.length).setValues(longCountryData)

}

function parseLevels(source, arr) {
  var output = new Array();

  if(source == 'GADM'){
    output[0]=[];
    output[1]=[];
    output[2]=[];
    output[3]=[];
    output[4]=[];
    output[5]=[];
  } else if (source == 'Flickr') {
    output[1]=[];
    output[2]=[];
    output[3]=[];
    output[4]=[];
    output[5]=[];
  } else if (source == 'OSM'){
    output[1]=[];
    output[2]=[];
    output[3]=[];
    output[4]=[];
    output[5]=[];
    output[6]=[];
    output[7]=[];
    output[8]=[];
    output[9]=[];
    output[10]=[];
    output[11]=[];
  }
  for (var i = 0; i < arr.length; i++) {
    output[arr[i].level].push({'id': arr[i].id, 'title': arr[i].title});
  }
  return output;
}
//name = title
function joinSameAdminLevels(levelArr){
  var outputIDs = new Array();
  var outputNames = new Array();
  for (var i = 0; i < levelArr.length; i++) {
    outputIDs.push(levelArr[i].id);
    outputNames.push(levelArr[i].title);
  }
  return {'ids': outputIDs.join(' | '), 'names': outputNames.join(' | ')};
}

function findGADMBoundaries() {
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
  var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
   var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
  // Select the sheet named 'geocoding'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GADM boundaries');

  var smsAPI;
  var smsResponse;
  var parsedResponse;

  var smsResponses= new Array();
  var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

  for (var i = 0; i < locationInfo.length; i++) {
  //call SMS API
    smsAPI='http://sms.risis.eu/api/geo.PointToGADM28Admin;lat='+locationInfo[i][3]+';long='+locationInfo[i][2]+';country='+locationInfo[i][4]+';smsKey='+smsAPIKey;
    smsResponse = UrlFetchApp.fetch(smsAPI);
    parsedResponse = JSON.parse(smsResponse);
    smsResponses.push({'ID': locationInfo[i][0], 'address': locationInfo[i][1], 'levels': parsedResponse.resources});
  }

  var IDData = new Array();
  var addressData = new Array();
  var level0nameData = new Array();
  var level0idData = new Array();
  var level1nameData = new Array();
  var level1idData = new Array();
  var level2nameData = new Array();
  var level2idData = new Array();
  var level3nameData = new Array();
  var level3idData = new Array();
  var level4nameData = new Array();
  var level4idData = new Array();
  var level5nameData = new Array();
  var level5idData = new Array();

  var prasedLevels = new Array();


  for(var i = 0; i < smsResponses.length; i++){
    IDData.push([smsResponses[i].ID]);
    addressData.push([smsResponses[i].address]);

    prasedLevels = parseLevels('GADM', smsResponses[i].levels);
    level0nameData.push([ joinSameAdminLevels(prasedLevels[0]).names]);
    level1nameData.push([ joinSameAdminLevels(prasedLevels[1]).names]);
    level2nameData.push([ joinSameAdminLevels(prasedLevels[2]).names]);
    level3nameData.push([ joinSameAdminLevels(prasedLevels[3]).names]);
    level4nameData.push([ joinSameAdminLevels(prasedLevels[4]).names]);
    level5nameData.push([ joinSameAdminLevels(prasedLevels[5]).names]);

    level0idData.push([ joinSameAdminLevels(prasedLevels[0]).ids]);
    level1idData.push([ joinSameAdminLevels(prasedLevels[1]).ids]);
    level2idData.push([ joinSameAdminLevels(prasedLevels[2]).ids]);
    level3idData.push([ joinSameAdminLevels(prasedLevels[3]).ids]);
    level4idData.push([ joinSameAdminLevels(prasedLevels[4]).ids]);
    level5idData.push([ joinSameAdminLevels(prasedLevels[5]).ids]);
  }
  sheet.getRange(2,1, IDData.length).setValues(IDData);
  sheet.getRange(2,2, addressData.length).setValues(addressData);

  sheet.getRange(2,3, level1nameData.length).setValues(level0nameData);
  sheet.getRange(2,4, level1nameData.length).setValues(level1nameData);
  sheet.getRange(2,5, level2nameData.length).setValues(level2nameData);
  sheet.getRange(2,6, level3nameData.length).setValues(level3nameData);
  sheet.getRange(2,7, level4nameData.length).setValues(level4nameData);
  sheet.getRange(2,8, level5nameData.length).setValues(level5nameData);

  sheet.getRange(2,10, level1idData.length).setValues(level0idData);
  sheet.getRange(2,11, level1idData.length).setValues(level1idData);
  sheet.getRange(2,12, level2idData.length).setValues(level2idData);
  sheet.getRange(2,13, level3idData.length).setValues(level3idData);
  sheet.getRange(2,14, level4idData.length).setValues(level4idData);
  sheet.getRange(2,15, level5idData.length).setValues(level5idData);

}

function findFlickrBoundaries() {
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
  var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
   var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
  // Select the sheet named 'geocoding'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Flickr boundaries');

  var smsAPI;
  var smsResponse;
  var parsedResponse;

  var smsResponses= new Array();
  var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

  for (var i = 0; i < locationInfo.length; i++) {
  //call SMS API
    smsAPI='http://sms.risis.eu/api/geo.PointToFlickrAdmin;lat='+locationInfo[i][3]+';long='+locationInfo[i][2]+';country='+locationInfo[i][4]+';smsKey='+smsAPIKey;
    smsResponse = UrlFetchApp.fetch(smsAPI);
    parsedResponse = JSON.parse(smsResponse);
    smsResponses.push({'ID': locationInfo[i][0], 'address': locationInfo[i][1], 'levels': parsedResponse.resources});
  }

  var IDData = new Array();
  var addressData = new Array();
  var level1nameData = new Array();
  var level1idData = new Array();
  var level2nameData = new Array();
  var level2idData = new Array();
  var level3nameData = new Array();
  var level3idData = new Array();
  var level4nameData = new Array();
  var level4idData = new Array();
  var level5nameData = new Array();
  var level5idData = new Array();

  var prasedLevels = new Array();


  for(var i = 0; i < smsResponses.length; i++){
    IDData.push([smsResponses[i].ID]);
    addressData.push([smsResponses[i].address]);

    prasedLevels = parseLevels('Flickr', smsResponses[i].levels);

    level1nameData.push([ joinSameAdminLevels(prasedLevels[1]).names]);
    level2nameData.push([ joinSameAdminLevels(prasedLevels[2]).names]);
    level3nameData.push([ joinSameAdminLevels(prasedLevels[3]).names]);
    level4nameData.push([ joinSameAdminLevels(prasedLevels[4]).names]);
    level5nameData.push([ joinSameAdminLevels(prasedLevels[5]).names]);


    level1idData.push([ joinSameAdminLevels(prasedLevels[1]).ids]);
    level2idData.push([ joinSameAdminLevels(prasedLevels[2]).ids]);
    level3idData.push([ joinSameAdminLevels(prasedLevels[3]).ids]);
    level4idData.push([ joinSameAdminLevels(prasedLevels[4]).ids]);
    level5idData.push([ joinSameAdminLevels(prasedLevels[5]).ids]);
  }
  sheet.getRange(2,1, IDData.length).setValues(IDData);
  sheet.getRange(2,2, addressData.length).setValues(addressData);


  sheet.getRange(2,3, level1nameData.length).setValues(level1nameData);
  sheet.getRange(2,4, level2nameData.length).setValues(level2nameData);
  sheet.getRange(2,5, level3nameData.length).setValues(level3nameData);
  sheet.getRange(2,6, level4nameData.length).setValues(level4nameData);
  sheet.getRange(2,7, level5nameData.length).setValues(level5nameData);

  sheet.getRange(2,9, level1idData.length).setValues(level1idData);
  sheet.getRange(2,10, level2idData.length).setValues(level2idData);
  sheet.getRange(2,11, level3idData.length).setValues(level3idData);
  sheet.getRange(2,12, level4idData.length).setValues(level4idData);
  sheet.getRange(2,13, level5idData.length).setValues(level5idData);

}

function findOSMBoundaries() {
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
  var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
   var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
  // Select the sheet named 'geocoding'
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM boundaries');
  var metadataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM metadata');

  var smsAPI;
  var smsAPI2;
  var smsResponse;
  var smsResponse2;
  var parsedResponse;
  var parsedResponse2;

  var smsResponses= new Array();
  var metadataResponse = {};
  var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

  for (var i = 0; i < locationInfo.length; i++) {

    //collect OSM metadata per country if needed
    if(!metadataResponse[locationInfo[i][4]]){
        smsAPI2='http://sms.risis.eu/api/geo.OSMAdminMetadata;country='+locationInfo[i][4]+';smsKey='+smsAPIKey;
        smsResponse2 = UrlFetchApp.fetch(smsAPI2);
        parsedResponse2 = JSON.parse(smsResponse2);
        metadataResponse[locationInfo[i][4]] = parsedResponse2;
    }

    //call SMS API
    smsAPI='http://sms.risis.eu/api/geo.PointToOSMAdmin;lat='+locationInfo[i][3]+';long='+locationInfo[i][2]+';country='+locationInfo[i][4]+';smsKey='+smsAPIKey;
    smsResponse = UrlFetchApp.fetch(smsAPI);

    parsedResponse = JSON.parse(smsResponse);
    smsResponses.push({'ID': locationInfo[i][0], 'address': locationInfo[i][1], 'levels': parsedResponse.resources});
  }

  var IDData = new Array();
  var addressData = new Array();
  var level1nameData = new Array();
  var level1idData = new Array();
  var level2nameData = new Array();
  var level2idData = new Array();
  var level3nameData = new Array();
  var level3idData = new Array();
  var level4nameData = new Array();
  var level4idData = new Array();
  var level5nameData = new Array();
  var level5idData = new Array();
  var level6nameData = new Array();
  var level6idData = new Array();
  var level7nameData = new Array();
  var level7idData = new Array();
  var level8nameData = new Array();
  var level8idData = new Array();
  var level9nameData = new Array();
  var level9idData = new Array();
  var level10nameData = new Array();
  var level10idData = new Array();
  var level11nameData = new Array();
  var level11idData = new Array();

  var prasedLevels = new Array();
  var counter = 2;
  for (var prop in metadataResponse) {
     metadataSheet.getRange(counter,1, 1, 12).setValues([[prop,metadataResponse[prop].resource.level1,metadataResponse[prop].resource.level2,metadataResponse[prop].resource.level3,metadataResponse[prop].resource.level4,metadataResponse[prop].resource.level5,metadataResponse[prop].resource.level6,metadataResponse[prop].resource.level7,metadataResponse[prop].resource.level8,metadataResponse[prop].resource.level9,metadataResponse[prop].resource.level10,metadataResponse[prop].resource.level11]]);
     counter++;
  }

  for(var i = 0; i < smsResponses.length; i++){
    IDData.push([smsResponses[i].ID]);
    addressData.push([smsResponses[i].address]);

    prasedLevels = parseLevels('OSM', smsResponses[i].levels);

    level1nameData.push([ joinSameAdminLevels(prasedLevels[1]).names]);
    level2nameData.push([ joinSameAdminLevels(prasedLevels[2]).names]);
    level3nameData.push([ joinSameAdminLevels(prasedLevels[3]).names]);
    level4nameData.push([ joinSameAdminLevels(prasedLevels[4]).names]);
    level5nameData.push([ joinSameAdminLevels(prasedLevels[5]).names]);
    level6nameData.push([ joinSameAdminLevels(prasedLevels[6]).names]);
    level7nameData.push([ joinSameAdminLevels(prasedLevels[7]).names]);
    level8nameData.push([ joinSameAdminLevels(prasedLevels[8]).names]);
    level9nameData.push([ joinSameAdminLevels(prasedLevels[9]).names]);
    level10nameData.push([ joinSameAdminLevels(prasedLevels[10]).names]);
    level11nameData.push([ joinSameAdminLevels(prasedLevels[11]).names]);

    level1idData.push([ joinSameAdminLevels(prasedLevels[1]).ids]);
    level2idData.push([ joinSameAdminLevels(prasedLevels[2]).ids]);
    level3idData.push([ joinSameAdminLevels(prasedLevels[3]).ids]);
    level4idData.push([ joinSameAdminLevels(prasedLevels[4]).ids]);
    level5idData.push([ joinSameAdminLevels(prasedLevels[5]).ids]);
    level6idData.push([ joinSameAdminLevels(prasedLevels[6]).ids]);
    level7idData.push([ joinSameAdminLevels(prasedLevels[7]).ids]);
    level8idData.push([ joinSameAdminLevels(prasedLevels[8]).ids]);
    level9idData.push([ joinSameAdminLevels(prasedLevels[9]).ids]);
    level10idData.push([ joinSameAdminLevels(prasedLevels[10]).ids]);
    level11idData.push([ joinSameAdminLevels(prasedLevels[11]).ids]);
  }
  sheet.getRange(2,1, IDData.length).setValues(IDData);
  sheet.getRange(2,2, addressData.length).setValues(addressData);


  sheet.getRange(2,3, level1nameData.length).setValues(level1nameData);
  sheet.getRange(2,4, level2nameData.length).setValues(level2nameData);
  sheet.getRange(2,5, level3nameData.length).setValues(level3nameData);
  sheet.getRange(2,6, level4nameData.length).setValues(level4nameData);
  sheet.getRange(2,7, level5nameData.length).setValues(level5nameData);
  sheet.getRange(2,8, level6nameData.length).setValues(level6nameData);
  sheet.getRange(2,9, level7nameData.length).setValues(level7nameData);
  sheet.getRange(2,10, level8nameData.length).setValues(level8nameData);
  sheet.getRange(2,11, level9nameData.length).setValues(level9nameData);
  sheet.getRange(2,12, level10nameData.length).setValues(level10nameData);
  sheet.getRange(2,13, level11nameData.length).setValues(level11nameData);

  sheet.getRange(2,15, level1idData.length).setValues(level1idData);
  sheet.getRange(2,16, level2idData.length).setValues(level2idData);
  sheet.getRange(2,17, level3idData.length).setValues(level3idData);
  sheet.getRange(2,18, level4idData.length).setValues(level4idData);
  sheet.getRange(2,19, level5idData.length).setValues(level5idData);
  sheet.getRange(2,20, level6idData.length).setValues(level6idData);
  sheet.getRange(2,21, level7idData.length).setValues(level7idData);
  sheet.getRange(2,22, level8idData.length).setValues(level8idData);
  sheet.getRange(2,23, level9idData.length).setValues(level9idData);
  sheet.getRange(2,24, level10idData.length).setValues(level10idData);
  sheet.getRange(2,25, level11idData.length).setValues(level11idData);
}
function showAbout(){
  Browser.msgBox('This add-on is powered by SMS (Semantically Mapping Science) platform. More information is available at http://sms.risis.eu');
}
