// The onOpen function is executed automatically every time a Spreadsheet is loaded
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [];

    menuEntries.push({
        name: "Step 1. Initialize",
        functionName: "createSpreadsheets"
    });
    menuEntries.push(null); // line separator
    menuEntries.push({
        name: "Step 2. Geocode addresses",
        functionName: "geoCodeAddresses"
    });
    menuEntries.push(null); // line separator
    menuEntries.push({
        name: "Step 3. Find GADM boundaries",
        functionName: "findGADMBoundaries"
    });
    menuEntries.push({
        name: "Step 3. Find Flickr boundaries",
        functionName: "findFlickrBoundaries"
    });
    menuEntries.push({
        name: "Step 3. Find OSM boundaries",
        functionName: "findOSMBoundaries"
    });
    menuEntries.push(null); // line separator
    menuEntries.push({
        name: "Step 4. Find OECD FUAs using Google",
        functionName: "findOECDFUAsFromGoogle"
    });
    menuEntries.push({
        name: "Step 4. Find OECD FUAs using GADM",
        functionName: "findOECDFUAsFromGADM"
    });
    menuEntries.push({
        name: "Step 4. Find OECD FUAs using Flickr",
        functionName: "findOECDFUAsFromFlickr"
    });
    menuEntries.push({
        name: "Step 4. Find OECD FUAs using OSM",
        functionName: "findOECDFUAsFromOSM"
    });
    menuEntries.push(null); // line separator
    menuEntries.push({
        name: "Add Metadata for OSM levels",
        functionName: "generateOSMMetadata"
    });
    menuEntries.push({
        name: "Export Boundaries as GeoJSON",
        functionName: "exportBoundariesGeoJSON"
    });

    menuEntries.push(null); // line separator
    menuEntries.push({
        name: "About SMS Platform",
        functionName: "showAbout"
    });
    ss.addMenu("SMS Web Services", menuEntries);
}

function createSpreadsheets() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    ss.insertSheet('api config', 0);
    var configSheet = ss.getSheetByName('api config');
    configSheet.setTabColor("ff0000");
    configSheet.getRange('A1:B1').setValues([
        ['parameter', 'value']
    ]).setFontWeight("bold");
    configSheet.getRange('A2:B2').setValues([
        ['googleAPIKey', 'replace this with your Google Geocoding API key']
    ]).setWrap(true);
    configSheet.getRange('A3:B3').setValues([
        ['smsKey', 'replace this with your SMS API key']
    ]).setWrap(true);
    configSheet.getRange('A4:B4').setValues([
        ['osmExternalService', 'none']
    ]).setWrap(true);
    configSheet.getRange('A5:B5').setValues([
        ['geojsonExportSource', 'none']
    ]).setWrap(true);
    configSheet.getRange('A6:B6').setValues([
        ['geojsonExportLevel', 'none']
    ]).setWrap(true);

    ss.insertSheet('geocoding', 1);
    var geocodingSheet = ss.getSheetByName('geocoding');
    geocodingSheet.getRange('A1:H1').setValues([
        ['ID', 'address', 'longitude', 'latitude', 'countryShort', 'countryLong', 'localityShort', 'localityLong']
    ]).setFontWeight("bold");
    geocodingSheet.getRange('A2:B2').setValues([
        ['1', 'Vrije Universiteit Amsterdam']
    ]).setWrap(true);

    ss.insertSheet('GADM boundaries', 2);
    var gadmSheet = ss.getSheetByName('GADM boundaries');
    gadmSheet.getRange('A1:O1').setValues([
        ['ID', 'address', 'level_0_name', 'level_1_name', 'level_2_name', 'level_3_name', 'level_4_name', 'level_5_name', '', 'level_0_id', 'level_1_id', 'level_2_id', 'level_3_id', 'level_4_id', 'level_5_id']
    ]).setFontWeight("bold");


    ss.insertSheet('Flickr boundaries', 3);
    var flickrSheet = ss.getSheetByName('Flickr boundaries');
    flickrSheet.getRange('A1:M1').setValues([
        ['ID', 'address', 'level_1_name', 'level_2_name', 'level_3_name', 'level_4_name', 'level_5_name', '', 'level_1_id', 'level_2_id', 'level_3_id', 'level_4_id', 'level_5_id']
    ]).setFontWeight("bold");

    ss.insertSheet('OSM boundaries', 4);
    var osmSheet = ss.getSheetByName('OSM boundaries');
    osmSheet.getRange('A1:Y1').setValues([
        ['ID', 'address', 'level_1_name', 'level_2_name', 'level_3_name', 'level_4_name', 'level_5_name', 'level_6_name', 'level_7_name', 'level_8_name', 'level_9_name', 'level_10_name', 'level_11_name', '', 'level_1_id', 'level_2_id', 'level_3_id', 'level_4_id', 'level_5_id', 'level_6_id', 'level_7_id', 'level_8_id', 'level_9_id', 'level_10_id', 'level_11_id']
    ]).setFontWeight("bold");

    ss.insertSheet('OSM metadata', 5);
    var osmmSheet = ss.getSheetByName('OSM metadata');
    osmmSheet.getRange('A1:L1').setValues([
        ['country', 'level_1', 'level_2', 'level_3', 'level_4', 'level_5', 'level_6', 'level_7', 'level_8', 'level_9', 'level_10', 'level_11']
    ]).setFontWeight("bold");

}

