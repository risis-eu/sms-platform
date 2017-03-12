'use strict';
class DBpediaUtil {
    constructor() {

    }
    parseDBpediaSpotlight(body) {
        let output = [];
        let desc = '',
            parsed = JSON.parse(body);
        if (!parsed) {
            return output;
        }
        let types = '';
        if (parsed.Resources && parsed.Resources.length) {
            parsed.Resources.forEach(function(el) {
                types = el['@types'];
                if (!types) {
                    types = 'DBpedia:Misc';
                }
                output.push({
                    uri: el['@URI'],
                    types: types.split(','),
                    surfaceForm: el['@surfaceForm'],
                    offset: el['@offset'],
                    similarityScore: el['@similarityScore'],
                    percentageOfSecondRank: el['@percentageOfSecondRank']
                });
            });
        }
        return output;
    }
    parseGoogleGeocoding(body) {
        let parsed = JSON.parse(body);
        let results = parsed.resources.results;
        let country;
        if(results.length){
            results[0].address_components.forEach((component)=>{
                if(component.types.indexOf('country') !== -1){
                    country = component.short_name;
                }
            });
            return {
                formattedAddress: results[0].formatted_address,
                country: country,
                longitude: results[0].geometry.location.lng,
                latitude: results[0].geometry.location.lat
            };
        }else{
            return 0;
        }
        return output;
    }
    parseDBpediaLookup(body) {
        let output = [];
        let desc = '',
            parsed = JSON.parse(body);
        if (!parsed) {
            return output;
        }
        parsed.results.forEach(function(el) {
            if (el.description && el.description.length > 150) {
                desc = el.description.substr(0, 150) + '...';
            } else {
                desc = '';
            }
            output.push({
                title: el.label,
                description: desc,
                uri: el.uri
            });
        });
        return output;
    }
    parseDBpediaCoordinates(body) {
        let output = [];
        let desc = '',
            parsed = JSON.parse(body);
        if (!parsed) {
            return output;
        }
        parsed.results.bindings.forEach(function(el, key) {
            output.push({
                position: {
                    lat: parseFloat(el.lat.value),
                    lng: parseFloat(el.long.value)
                },
                key: el.s.value
            });
        });
        return output;
    }
}
export default DBpediaUtil;