function getCountryFromGoogleAPIResult(address_components) {
    var shortName = '',
        longName = '';
    address_components.forEach(function(el) {
        if (el.types.indexOf('country') != -1) {
            shortName = el.short_name;
            longName = el.long_name;
        }
    });
    return {
        shortName: shortName,
        longName: longName
    };
}

function getLocalityFromGoogleAPIResult(address_components) {
    var shortName = '',
        longName = '';
    address_components.forEach(function(el) {
        if (el.types.indexOf('locality') != -1) {
            shortName = el.short_name;
            longName = el.long_name;
        }
    });
    return {
        shortName: shortName,
        longName: longName
    };
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
    var readyResponse;
    var checkIfValue;

    for (var i = 0; i < locationInfo.length; i++) {
        readyResponse = {};
        checkIfValue = sheet.getRange(i + 2, 3, 1, 3).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][0] != '' && checkIfValue[0][1] != '' && checkIfValue[0][2] != '') {
            continue;
        }
        //call SMS APIs
        googleGeoCodeAPI = 'http://sms.risis.eu/api/geo.googleGeocode;apiKey=' + googleAPIKey + ';addr=' + encodeURIComponent(locationInfo[i])
        googleResponse = UrlFetchApp.fetch(googleGeoCodeAPI);
        parsedResponse = JSON.parse(googleResponse);
        if (parsedResponse.resources.results.length) {
            readyResponse = {
                'lng': parsedResponse.resources.results[0].geometry.location.lng,
                'lat': parsedResponse.resources.results[0].geometry.location.lat,
                'country': getCountryFromGoogleAPIResult(parsedResponse.resources.results[0].address_components),
                'locality': getLocalityFromGoogleAPIResult(parsedResponse.resources.results[0].address_components)
            };
            //add data to the spreadsheet right after it is received
            sheet.getRange(i + 2, 3, 1, 6).setValues([
                [readyResponse.lng, readyResponse.lat, readyResponse.country.shortName, readyResponse.country.longName, (readyResponse.locality ? readyResponse.locality.shortName : ''), (readyResponse.locality ? readyResponse.locality.longName : '')]
            ]);
        }

    }
}

function parseLevels(source, arr) {
    var output = new Array();
    var appLink = '';

    if (source == 'GADM') {
        appLink = 'http://sms.risis.eu/demos/geo/GADM28Admin';
        output[0] = [];
        output[1] = [];
        output[2] = [];
        output[3] = [];
        output[4] = [];
        output[5] = [];
    } else if (source == 'Flickr') {
        appLink = 'http://sms.risis.eu/demos/geo/FlickrAdmin';
        output[1] = [];
        output[2] = [];
        output[3] = [];
        output[4] = [];
        output[5] = [];
    } else if (source == 'OSM') {
        appLink = 'http://sms.risis.eu/demos/geo/OSMAdmin';
        output[1] = [];
        output[2] = [];
        output[3] = [];
        output[4] = [];
        output[5] = [];
        output[6] = [];
        output[7] = [];
        output[8] = [];
        output[9] = [];
        output[10] = [];
        output[11] = [];
    }
    for (var i = 0; i < arr.length; i++) {
        if (output[arr[i].level]) {
            output[arr[i].level].push({
                'id': arr[i].id,
                'title': arr[i].title,
                'appLink': appLink
            });
        }
    }
    return output;
}
//name = title
function joinSameAdminLevels(levelArr) {
    var outputIDs = new Array();
    var outputAppLinks = new Array();
    var outputNames = new Array();
    for (var i = 0; i < levelArr.length; i++) {
        outputIDs.push(levelArr[i].id);
        outputNames.push(levelArr[i].title);
        outputAppLinks.push(levelArr[i].appLink);
    }
    return {
        'ids': outputIDs.length > 1 ? '=HYPERLINK("' + outputAppLinks[0] + '/multi/' + encodeURIComponent(outputIDs.join('|')) + '","' + outputIDs.join(' | ') + '")' : (outputIDs[0] ? '=HYPERLINK("' + outputAppLinks[0] + '/' + outputIDs[0] + '","' + outputIDs[0] + '")' : ''),
        'names': outputNames.join(' | ')
    };
}

function findGADMBoundaries() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
    // Select the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GADM boundaries');

    var smsAPI;
    var smsResponse;
    var parsedResponse;
    var readyResponse;
    var checkIfValue;
    var prasedLevels = new Array();
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

    for (var i = 0; i < locationInfo.length; i++) {
        readyResponse = {};
        prasedLevels = [];
        checkIfValue = sheet.getRange(i + 2, 1, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }
        //call SMS API
        smsAPI = 'http://sms.risis.eu/api/geo.PointToGADM28Admin;lat=' + locationInfo[i][3] + ';long=' + locationInfo[i][2] + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
        smsResponse = UrlFetchApp.fetch(smsAPI);
        parsedResponse = JSON.parse(smsResponse);
        readyResponse = {
            'ID': locationInfo[i][0],
            'address': locationInfo[i][1],
            'levels': parsedResponse.resources
        };
        prasedLevels = parseLevels('GADM', readyResponse.levels);
        sheet.getRange(i + 2, 1, 1, 15).setValues([
            [readyResponse.ID, readyResponse.address, joinSameAdminLevels(prasedLevels[0]).names, joinSameAdminLevels(prasedLevels[1]).names, joinSameAdminLevels(prasedLevels[2]).names, joinSameAdminLevels(prasedLevels[3]).names, joinSameAdminLevels(prasedLevels[4]).names, joinSameAdminLevels(prasedLevels[5]).names, '', joinSameAdminLevels(prasedLevels[0]).ids, joinSameAdminLevels(prasedLevels[1]).ids, joinSameAdminLevels(prasedLevels[2]).ids, joinSameAdminLevels(prasedLevels[3]).ids, joinSameAdminLevels(prasedLevels[4]).ids, joinSameAdminLevels(prasedLevels[5]).ids]
        ]);

    }
}

function findFlickrBoundaries() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
    // Select the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Flickr boundaries');

    var smsAPI;
    var smsResponse;
    var parsedResponse;
    var readyResponse;
    var checkIfValue;
    var prasedLevels = new Array();

    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

    for (var i = 0; i < locationInfo.length; i++) {
        readyResponse = {};
        prasedLevels = [];
        checkIfValue = sheet.getRange(i + 2, 1, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }
        //call SMS API
        smsAPI = 'http://sms.risis.eu/api/geo.PointToFlickrAdmin;lat=' + locationInfo[i][3] + ';long=' + locationInfo[i][2] + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
        smsResponse = UrlFetchApp.fetch(smsAPI);
        parsedResponse = JSON.parse(smsResponse);
        readyResponse = {
            'ID': locationInfo[i][0],
            'address': locationInfo[i][1],
            'levels': parsedResponse.resources
        };
        prasedLevels = parseLevels('Flickr', readyResponse.levels);
        sheet.getRange(i + 2, 1, 1, 13).setValues([
            [readyResponse.ID, readyResponse.address, joinSameAdminLevels(prasedLevels[1]).names, joinSameAdminLevels(prasedLevels[2]).names, joinSameAdminLevels(prasedLevels[3]).names, joinSameAdminLevels(prasedLevels[4]).names, joinSameAdminLevels(prasedLevels[5]).names, '', joinSameAdminLevels(prasedLevels[1]).ids, joinSameAdminLevels(prasedLevels[2]).ids, joinSameAdminLevels(prasedLevels[3]).ids, joinSameAdminLevels(prasedLevels[4]).ids, joinSameAdminLevels(prasedLevels[5]).ids]
        ]);
    }
}

function generateOSMMetadata() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
    // Select the sheet
    var metadataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM metadata');
    var smsAPI;
    var smsResponse;
    var parsedResponse;
    var metadataResponse = {};
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

    for (var i = 0; i < locationInfo.length; i++) {

        //collect OSM metadata per country if needed
        if (!metadataResponse[locationInfo[i][4]]) {
            smsAPI = 'http://sms.risis.eu/api/geo.OSMAdminMetadata;country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
            smsResponse = UrlFetchApp.fetch(smsAPI);
            parsedResponse = JSON.parse(smsResponse);
            metadataResponse[locationInfo[i][4]] = parsedResponse;
        }
    }
    var counter = 2;
    for (var prop in metadataResponse) {
        metadataSheet.getRange(counter, 1, 1, 12).setValues([
            [prop, metadataResponse[prop].resource.level1, metadataResponse[prop].resource.level2, metadataResponse[prop].resource.level3, metadataResponse[prop].resource.level4, metadataResponse[prop].resource.level5, metadataResponse[prop].resource.level6, metadataResponse[prop].resource.level7, metadataResponse[prop].resource.level8, metadataResponse[prop].resource.level9, metadataResponse[prop].resource.level10, metadataResponse[prop].resource.level11]
        ]);
        counter++;
    }
}

function findOSMBoundaries() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var osmExternalService = configSheet.getRange(4, 2).getValues()[0];
    var locSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('geocoding');
    // Select the sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM boundaries');
    var metadataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM metadata');

    var smsAPI;
    var smsResponse;
    var parsedResponse;
    var readyResponse;
    var checkIfValue;
    var prasedLevels = new Array();


    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();

    for (var i = 0; i < locationInfo.length; i++) {
        readyResponse = {};
        prasedLevels = [];
        checkIfValue = sheet.getRange(i + 2, 1, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }

        //call SMS API
        smsAPI = 'http://sms.risis.eu/api/geo.PointToOSMAdmin;lat=' + locationInfo[i][3] + ';long=' + locationInfo[i][2] + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
        if (osmExternalService !== 'undefined' && osmExternalService !== '' && osmExternalService !== 'none') {
            smsAPI = smsAPI + ';useExternal=' + osmExternalService;
        }

        smsResponse = UrlFetchApp.fetch(smsAPI);

        parsedResponse = JSON.parse(smsResponse);
        readyResponse = {
            'ID': locationInfo[i][0],
            'address': locationInfo[i][1],
            'levels': parsedResponse.resources
        };
        prasedLevels = parseLevels('OSM', readyResponse.levels);
        sheet.getRange(i + 2, 1, 1, 25).setValues([
            [readyResponse.ID, readyResponse.address, joinSameAdminLevels(prasedLevels[1]).names, joinSameAdminLevels(prasedLevels[2]).names, joinSameAdminLevels(prasedLevels[3]).names, joinSameAdminLevels(prasedLevels[4]).names, joinSameAdminLevels(prasedLevels[5]).names, joinSameAdminLevels(prasedLevels[6]).names, joinSameAdminLevels(prasedLevels[7]).names, joinSameAdminLevels(prasedLevels[8]).names, joinSameAdminLevels(prasedLevels[9]).names, joinSameAdminLevels(prasedLevels[10]).names, joinSameAdminLevels(prasedLevels[11]).names, '', joinSameAdminLevels(prasedLevels[1]).ids, joinSameAdminLevels(prasedLevels[2]).ids, joinSameAdminLevels(prasedLevels[3]).ids, joinSameAdminLevels(prasedLevels[4]).ids, joinSameAdminLevels(prasedLevels[5]).ids, joinSameAdminLevels(prasedLevels[6]).ids, joinSameAdminLevels(prasedLevels[7]).ids, joinSameAdminLevels(prasedLevels[8]).ids, joinSameAdminLevels(prasedLevels[9]).ids, joinSameAdminLevels(prasedLevels[10]).ids, joinSameAdminLevels(prasedLevels[11]).ids]
        ]);
    }
}

function processFUAList(arr) {
    var out = {};
    for (var i = 0; i < arr.length; i++) {
        if (!out[arr[i].funactionalUrbanArea.code]) {
            out[arr[i].funactionalUrbanArea.code] = arr[i];
        }
    }

    var outputNames = new Array();
    var outputIDs = new Array();
    var mcpIDs = new Array();
    var mcpNames = new Array();
    var isCoreArrs = new Array();
    for (var prop in out) {
        outputNames.push(out[prop].funactionalUrbanArea.name);
        outputIDs.push(out[prop].funactionalUrbanArea.code);
        mcpIDs.push(out[prop].id);
        mcpNames.push(out[prop].name);
        isCoreArrs.push(out[prop].isCore);
    }
    var appLink = 'http://sms.risis.eu/demos/geo/Municipality';
    return {

        'names': outputNames.join(' | '),
        'ids': outputIDs.join(' | '),
        'mapIDs': mcpIDs.length > 1 ? '=HYPERLINK("' + appLink + '/multi/' + encodeURIComponent(mcpIDs.join('|')) + '","' + mcpIDs.join(' | ') + '")' : (mcpIDs[0] ? '=HYPERLINK("' + appLink + '/' + mcpIDs[0] + '","' + mcpIDs[0] + '")' : ''),
        'mcpNames': mcpNames.join(' | '),
        'isCoreArrs': isCoreArrs.join(' | ')
    };
}

function findOECDFUAsFromOSM() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var configSheet = ss.getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = ss.getSheetByName('geocoding');
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();
    var smsAPI, smsResponse, parsedResponse;
    var smsResponses = new Array();
    var processedFUAs = {};
    var checkIfValue;
    var osmSheet = ss.getSheetByName('OSM boundaries');
    var osmInfo = osmSheet.getRange(2, 1, osmSheet.getLastRow() - 1, osmSheet.getLastColumn() - 1).getValues();
    var ftmp = new Array();
    var ftmp2 = new Array();
    osmSheet.getRange('AA1:AE1').setValues([
        ['OECD_FUA_name', 'OECD_FUA_id', 'Municipality_name', 'Municipality_id', 'is_core?']
    ]).setFontWeight("bold");

    for (var i = 0; i < osmInfo.length; i++) {
        checkIfValue = osmSheet.getRange(i + 2, 27, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }
        //range of corresponding boundaries
        smsResponses = new Array();
        for (var j = 1; j < 8; j++) {
            //call SMS API
            if (osmInfo[i][5 + j - 1] !== 'undefined') {

                // we have to handle multiple values separated by |
                ftmp = osmInfo[i][5 + j - 1].split('|');
                if (ftmp.length) {
                    for (var k = 0; k < ftmp.length; k++) {
                        ftmp2 = ftmp[k].split(',');
                        if (ftmp2[0].trim()) {
                            smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(ftmp2[0].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
                            smsResponse = UrlFetchApp.fetch(smsAPI);
                            //Browser.msgBox(smsAPI+ '->'+smsResponse);
                            parsedResponse = JSON.parse(smsResponse);
                            if (parsedResponse.resources.length) {
                                smsResponses.push(parsedResponse.resources[0]);
                            }
                        }
                    }
                } else {
                    //we only have to get the first part for flickr
                    ftmp = osmInfo[i][5 + j - 1].split(',');
                    if (ftmp[0].trim()) {
                        smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(ftmp[0].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
                        smsResponse = UrlFetchApp.fetch(smsAPI);
                        //Browser.msgBox(smsAPI+ '->'+smsResponse);
                        parsedResponse = JSON.parse(smsResponse);
                        if (parsedResponse.resources.length) {
                            smsResponses.push(parsedResponse.resources[0]);
                        }
                    }
                }
            }
        }
        //finalize FUA
        //Browser.msgBox(smsResponses[0]);
        processedFUAs = processFUAList(smsResponses);
        //Browser.msgBox(processedFUAs.names +'  '+ processedFUAs.ids);
        osmSheet.getRange(i + 2, 27, 1, 5).setValues([
            [processedFUAs.names, processedFUAs.ids, processedFUAs.mcpNames, processedFUAs.mapIDs, processedFUAs.isCoreArrs]
        ]);
    }


}

function findOECDFUAsFromFlickr() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var configSheet = ss.getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = ss.getSheetByName('geocoding');
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();
    var smsAPI, smsResponse, parsedResponse;
    var smsResponses = new Array();
    var processedFUAs = {};
    var checkIfValue;

    var flickrSheet = ss.getSheetByName('Flickr boundaries');
    var flickrInfo = flickrSheet.getRange(2, 1, flickrSheet.getLastRow() - 1, flickrSheet.getLastColumn() - 1).getValues();
    var ftmp = new Array();
    var ftmp2 = new Array();
    flickrSheet.getRange('O1:S1').setValues([
        ['OECD_FUA_name', 'OECD_FUA_id', 'Municipality_name', 'Municipality_id', 'is_core?']
    ]).setFontWeight("bold");

    for (var i = 0; i < flickrInfo.length; i++) {
        checkIfValue = flickrSheet.getRange(i + 2, 15, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }
        //range of corresponding boundaries
        smsResponses = new Array();
        for (var j = 1; j < 4; j++) {
            //call SMS API
            if (flickrInfo[i][4 + j - 1] !== 'undefined') {

                // we have to handle multiple values separated by |
                ftmp = flickrInfo[i][4 + j - 1].split('|');
                if (ftmp.length) {
                    for (var k = 0; k < ftmp.length; k++) {
                        ftmp2 = ftmp[k].split(',');
                        smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(ftmp2[0].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
                        smsResponse = UrlFetchApp.fetch(smsAPI);
                        //Browser.msgBox(smsAPI+ '->'+smsResponse);
                        parsedResponse = JSON.parse(smsResponse);
                        if (parsedResponse.resources.length) {
                            smsResponses.push(parsedResponse.resources[0]);
                        }
                    }
                } else {
                    //we only have to get the first part for flickr
                    ftmp = flickrInfo[i][4 + j - 1].split(',');

                    smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(ftmp[0].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
                    smsResponse = UrlFetchApp.fetch(smsAPI);
                    //Browser.msgBox(smsAPI+ '->'+smsResponse);
                    parsedResponse = JSON.parse(smsResponse);
                    if (parsedResponse.resources.length) {
                        smsResponses.push(parsedResponse.resources[0]);
                    }
                }
            }
        }
        //finalize FUA
        //Browser.msgBox(smsResponses[0]);
        processedFUAs = processFUAList(smsResponses);
        //Browser.msgBox(processedFUAs.names +'  '+ processedFUAs.ids);
        flickrSheet.getRange(i + 2, 15, 1, 5).setValues([
            [processedFUAs.names, processedFUAs.ids, processedFUAs.mcpNames, processedFUAs.mapIDs, processedFUAs.isCoreArrs]
        ]);

    }
}

function findOECDFUAsFromGADM() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var configSheet = ss.getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = ss.getSheetByName('geocoding');
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();
    var smsAPI, smsResponse, parsedResponse;
    var smsResponses = new Array();
    var processedFUAs = {};
    var gadmSheet = ss.getSheetByName('GADM boundaries');
    var gadmInfo = gadmSheet.getRange(2, 1, gadmSheet.getLastRow() - 1, gadmSheet.getLastColumn() - 1).getValues();
    var checkIfValue;
    gadmSheet.getRange('Q1:U1').setValues([
        ['OECD_FUA_name', 'OECD_FUA_id', 'Municipality_name', 'Municipality_id', 'is_core?']
    ]).setFontWeight("bold");

    for (var i = 0; i < gadmInfo.length; i++) {
        checkIfValue = gadmSheet.getRange(i + 2, 17, 1, 2).getValues();
        //only send requests for the ones which are not processed yet
        if (checkIfValue[0][1] != '') {
            continue;
        }
        //range of corresponding boundaries
        smsResponses = new Array();
        for (var j = 1; j < 5; j++) {
            //call SMS API
            if (gadmInfo[i][4 + j - 1] !== 'undefined') {
                smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(gadmInfo[i][(4 + j - 1)].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
                smsResponse = UrlFetchApp.fetch(smsAPI);
                //Browser.msgBox(smsResponse);
                parsedResponse = JSON.parse(smsResponse);
                if (parsedResponse.resources.length) {
                    smsResponses.push(parsedResponse.resources[0]);
                }
            }
        }
        //finalize FUA
        //Browser.msgBox(smsResponses[0]);
        processedFUAs = processFUAList(smsResponses);
        //Browser.msgBox(processedFUAs.names +'  '+ processedFUAs.ids);
        gadmSheet.getRange(i + 2, 17, 1, 5).setValues([
            [processedFUAs.names, processedFUAs.ids, processedFUAs.mcpNames, processedFUAs.mapIDs, processedFUAs.isCoreArrs]
        ]);

    }
}

function findOECDFUAsFromGoogle() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var configSheet = ss.getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var locSheet = ss.getSheetByName('geocoding');
    var locationInfo = locSheet.getRange(2, 1, locSheet.getLastRow() - 1, locSheet.getLastColumn() - 1).getValues();
    var smsAPI, smsResponse, parsedResponse;
    var smsResponses = new Array();
    var processedFUAs = {};
    var checkIfValue;
    locSheet.getRange('J1:N1').setValues([
        ['OECD_FUA_name', 'OECD_FUA_id', 'Municipality_name', 'Municipality_id', 'is_core?']
    ]).setFontWeight("bold");

    for (var i = 0; i < locationInfo.length; i++) {
        checkIfValue = locSheet.getRange(i + 2, 10, 1, 2).getValues();
        if (checkIfValue[0][1] != '') {
            continue;
        }
        smsResponses = new Array();
        if (locationInfo[i][6] !== 'undefined') {
            smsAPI = 'http://sms.risis.eu/api/geo.BoundaryToOECDFUA;name=' + encodeURIComponent(locationInfo[i][(6)].trim()) + ';country=' + locationInfo[i][4] + ';smsKey=' + smsAPIKey;
            smsResponse = UrlFetchApp.fetch(smsAPI);
            //Browser.msgBox(smsResponse);
            parsedResponse = JSON.parse(smsResponse);
            if (parsedResponse.resources.length) {
                smsResponses.push(parsedResponse.resources[0]);
            }
        }

        processedFUAs = processFUAList(smsResponses);
        locSheet.getRange(i + 2, 10, 1, 5).setValues([
            [processedFUAs.names, processedFUAs.ids, processedFUAs.mcpNames, processedFUAs.mapIDs, processedFUAs.isCoreArrs]
        ]);

    }
}

function exportBoundariesGeoJSON() {
    var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('api config');
    var smsAPIKey = configSheet.getRange(3, 2).getValues()[0];
    var geojsonExportSource = configSheet.getRange(5, 2).getValues()[0];
    var geojsonExportLevel = configSheet.getRange(6, 2).getValues()[0];
    if (geojsonExportSource == 'undefined' || geojsonExportSource == '' || geojsonExportSource == 'none' || geojsonExportLevel == 'undefined' || geojsonExportLevel == '' || geojsonExportLevel == 'none') {
        Browser.msgBox("Go to api config sheet and set the right paramter values for geojsonExportSource and geojsonExportLevel e.g. GADM and 2");
        return 0;
    }
    var data = new Array();
    if (geojsonExportSource == "GADM") {
        var gadmSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GADM boundaries');
        var gadmInfo = gadmSheet.getRange(2, 1, gadmSheet.getLastRow() - 1, gadmSheet.getLastColumn() - 1).getValues();
        for (var i = 0; i < gadmInfo.length; i++) {
            checkIfValue = gadmSheet.getRange(i + 2, 10, 1, 6).getValues();
            //only send requests for the ones which are not processed yet
            if (checkIfValue[0][geojsonExportLevel] == '') {
                continue;
            };
            data.push({
                "id": checkIfValue[0][geojsonExportLevel],
                "relation":{"address_id": gadmSheet.getRange(i + 2, 1, 1, 1).getValue(), "address": gadmSheet.getRange(i + 2, 2, 1, 1).getValue()}
            })
        }
    }
    if (geojsonExportSource == "OSM") {
        var osmSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OSM boundaries');
        var osmInfo = osmSheet.getRange(2, 1, osmSheet.getLastRow() - 1, osmSheet.getLastColumn() - 1).getValues();
        for (var i = 0; i < osmInfo.length; i++) {
            checkIfValue = osmSheet.getRange(i + 2, 15, 1, 11).getValues();
            //only send requests for the ones which are not processed yet
            if (checkIfValue[0][parseInt(geojsonExportLevel) - 1] == '') {
                continue;
            };
            data.push({
                "id": checkIfValue[0][parseInt(geojsonExportLevel) - 1],
                "relation":{"address_id": osmSheet.getRange(i + 2, 1, 1, 1).getValue(), "address": osmSheet.getRange(i + 2, 2, 1, 1).getValue()}
            })
        }
    }
    if (geojsonExportSource == "Flickr") {
        var flickrSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Flickr boundaries');
        var flickrInfo = flickrSheet.getRange(2, 1, flickrSheet.getLastRow() - 1, flickrSheet.getLastColumn() - 1).getValues();
        for (var i = 0; i < flickrInfo.length; i++) {
            checkIfValue = flickrSheet.getRange(i + 2, 9, 1, 5).getValues();
            //only send requests for the ones which are not processed yet
            if (checkIfValue[0][parseInt(geojsonExportLevel) - 1] == '') {
                continue;
            };
            data.push({
              "id": checkIfValue[0][parseInt(geojsonExportLevel) - 1],
              "relation":{"address_id": flickrSheet.getRange(i + 2, 1, 1, 1).getValue(), "address": flickrSheet.getRange(i + 2, 2, 1, 1).getValue()}
            })
        }
    }
    var smsAPI = 'http://sms.risis.eu/demos/geo/exportToGeoJSON';
    var options = {
        "muteHttpExceptions": true,
        "method": "post",
        "payload": {
            "source": geojsonExportSource[0],
            "boundaries": JSON.stringify(data)
        }
    };
    //Browser.msgBox(JSON.stringify(options.payload));
    var smsResponse = UrlFetchApp.fetch(smsAPI, options);
    //Browser.msgBox(JSON.stringify(options.payload));
    Browser.msgBox(smsResponse);
}

function showAbout() {
    Browser.msgBox('This add-on is powered by SMS (Semantically Mapping Science) platform. More information is available at http://sms.risis.eu');
}
