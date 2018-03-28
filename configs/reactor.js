export default {
    // config = scope + spec
    // scope is one the 15 combination of dataset, resource, property and object
    config: {
        //---------depth 1------------
        dataset: {
            'generic': {
                resourceFocusType: [],
                //only allow to view data -> disable edit
                readOnly: 1,
                //used for pagination in resource list
                maxNumberOfResourcesOnPage: 20,
                datasetReactor: ['Dataset']
            },
            'http://rdf.risis.eu/sms/users.ttl#': {
                readOnly: 0
            },
            'metadata': {
                readOnly: 0
            },
            'http://ld-r.org/configurations': {
                readOnly: 0,
                allowResourceClone: 1,
                allowPropertyDelete: 1,
                allowResourceNew: 1,
                allowPropertyNew: 1,
                allowNewValue: 1,
                resourceFocusType: ['https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#ReactorConfig', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#ServerConfig','https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#FacetsPropertyConfig', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#FacetsConfig', 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#EnvState'],
                datasetLabel: ['LD-R Configurations'],
                resourceLabelProperty: ['http://www.w3.org/2000/01/rdf-schema#label']
            }
        },
        resource: {
            'generic': {
                //if enabled, will categorize properties in different tabs based on property categories
                usePropertyCategories: 0,
                //used when creating random resources
                dynamicResourceDomain: ['http://sms.risis.eu'],
                resourceReactor: ['Resource']
            },
            'http://rdfs.org/ns/void#Dataset': {
                treatAsResourceType: 1,
                //if enabled, will categorize properties in different tabs based on property categories
                usePropertyCategories: 1,
                propertyCategories: ['overview', 'people', 'date', 'legalAspects', 'access', 'technicalAspects', 'structuralAspects'],
                //used when creating random resources
                dynamicResourceDomain: ['http://risis.eu'],
                resourceReactor: ['MetadataResource']
            },
            'http://xmlns.com/foaf/0.1/Organization': {
                treatAsResourceType: 1,
                usePropertyCategories: 0

            },
            'http://xmlns.com/foaf/0.1/Person': {
                treatAsResourceType: 1,
                usePropertyCategories: 0
            },
            'http://rdf.risis.eu/metadata/Table': {
                treatAsResourceType: 1,
                usePropertyCategories: 0
            }
        },
        property: {
            'generic': {
                propertyReactor: ['IndividualProperty'],
                //following are object-based scope:
                objectReactor: ['IndividualObject'],
                //to view/edit individual object values
                objectIViewer: ['BasicIndividualView'],
                objectIEditor: ['BasicIndividualInput'],
                extendedOEditor: ['BasicIndividualDetailEdit'],
                extendedOViewer: ['BasicIndividualDetailView'],
                shortenURI: 1
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#cloneOf': {
                readOnly: 1,
                allowPropertyDelete: 0
            },
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                allowPropertyDelete: 0,
                objectIViewer: ['PrefixBasedView'],
                objectIEditor: ['PrefixBasedInput']
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#dataType': {
                allowPropertyDelete: 0,
                objectIViewer: ['PrefixBasedView'],
                objectIEditor: ['PrefixBasedInput']
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#createdBy' : {
                isHidden: 0,
                allowNewValue: 0,
                allowPropertyDelete: 0,
                readOnly: 1,
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#createdOn' : {
                isHidden: 0,
                allowNewValue: 0,
                allowPropertyDelete: 0,
                readOnly: 1,
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resourceQuery' : {
                decodeURIComponent: 1
            },
            'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#selection' : {
                decodeURIComponent: 1
            }
        },
        //property value = object
        object: {
            'generic': {
                truncateURI: 1
            }
        },
        //---------depth 2------------
        dataset_resource: {
            'http://rdf.risis.eu/sms/users.ttl#': {
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#User' :{
                    treatAsResourceType: 1,
                    resourceReactor: ['UserResource']
                }
            }
        },
        dataset_property: {
            'http://geo.risis.eu/cbs-nl': {
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_25_44_JR': {hint: ['Percentage personen 25 tot 45 jaar']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_45_64_JR': {hint: ['Percentage personen 45 tot 65 jaar']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_65_EO_JR': {hint: ['Percentage personen 65 jaar en ouder']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_ONGEHUWD': {hint: ['Percentage ongehuwd']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_GEHUWD': {hint: ['Percentage gehuwd']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_GESCHEID': {hint: ['Percentage gescheid']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_VERWEDUW': {hint: ['Percentage verweduwd']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/GEBOO_TOT': {hint: ['Geboorte totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_GEBOO': {hint: ['Geboorte relatief']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/STERFT_TOT': {hint: ['Sterfte totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_STERFT BEV_DICHTH': {hint: ['Sterfte relatief Bevolkingsdichtheid inwoners per km2']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AANTAL_HH': {hint: ['Aantal huishoudens']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_EENP_HH': {hint: ['Percentage   eenpersoonshuishoudens']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HH_Z_K': {hint: ['Percentage huishoudens zonder kinderen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HH_M_K': {hint: ['Percentage huishoudens met kinderen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/GEM_HH_GR': {hint: ['Gemiddelde   huishoudensgrootte']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_WEST_AL': {hint: ['Percentage westerse allochtonen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_N_W_AL': {hint: ['Percentage niet westerse allochtonen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_MAROKKO': {hint: ['Percentage uit Marokko']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_ANT_ARU': {hint: ['Percentage uit Nederlandse Antillen en Aruba']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_SURINAM': {hint: ['Percentage uit Suriname']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_TURKIJE': {hint: ['Percentage uit Turkije']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_OVER_NW': {hint: ['Percentage overige niet westerse allochtonen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BEDV': {hint: ['Aantal bedrijfsvestigingen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_A': {hint: ['Aantal bedrijven landbouw, bosbouw, visserij']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_BF': {hint: ['Aantal bedrijven nijverheid, energie']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_GI': {hint: ['Aantal bedrijven handel en horeca']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_HJ': {hint: ['Aantal bedrijven Vervoer, informatie, communicatie']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_KL': {hint: ['Aantal bedrijven financie��l, onroerend goed']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_MN': {hint: ['Aantal bedrijven zakelijke dienstverlening']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BED_RU': {hint: ['Aantal bedrijven cultuur, recreatie, overige']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/WONINGEN': {hint: ['Woningvoorraad']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/WOZ': {hint: ['Gemiddelde   woningwaarde']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/p_1gezw': {hint: ['Percentage   eengezinswoning']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/p_mgezw': {hint: ['Percentage   meergezinswoning']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_KOOPWON': {hint: ['Percentage   koopwoningen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HUURWON': {hint: ['Percentage   huurwoningen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_WONV2000': {hint: ['Percentage bouwjaarklasse vanaf 2000']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_WONT2000': {hint: ['Percentage bouwjaarklasse tot 2000']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HUKO_ONB': {hint: ['Percentage Woningen met eigendom onbekend']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_TOT': {hint: ['Gemiddeld gasverbruik totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_APP': {hint: ['Gemiddeld gasverbruik appartement ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_TUS ': {hint: ['Gemiddeld gasverbruik tussenwoning  ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_HOEK': {hint: ['Gemiddeld gasverbruik hoekwoning      ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_21K': {hint: ['Gemiddeld gasverbruik 2 onder 1 kap woning      ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_GAS_VRY': {hint: ['Gemiddeld gasverbruik vrijstaande woning']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/g_gas_hu': {hint: ['Gemiddeld gasverbruik huurwoning  ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/g_gas_ko': {hint: ['Gemiddeld gasverbruikkoopwoning  ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_STADVERW': {hint: ['Aandeel stadsverwarming   ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_TOT': {hint: ['Gemiddeld elektriciteitsverbruik totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_APP ': {hint: ['Gemiddeld elektriciteitsverbruik appartement']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_HOE ': {hint: ['elektriciteitsverbruik hoekwoning Gem elektriciteitsverbruik 2 onder']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_21K ': {hint: ['1 kap woning Gem elektriciteitsverbruik vrijstaande woning ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_VRY': {hint: ['Gemiddeld elektriciteitsverbruik huurwoning Gemiddeld  ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/G_ELEK_TUS': {hint: ['Gemiddeld elektriciteitsverbruik tussenwoning Gemiddeld ']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/g_ele_hu g_ele_ko': {hint: ['elektriciteitsverbruikkoopwoning']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AANT_INK2': {hint: ['Aantal inkomensontvangers']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/INK_ONTV2': {hint: ['Gemiddeld inkomen per inkomensontvanger']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/INK_INW2': {hint: ['Gemiddeld inkomen per inwoner']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_LAAGINKP': {hint: ['Percentage personen met laagste inkomen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HOOGINKP': {hint: ['Percentage personen met hoogste inkomen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_LAAGINKH': {hint: ['Percentage huishoudens met laagste inkomen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_HOOGINKH': {hint: ['Percentage huishoudens met hoogste inkomen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_LIK_HH': {hint: ['percentage huishoudens met een laag inkomen']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_SOCMINH': {hint: ['Perc huishoudens onder of rond sociaal minimum']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/P_ACTIEF': {hint: ['percentage actieven']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/WWB_UITTOT': {hint: ['Algemene bijstandsuitkeringen totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/a_soz_ow': {hint: ['Aantal personen met een AOW-uitkering totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AO_UIT_TOT': {hint: ['AO uitkeringen totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/WW_UIT_TOT': {hint: ['WW uitkeringen totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AUTO_TOT': {hint: ['Personenauto s totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AUTO_HH AUTO_LAND': {hint: ['Personenauto s per huishouden Personenauto s per km2']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/BEDR_AUTO': {hint: ['Bedrijfsmotorvoertuigen   totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/MOTOR_2W': {hint: ['Motortweewielers totaal']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_LFTJ6J': {hint: ['Aantal personenauto���s jonger dan 6 jaar']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_LFTO6J': {hint: ['Aantal personenauto���s 6 jaar en ouder']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BST_B': {hint: ['Aantal personenauto���s met brandstof benzine']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/A_BST_NB': {hint: ['Aantal personenauto���s met overige brandstof']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/OPP_TOT': {hint: ['Oppervlakte totaal in ha']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/OPP_LAND': {hint: ['Oppervlakte land in ha']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/OPP_WATER': {hint: ['Oppervlakte water in ha']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ARTSPR': {hint: ['Huisartsenpraktijk gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_ARTSPR': {hint: ['Huisartsenpraktijk gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_ARTSPR': {hint: ['Huisartsenpraktijk gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ARTSPR': {hint: ['Huisartsenpraktijk gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_APOTH': {hint: ['Apotheek gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ZIEK_I': {hint: ['Ziekenhuis incl buitenpolikliniek gem afst in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ZIEK_I': {hint: ['Ziekenhuis incl buitenpoli gem aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10ZIEK_I': {hint: ['Ziekenhuis incl buitenpoli gem aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20ZIEK_I': {hint: ['Ziekenhuis incl buitenpoli gem aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ZIEK_E': {hint: ['Ziekenhuis excl buitenpolikliniek gem afst in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ZIEK_E': {hint: ['Ziekenhuis excl buitenpoli gem aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10ZIEK_E': {hint: ['Ziekenhuis excl buitenpoli gem aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20ZIEK_E': {hint: ['Ziekenhuis excl buitenpoli gem aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_SUPERM': {hint: ['Grote supermarkt gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_SUPERM': {hint: ['Grote supermarkt gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_SUPERM': {hint: ['Grote supermarkt gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_SUPERM': {hint: ['Grote supermarkt gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_DAGLMD': {hint: ['Winkels ov. dagelijkse levensm. gem afst in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_DAGLMD': {hint: ['Winkels ov. dagel. levensm. gem aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_DAGLMD': {hint: ['Winkels ov. dagel. levensm. gem aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_DAGLMD': {hint: ['Winkels ov. dagel. levensm. gem aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_WARENH': {hint: ['Warenhuis gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_WARENH': {hint: ['Warenhuis gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10WARENH': {hint: ['Warenhuis gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20WARENH': {hint: ['Warenhuis gemiddeld aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_CAFE': {hint: ['Caf�� gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_CAFE': {hint: ['Caf�� gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_CAFE': {hint: ['Caf�� gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_CAFE': {hint: ['Caf�� gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_CAFTAR': {hint: ['Cafetaria gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_CAFTAR': {hint: ['Cafetaria gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_CAFTAR': {hint: ['Cafetaria gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_CAFTAR': {hint: ['Cafetaria gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_RESTAU': {hint: ['Restaurant gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_RESTAU': {hint: ['Restaurant gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_RESTAU': {hint: ['Restaurant gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_RESTAU': {hint: ['Restaurant gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_HOTEL': {hint: ['Hotel gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_HOTEL': {hint: ['Hotel gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10_HOTEL': {hint: ['Hotel gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20_HOTEL': {hint: ['Hotel gemiddeld aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_KDV': {hint: ['Kinderdagverblijf gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_KDV': {hint: ['Kinderdagverblijf gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_KDV': {hint: ['Kinderdagverblijf gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_KDV': {hint: ['Kinderdagverblijf gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_BSO': {hint: ['Buitenschoolse opvang gem afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_BSO': {hint: ['Buitenschoolse opvang gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_BSO': {hint: ['Buitenschoolse opvang gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_BSO': {hint: ['Buitenschoolse opvang gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ONDBAS': {hint: ['Basisonderwijs gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV1_ONDBAS': {hint: ['Basisonderwijs aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_ONDBAS': {hint: ['Basisonderwijs aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ONDBAS': {hint: ['Basisonderwijs aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ONDVRT': {hint: ['Voortgezet onderwijs gem afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_ONDVRT': {hint: ['Voortgezet onderwijs gemiddeld aantal binnen 1 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ONDVRT': {hint: ['Voortgezet onderwijs gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10ONDVRT': {hint: ['Voortgezet onderwijs gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ONDVMB': {hint: ['Vmbo gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_ONDVMB': {hint: ['Vmbo gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ONDVMB': {hint: ['Vmbo gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10ONDVMB': {hint: ['Vmbo gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ONDHV': {hint: ['Havo vwo gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV3_ONDHV': {hint: ['Havo vwo gemiddeld aantal binnen 3 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_ONDHV': {hint: ['Havo vwo gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10_ONDHV': {hint: ['Havo vwo gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_OPRITH': {hint: ['Oprit hoofdverkeersweg gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_TREINST': {hint: ['Treinstation gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_OVERST': {hint: ['Overstapstation gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_BIBLIO': {hint: ['Bibliotheek gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ZWEMB': {hint: ['Zwembad gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_IJSBAAN': {hint: ['Kunstijsbaan gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_PODIUM': {hint: ['Theater gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_PODIUM': {hint: ['Theater gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10PODIUM': {hint: ['Theater gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20PODIUM': {hint: ['Theater gemiddeld aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_BIOS': {hint: ['Bioscoop gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV5_BIOS': {hint: ['Bioscoop gemiddeld aantal binnen 5 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10_BIOS': {hint: ['Bioscoop gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20_BIOS': {hint: ['Bioscoop gemiddeld aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_SAUNA': {hint: ['Sauna gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ZONBNK': {hint: ['Zonnebank gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_ATTRAC': {hint: ['Attractiepark gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV10ATTRAC': {hint: ['Attractiepark gemiddeld aantal binnen 10 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV20ATTRAC': {hint: ['Attractiepark gemiddeld aantal binnen 20 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AV50ATTRAC': {hint: ['Attractiepark gemiddeld aantal binnen 50 km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_POP': {hint: ['Poppodium gemiddelde afstand in km']},
                'http://geo.risis.eu/vocabularyulary/cbs-nl/AF_BRANDW': {hint: ['Brandweerkazerne gemiddelde afstand in km']}
            },
            //for configuration manager
            'http://ld-r.org/configurations': {
                'http://www.w3.org/2000/01/rdf-schema#label': {
                    allowPropertyDelete: 0,
                    label: ['Description'],
                    allowNewValue: 0
                },
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                    isHidden: 0,
                    shortenURI: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#scope': {
                    hint: ['Determines the type of scope in LD-R'],
                    objectIEditor: ['BasicOptionInput'],
                    objectIViewer: ['BasicOptionView'],
                    options: [
                        {label: 'Dataset', value: 'D'},
                        {label: 'Resource', value: 'R'},
                        {label: 'Property', value: 'P'},
                        {label: 'Dataset-Resource', value: 'DR'},
                        {label: 'Dataset-Property', value: 'DP'},
                        {label: 'Resource-Property', value: 'RP'},
                        {label: 'Dataset-Resource-Property', value: 'DRP'},
                    ],
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#dataset': {
                    shortenURI: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property': {
                    shortenURI: 0,
                    objectIViewer: ['PrefixBasedView'],
                    objectIEditor: ['PrefixBasedInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resource': {
                    shortenURI: 0,
                    objectIViewer: ['PrefixBasedView'],
                    objectIEditor: ['PrefixBasedInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resourceFocusType': {
                    shortenURI: 0,
                    objectIViewer: ['PrefixBasedView'],
                    objectIEditor: ['PrefixBasedInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resourceLabelProperty': {
                    shortenURI: 0,
                    objectIViewer: ['PrefixBasedView'],
                    objectIEditor: ['PrefixBasedInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#constraint': {
                    label: ['Constraint'],
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#Constraint', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Type'],
                                objectIViewer: ['PrefixBasedView'],
                                objectIEditor: ['PrefixBasedInput']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property',
                                instances: [{value: 'http://exampleProperty.com', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Property'],
                                objectIViewer: ['PrefixBasedView'],
                                objectIEditor: ['PrefixBasedInput']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#object',
                                instances: [{value: 'value', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Object Value']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#enabled',
                                instances: [{value: '1', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Enabled'],
                                objectIViewer:['ToggleView'],
                                objectIEditor:['ToggleEdit'],
                                onValue: ['1'],
                                offValue: ['0'],
                            }
                        },
                    ]
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#config': {
                    label: ['Configuration'],
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#label',
                                instances: [{value: 'Label', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Label']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#FacetsPropertyConfig', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Type'],
                                objectIViewer: ['PrefixBasedView'],
                                objectIEditor: ['PrefixBasedInput']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property',
                                instances: [{value: 'http://example.com/prop1', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Property'],
                                objectIViewer: ['PrefixBasedView'],
                                objectIEditor: ['PrefixBasedInput']
                            }
                        }
                    ]
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#list': {
                    shortenURI: 0,
                    objectIViewer: ['PrefixBasedView'],
                    objectIEditor: ['PrefixBasedInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#treatAsResourceType': {
                    label: ['Treat as Resource Type'],
                    hint: ['If set to true, will consider resource URI as type URI for resource'],
                    objectIViewer:['ToggleView'],
                    objectIEditor:['ToggleEdit'],
                    onValue: ['1'],
                    offValue: ['0'],
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#useReasoning': {
                    label: ['Use Reasoning?'],
                    objectIViewer:['ToggleView'],
                    objectIEditor:['ToggleEdit'],
                    onValue: ['1'],
                    offValue: ['0'],
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#host': {
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#port': {
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#path': {
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#graphName': {
                    label: ['Graph Name'],
                    hint: ['use "default" to consider all graph names'],
                    allowNewValue: 0
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#endpointType': {
                    label: ['Endpoint Type'],
                    allowNewValue: 0,
                    objectIEditor: ['BasicOptionInput'],
                    objectIViewer: ['BasicOptionView'],
                    allowUserDefinedValue: 1,
                    options: [
                        {label: 'ClioPatria', value: 'cliopatria'},
                        {label: 'Virtuoso', value: 'virtuoso'},
                        {label: 'Stardog', value: 'stardog'},
			                  {label: 'Blazegraph', value: 'blazegraph'},
                        {label: 'Sesame', value: 'sesame'}
                    ]
                }
            },
            'http://wos.risis.eu': {
                'http://wos.risis.eu/vocabulary/FN': { label: 'File type' },
                'http://wos.risis.eu/vocabulary/VR': { label: 'File format version number' },
                'http://wos.risis.eu/vocabulary/PT': { label: 'Publication type (e.g., book, journal, book in series)' },
                'http://wos.risis.eu/vocabulary/AU': { label: 'Author(s)' },
                'http://wos.risis.eu/vocabulary/AF': { label: 'Author Full Name', viewer: ['BasicLinkedIndividualView'] },
                'http://wos.risis.eu/vocabulary/AR': { label: 'Article Number' },
                'http://wos.risis.eu/vocabulary/BN': { label: 'International Standard Book Number (ISBN)' },
                'http://wos.risis.eu/vocabulary/CA': { label: 'Group Authors' },
                'http://wos.risis.eu/vocabulary/TI': { label: 'Article title' },
                'http://wos.risis.eu/vocabulary/ED': { label: 'Editors' },
                'http://wos.risis.eu/vocabulary/SO': { label: 'Full source title' },
                'http://wos.risis.eu/vocabulary/HO': { label: 'International Standard Book Number (ISBN)' },
                'http://wos.risis.eu/vocabulary/LA': { label: 'Language' },
                'http://wos.risis.eu/vocabulary/DT': { label: 'Document type' },
                'http://wos.risis.eu/vocabulary/NR': { label: 'Cited reference count' },
                'http://wos.risis.eu/vocabulary/SN': { label: 'ISSN' },
                'http://wos.risis.eu/vocabulary/SP': { label: 'Conference Sponsors' },
                'http://wos.risis.eu/vocabulary/PU': { label: 'Publisher' },
                'http://wos.risis.eu/vocabulary/C1': { label: 'Author address' },
                'http://wos.risis.eu/vocabulary/CL': { label: 'Conference Location' },
                'http://wos.risis.eu/vocabulary/CY': { label: 'Conference Date' },
                'http://wos.risis.eu/vocabulary/CT': { label: 'Conference Title' },
                'http://wos.risis.eu/vocabulary/D2': { label: 'Book Digital Object Identifier (DOI)' },
                'http://wos.risis.eu/vocabulary/DE': {
                    label: 'Author keywords',
                    objectReactor: ['AggregateObject'],
                    objectAViewer: ['BasicAggregateView']
                },
                'http://wos.risis.eu/vocabulary/ID': {
                    label: 'KeyWords Plus',
                    objectReactor: ['AggregateObject'],
                    objectAViewer: ['BasicAggregateView']
                },
                'http://wos.risis.eu/vocabulary/AB': { label: 'Abstract' },
                'http://wos.risis.eu/vocabulary/CR': { label: 'Cited references', objectIViewer: ['BasicLinkedIndividualView'] },
                'http://wos.risis.eu/vocabulary/TC': { label: 'Times cited' },
                'http://wos.risis.eu/vocabulary/BP': { label: 'Beginning page' },
                'http://wos.risis.eu/vocabulary/BE': { label: 'Editors' },
                'http://wos.risis.eu/vocabulary/BA': { label: 'Book Authors' },
                'http://wos.risis.eu/vocabulary/EP': { label: 'Ending page' },
                'http://wos.risis.eu/vocabulary/PG': { label: 'Page count' },
                'http://wos.risis.eu/vocabulary/JI': { label: 'ISO source title abbreviation' },
                'http://wos.risis.eu/vocabulary/SE': { label: 'Book series title' },
                'http://wos.risis.eu/vocabulary/BS': { label: 'Book series subtitle' },
                'http://wos.risis.eu/vocabulary/PY': { label: 'Publication year' },
                'http://wos.risis.eu/vocabulary/P2': { label: 'Chapter Count (Book Citation Index)' },
                'http://wos.risis.eu/vocabulary/PD': { label: 'Publication date' },
                'http://wos.risis.eu/vocabulary/VL': { label: 'Volume' },
                'http://wos.risis.eu/vocabulary/IS': { label: 'Issue' },
                'http://wos.risis.eu/vocabulary/PN': { label: 'Part number' },
                'http://wos.risis.eu/vocabulary/SU': { label: 'Supplement' },
                'http://wos.risis.eu/vocabulary/SI': { label: 'Special issue' },
                'http://wos.risis.eu/vocabulary/GA': { label: 'ISI document delivery number' },
                'http://wos.risis.eu/vocabulary/GP': { label: 'Book Group Authors' },
                'http://wos.risis.eu/vocabulary/PI': { label: 'Publisher city' },
                'http://wos.risis.eu/vocabulary/WP': { label: 'Publisher web address' },
                'http://wos.risis.eu/vocabulary/RP': { label: 'Reprint address' },
                'http://wos.risis.eu/vocabulary/CP': { label: 'Cited patent' },
                'http://wos.risis.eu/vocabulary/J9': { label: '29-character source title abbreviation' },
                'http://wos.risis.eu/vocabulary/PA': { label: 'Publisher address' },
                'http://wos.risis.eu/vocabulary/UT': { label: 'Unique Tag (ISI unique article identifier)' },
                'http://wos.risis.eu/vocabulary/DI': { label: 'Digital Object Identifier (DOI)' },
                'http://wos.risis.eu/vocabulary/EM': { label: 'Email address' },
                'http://wos.risis.eu/vocabulary/FU': { label: 'Funding Agency and Grant Number' },
                'http://wos.risis.eu/vocabulary/SC': { label: 'Subject Category' },
                'http://wos.risis.eu/vocabulary/FX': { label: 'Funding Text' },
                'http://wos.risis.eu/vocabulary/WC': { label: 'Web of Science Category' },
                'http://wos.risis.eu/vocabulary/Z9': { label: 'Total Times Cited Count (WoS, BCI, and CSCD)' },
                'http://wos.risis.eu/vocabulary/ER': { label: 'End of record' },
                'http://wos.risis.eu/vocabulary/EF': { label: 'End of file' }
            },
            'https://wos.risis.eu/uvavu': {
                'http://wos.risis.eu/vocabulary/FN': { label: 'File type' },
                'http://wos.risis.eu/vocabulary/VR': { label: 'File format version number' },
                'http://wos.risis.eu/vocabulary/PT': { label: 'Publication type (e.g., book, journal, book in series)' },
                'http://wos.risis.eu/vocabulary/AU': { label: 'Author(s)' },
                'http://wos.risis.eu/vocabulary/AF': { label: 'Author Full Name', viewer: ['BasicLinkedIndividualView'] },
                'http://wos.risis.eu/vocabulary/AR': { label: 'Article Number' },
                'http://wos.risis.eu/vocabulary/BN': { label: 'International Standard Book Number (ISBN)' },
                'http://wos.risis.eu/vocabulary/CA': { label: 'Group Authors' },
                'http://wos.risis.eu/vocabulary/TI': { label: 'Article title' },
                'http://wos.risis.eu/vocabulary/ED': { label: 'Editors' },
                'http://wos.risis.eu/vocabulary/SO': { label: 'Full source title' },
                'http://wos.risis.eu/vocabulary/HO': { label: 'International Standard Book Number (ISBN)' },
                'http://wos.risis.eu/vocabulary/LA': { label: 'Language' },
                'http://wos.risis.eu/vocabulary/DT': { label: 'Document type' },
                'http://wos.risis.eu/vocabulary/NR': { label: 'Cited reference count' },
                'http://wos.risis.eu/vocabulary/SN': { label: 'ISSN' },
                'http://wos.risis.eu/vocabulary/SP': { label: 'Conference Sponsors' },
                'http://wos.risis.eu/vocabulary/PU': { label: 'Publisher' },
                'http://wos.risis.eu/vocabulary/C1': { label: 'Author address' },
                'http://wos.risis.eu/vocabulary/CL': { label: 'Conference Location' },
                'http://wos.risis.eu/vocabulary/CY': { label: 'Conference Date' },
                'http://wos.risis.eu/vocabulary/CT': { label: 'Conference Title' },
                'http://wos.risis.eu/vocabulary/D2': { label: 'Book Digital Object Identifier (DOI)' },
                'http://wos.risis.eu/vocabulary/DE': {
                    label: 'Author keywords',
                    objectReactor: ['AggregateObject'],
                    objectAViewer: ['BasicAggregateView']
                },
                'http://wos.risis.eu/vocabulary/ID': {
                    label: 'KeyWords Plus',
                    objectReactor: ['AggregateObject'],
                    objectAViewer: ['BasicAggregateView']
                },
                'http://wos.risis.eu/vocabulary/AB': { label: 'Abstract' },
                'http://wos.risis.eu/vocabulary/CR': { label: 'Cited references', objectIViewer: ['BasicLinkedIndividualView'] },
                'http://wos.risis.eu/vocabulary/TC': { label: 'Times cited' },
                'http://wos.risis.eu/vocabulary/BP': { label: 'Beginning page' },
                'http://wos.risis.eu/vocabulary/BE': { label: 'Editors' },
                'http://wos.risis.eu/vocabulary/BA': { label: 'Book Authors' },
                'http://wos.risis.eu/vocabulary/EP': { label: 'Ending page' },
                'http://wos.risis.eu/vocabulary/PG': { label: 'Page count' },
                'http://wos.risis.eu/vocabulary/JI': { label: 'ISO source title abbreviation' },
                'http://wos.risis.eu/vocabulary/SE': { label: 'Book series title' },
                'http://wos.risis.eu/vocabulary/BS': { label: 'Book series subtitle' },
                'http://wos.risis.eu/vocabulary/PY': { label: 'Publication year' },
                'http://wos.risis.eu/vocabulary/P2': { label: 'Chapter Count (Book Citation Index)' },
                'http://wos.risis.eu/vocabulary/PD': { label: 'Publication date' },
                'http://wos.risis.eu/vocabulary/VL': { label: 'Volume' },
                'http://wos.risis.eu/vocabulary/IS': { label: 'Issue' },
                'http://wos.risis.eu/vocabulary/PN': { label: 'Part number' },
                'http://wos.risis.eu/vocabulary/SU': { label: 'Supplement' },
                'http://wos.risis.eu/vocabulary/SI': { label: 'Special issue' },
                'http://wos.risis.eu/vocabulary/GA': { label: 'ISI document delivery number' },
                'http://wos.risis.eu/vocabulary/GP': { label: 'Book Group Authors' },
                'http://wos.risis.eu/vocabulary/PI': { label: 'Publisher city' },
                'http://wos.risis.eu/vocabulary/WP': { label: 'Publisher web address' },
                'http://wos.risis.eu/vocabulary/RP': { label: 'Reprint address' },
                'http://wos.risis.eu/vocabulary/CP': { label: 'Cited patent' },
                'http://wos.risis.eu/vocabulary/J9': { label: '29-character source title abbreviation' },
                'http://wos.risis.eu/vocabulary/PA': { label: 'Publisher address' },
                'http://wos.risis.eu/vocabulary/UT': { label: 'Unique Tag (ISI unique article identifier)' },
                'http://wos.risis.eu/vocabulary/DI': { label: 'Digital Object Identifier (DOI)' },
                'http://wos.risis.eu/vocabulary/EM': { label: 'Email address' },
                'http://wos.risis.eu/vocabulary/FU': { label: 'Funding Agency and Grant Number' },
                'http://wos.risis.eu/vocabulary/SC': { label: 'Subject Category' },
                'http://wos.risis.eu/vocabulary/FX': { label: 'Funding Text' },
                'http://wos.risis.eu/vocabulary/WC': { label: 'Web of Science Category' },
                'http://wos.risis.eu/vocabulary/Z9': { label: 'Total Times Cited Count (WoS, BCI, and CSCD)' },
                'http://wos.risis.eu/vocabulary/ER': { label: 'End of record' },
                'http://wos.risis.eu/vocabulary/EF': { label: 'End of file' }
            },
            'http://risis.eu/cordisH2020': {
                'http://risis.eu/cordisH2020/vocab/projectParticipant': {
                    label: ['Participants'],
                    objectIViewer: ['BasicLinkedIndividualView'],
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://risis.eu/cordisH2020/resource/organizationType',
                                instances: [{value: 'http://exampleProperty.org', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Organization Type'],
                                objectIViewer: ['BasicLinkedIndividualView']
                            }
                        }
                    ]
                },
                'http://risis.eu/cordisH2020/resource/organizationType': {
                    label: ['Organization Type'],
                    objectIViewer: ['BasicLinkedIndividualView']
                },
                'http://risis.eu/cordisH2020/vocab/fundingScheme': {
                    label: ['Funding Scheme'],
                    objectIViewer: ['BasicLinkedIndividualView']
                },
                'http://risis.eu/cordisH2020/vocab/legalBasis': {
                    label: ['Legal Basis'],
                    objectIViewer: ['BasicLinkedIndividualView']
                },
                'http://risis.eu/cordisH2020/vocab/topic': {
                    label: ['Topic'],
                    objectIViewer: ['BasicLinkedIndividualView']
                },
                'http://risis.eu/cordisH2020/vocab/projectParticipation': {
                    label: ['Project Participation'],
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://risis.eu/cordisH2020/vocab/signedGrant',
                                instances: [{value: 'http://exampleProperty.org', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Signed Grant'],
                                objectIViewer: ['BasicLinkedIndividualView']
                            }
                        }
                    ]
                }
            },
            'http://risis.eu/dataset/Eter': {
                'http://risis.eu/eter/vocab/institutionCategory':{
                    label: ['Category']
                },
                'http://risis.eu/eter/vocab/fundationYear':{
                    label: ['Fundation Year']
                },
                'http://risis.eu/eter/vocab/hasUniversityHospital':{
                    label: ['Has Hospital?']
                },
                'http://risis.eu/eter/vocab/institutionCategoryStandardized':{
                    label: ['Standard Category']
                },
                'http://www.geonames.org/ontology#countryCode':{
                    label: ['Country'],
                    objectIViewer: ['TwoLetterCountryView']
                },
                'http://www.w3.org/2000/01/rdf-schema#label':{
                    label: ['Name of the institute']
                },
                'http://www.w3.org/2009/08/skos-reference/skos.html#prefLabel':{
                    label: ['Native name of the institute']
                },
                'http://www.w3.org/2003/01/geo/wgs84_pos#lat':{
                    label: ['Latitude']
                },
                'http://www.w3.org/2003/01/geo/wgs84_pos#long':{
                    label: ['Longitude']
                },
                'http://risis.eu/eter/vocab/isMultiSite':{
                    label: ['Has multiple sites?']
                }
            },
            'http://rdf.risis.eu/sms/users.ttl#': {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                    isHidden: 1
                },
                'http://xmlns.com/foaf/0.1/accountName': {
                    label: ['Username'],
                    readOnlyProperty: 1
                },
                'http://xmlns.com/foaf/0.1/member': {
                    label: ['Member of'],
                    objectIEditor: ['BasicOptionInput'],
                    objectIViewer: ['BasicOptionView'],
                    options: [
                        {label: 'RISIS Users', value: 'http://rdf.risis.eu/user/RISISUsers'},
                        {label: 'Dataset Coordinators', value: 'http://rdf.risis.eu/user/DatasetCoordinators'},
                        {label: 'Project Review Board', value: 'http://rdf.risis.eu/user/PRB'},
                        {label: 'FCB', value: 'http://rdf.risis.eu/user/FCB'},
                        {label: 'SMS Visitor', value: 'http://rdf.risis.eu/user/SMSVisitor'},
                        {label: 'SMS Team', value: 'http://rdf.risis.eu/user/SMSTeam'}
                    ],
                    defaultValue: ['http://rdf.risis.eu/user/RISISUsers'],
                    allowNewValue: 1
                },
                'http://xmlns.com/foaf/0.1/firstName': {
                    label: ['First Name']
                },
                'http://xmlns.com/foaf/0.1/lastName': {
                    label: ['Last Name']
                },
                'http://purl.org/dc/terms/created': {
                    label: ['Created at'],
                    readOnlyProperty: 1
                },
                'http://xmlns.com/foaf/0.1/mbox': {
                    label: ['Email Address'],
                    readOnlyProperty: 1
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#password': {
                    label: ['Password'],
                    objectIViewer: ['PasswordView'],
                    objectIEditor: ['PasswordInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOf': {
                    label: ['Editor of Scope'],
                    allowNewValue: 1,
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#scope',
                                instances: [{value: 'D', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['Scope of access: e.g. D, DP, R, RP, P , etc.'],
                                label: ['Scope'],
                                objectIEditor: ['BasicOptionInput'],
                                objectIViewer: ['BasicOptionView'],
                                options: [
                                    {label: 'Dataset', value: 'D'},
                                    {label: 'Resource', value: 'R'},
                                    {label: 'Property', value: 'P'},
                                    {label: 'Dataset-Resource', value: 'DR'},
                                    {label: 'Dataset-Property', value: 'DP'},
                                    {label: 'Resource-Property', value: 'RP'},
                                    {label: 'Dataset-Resource-Property', value: 'DRP'},
                                ],
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#dataset',
                                instances: [{value: 'http://exampleDataset.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Dataset URI under which the property is exposed.'],
                                label: ['Dataset']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resource',
                                instances: [{value: 'http://exampleResource.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Resource URI under which the property is exposed.'],
                                label: ['Resource'],
                                objectIEditor: ['PrefixBasedInput'],
                                objectIViewer: ['PrefixBasedView']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property',
                                instances: [{value: 'http://exampleProperty.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Property URI'],
                                label: ['Property'],
                                objectIEditor: ['PrefixBasedInput'],
                                objectIViewer: ['PrefixBasedView']
                            }
                        }
                    ]
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#viewerOf': {
                    label: ['Viewer of Scope'],
                    allowNewValue: 1,
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#scope',
                                instances: [{value: 'D', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['Scope of access: e.g. D, DP, R, RP, P , etc.'],
                                label: ['Scope'],
                                objectIEditor: ['BasicOptionInput'],
                                objectIViewer: ['BasicOptionView'],
                                options: [
                                    {label: 'Dataset', value: 'D'},
                                    {label: 'Resource', value: 'R'},
                                    {label: 'Property', value: 'P'},
                                    {label: 'Dataset-Resource', value: 'DR'},
                                    {label: 'Dataset-Property', value: 'DP'},
                                    {label: 'Resource-Property', value: 'RP'},
                                    {label: 'Dataset-Resource-Property', value: 'DRP'},
                                ],
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#dataset',
                                instances: [{value: 'http://exampleDataset.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Dataset URI under which the property is exposed.'],
                                label: ['Dataset']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resource',
                                instances: [{value: 'http://exampleResource.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Resource URI under which the property is exposed.'],
                                label: ['Resource'],
                                objectIEditor: ['PrefixBasedInput'],
                                objectIViewer: ['PrefixBasedView']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property',
                                instances: [{value: 'http://exampleProperty.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Property URI'],
                                label: ['Property'],
                                objectIEditor: ['PrefixBasedInput'],
                                objectIViewer: ['PrefixBasedView']
                            }
                        }
                    ]
                },
                'http://xmlns.com/foaf/0.1/organization': {
                    label: ['Organization'],
                    allowNewValue: 1,
                    objectIViewer: ['BasicDBpediaView'],
                    objectIEditor: ['DBpediaInput']
                }
            },
            'metadata': {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                    //it will not affect the sub properties in detail
                    isHidden: 1,
                    category: ['overview'],
                    label: ['Type'],
                    hint: ['Type of the entity.']
                },
                'http://rdf.risis.eu/metadata/accessType': {
                    category: ['access'],
                    label: ['Access Type'],
                    hint: ['It can be visit only, request only or both request and visit.'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'Access and Visit', value: 'Access and Visit'},
                        {label: 'Access Only', value: 'Access Only'},
                        {label: 'Visit Only', value: 'Visit Only'}
                    ]
                },
                'http://rdf.risis.eu/metadata/openingStatus': {
                    category: ['access'],
                    label: ['Opening Status'],
                    hint: ['Wheter the dataset is already open or will be open soon.'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'Opening Soon', value: 'Opening Soon'},
                        {label: 'Open', value: 'Open'}
                    ]
                },
                'http://rdf.risis.eu/metadata/accessRequestForm': {
                    category: ['access'],
                    label: ['Access Request Conditions and Details'],
                    hint: ['Link to the form that provides information for end users to access the dataset.']
                },
                'http://rdf.risis.eu/metadata/visitRequestForm': {
                    category: ['access'],
                    label: ['Visit Request Conditions and Details'],
                    hint: ['Link to the form that provides information for end users to visit the dataset.']
                },
                'http://rdf.risis.eu/metadata/nonDisclosureAgreement': {
                    category: ['access'],
                    label: ['Non-disclosure Agreement Form'],
                    hint: ['In order to access confidential data, users have to sign a non-disclosure agreement with the holders of the dataset. The link to this form should be set here.']
                },
                'http://rdf.risis.eu/metadata/dataModel': {
                    category: ['structuralAspects'],
                    label: ['Data Model'],
                    hint: ['The underlying data model. Whether it is RDF, Relational, etc. Add your own model if not exists in the option list.'],
                    allowNewValue: 1,
                    objectIViewer: ['BasicOptionView'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'Relational Model', value: 'Relational Model'},
                        {label: 'RDF Model', value: 'RDF Model'},
                        {label: 'Tabular (Spreadsheet) Model', value: 'Tabular Model'},
                        {label: 'Unstructured', value: 'Unstructured'}
                    ],
                    placeholder: ['Enter the value for other data model...'],
                    defaultValue: ['Relational Model'],
                    allowUserDefinedValue: 1
                },
                'http://rdf.risis.eu/metadata/classification': {
                    category: ['structuralAspects'],
                    label: ['Classification Scheme'],
                    hint: ['What classifications are used?'],
                    allowNewValue: 1,
                    objectIViewer: ['BasicOptionView'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'Web of Science (WoS) categories', value: 'http://rdf.risis.eu/classifications/WoS/1.0/'},
                        {label: 'Field of Science (WoS) categories', value: 'http://rdf.risis.eu/classifications/FoS/1.0/'},
                        {label: 'IPC', value: 'http://rdf.risis.eu/classifications/IPC/1.0/'},
                        {label: 'UOE', value: 'http://rdf.risis.eu/classifications/UOE/1.0/'},
                        {label: 'EC-ATC', value: 'http://rdf.risis.eu/classifications/EC-ATC/1.0/'},
                        {label: 'NUTS', value: 'http://rdf.risis.eu/classifications/NUTS/1.0/'},
                        {label: 'ISO', value: 'http://rdf.risis.eu/classifications/ISO/1.0/'},
                        {label: 'CORDIS', value: 'http://rdf.risis.eu/classifications/CORDIS/1.0/'},
                        {label: 'ISCED', value: 'http://rdf.risis.eu/classifications/ISCED/1.0/'},
                        {label: 'NABS', value: 'http://rdf.risis.eu/classifications/NABS/1.0/'},
                        {label: 'NACE', value: 'http://rdf.risis.eu/classifications/NACE/1.0/'},
                        {label: 'ICB', value: 'http://rdf.risis.eu/classifications/ICB/1.0/'}
                    ],
                    placeholder: ['Enter the URI for your classification...'],
                    allowUserDefinedValue: 1
                },
                'http://rdf.risis.eu/metadata/tables': {
                    category: ['structuralAspects'],
                    label: ['Total Number of Tables'],
                    hint: ['The total number of distinct tables in the dataset.'],
                    placeholder: ['Enter the number of tables...']
                },
                'http://rdfs.org/ns/void#classes': {
                    category: ['structuralAspects'],
                    label: ['Total Number of Entity Types'],
                    hint: ['The total number of distinct entity types (classes) in the dataset.'],
                    placeholder: ['Enter the number of entity types...']
                },
                'http://rdf.risis.eu/metadata/table': {
                    category: ['structuralAspects'],
                    label: ['Tables'],
                    hint: ['The specification of tables in your dataset.'],
                    allowNewValue: 1,
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'http://rdf.risis.eu/metadata/Table', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Type'],
                                category: ['structuralAspects'],
                                objectIViewer: ['BasicOptionView'],
                                objectIEditor: ['BasicOptionInput'],
                                options: [
                                    {label: 'Table', value: 'http://rdf.risis.eu/metadata/Table'},
                                ],
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://xmlns.com/foaf/0.1/name',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Table Name'],
                                category: ['structuralAspects'],
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://purl.org/dc/terms/description',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Description'],
                                objectIEditor: ['BasicTextareaInput'],
                                category: ['structuralAspects']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://rdf.risis.eu/metadata/records',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Total Number of Records'],
                                category: ['structuralAspects'],
                                placeholder: ['Enter the total number of records...']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://rdf.risis.eu/metadata/attributes',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Total Number of Attributes'],
                                category: ['structuralAspects'],
                                placeholder: ['Enter the total number of attributes...']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://rdf.risis.eu/metadata/attribute',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Attributes'],
                                category: ['structuralAspects'],
                                placeholder: ['Enter the attribute name...'],
                                allowNewValue: 1
                            }
                        }
                    ]
                },
                'http://rdfs.org/ns/void#class': {
                    category: ['structuralAspects'],
                    label: ['Entity Types'],
                    hint: ['The specification of entity types in your dataset.'],
                    allowNewValue: 1,
                    allowExtension: 1,
                    hasBlankNode: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                            },
                            config: {
                                label: ['Type'],
                                objectIViewer: ['BasicOptionView'],
                                objectIEditor: ['BasicOptionInput'],
                                category: ['structuralAspects'],
                                options: [
                                    {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                    {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'},
                                    {label: 'Higher Education Institution', value: 'http://purl.org/vocab/aiiso/schema#Institution'},
                                    {label: 'Firm', value: 'http://rdf.risis.eu/metadata/Firm'},
                                    {label: 'Funding Body', value: 'http://vivoweb.org/ontology/core#FundingOrganization'},
                                    {label: 'Publication', value: 'http://purl.org/cerif/frapo/Publication'},
                                    {label: 'Patent', value: 'http://purl.org/ontology/bibo/Patent'},
                                    {label: 'Project', value: 'http://purl.org/cerif/frapo/Project'},
                                    {label: 'Investment', value: 'http://purl.org/cerif/frapo/Investment'},
                                    {label: 'FundingProgramme', value: 'http://purl.org/cerif/frapo/FundingProgramme'},
                                    {label: 'Policy', value: 'http://purl.org/dc/terms/Policy'},
                                    {label: 'Policy Evaluation', value: 'http://rdf.risis.eu/metadata/PolicyEvaluation'}
                                ],
                                placeholder: ['Enter the URI for your specific entity type...'],
                                allowUserDefinedValue: 1
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://purl.org/dc/terms/description',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Description'],
                                category: ['structuralAspects'],
                                objectIEditor: ['BasicTextareaInput']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://rdfs.org/ns/void#property',
                                instances: [{value: '', valueType: 'literal'}]
                            },
                            config: {
                                category: ['structuralAspects'],
                                label: ['Attributes']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://purl.org/dc/terms/temporal',
                                instances: [{value: 'http://example.org/temporal', valueType: 'uri'}]
                            },
                            config: {
                                category: ['structuralAspects'],
                                label: ['Time Coverage'],
                                hasBlankNode: 1,
                                autoLoadDetails: 1,
                                allowExtension: 1,
                                extensions: [
                                    {
                                        spec: {
                                            propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#startDate',
                                            instances: [{value: '2010-12-24', valueType: 'literal'}]
                                        },
                                        config: {
                                            label: ['Start date'],
                                            category: ['date'],
                                            hint: ['Start date of the time coverage.']
                                        }
                                    },
                                    {
                                        spec: {
                                            propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#endDate',
                                            instances: [{value: '2015-12-24', valueType: 'literal'}]
                                        },
                                        config: {
                                            label: ['End date'],
                                            category: ['date'],
                                            hint: ['End date of the time coverage.']
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://purl.org/dc/terms/spatial',
                                instances: [{value: 'http://dbpedia.org/resource/Germany', valueType: 'uri'}]
                            },
                            config: {
                                category: ['structuralAspects'],
                                label: ['Geographical Coverage'],
                                allowNewValue: 1,
                                objectReactor: ['AggregateObject'],
                                objectAViewer: ['DBpediaMapView'],
                                objectIViewer: ['BasicDBpediaView'],
                                asWikipedia: 1,
                                objectIEditor: ['DBpediaInput'],
                                lookupClass: ['Place']
                            }
                        },
                    ]
                },
                'http://purl.org/dc/terms/title': {
                    label: ['Title'],
                    category: ['overview'],
                    hint: ['The title of the dataset described by this document.'],
                    objectIViewer: ['BasicIndividualView'],
                    objectIEditor: ['BasicIndividualInput']
                },
                'http://purl.org/dc/terms/language': {
                    allowNewValue: 1,
                    label: ['Dataset Language'],
                    category: ['overview'],
                    hint: ['The language of the dataset. Resources defined by the Library of Congress (http://id.loc.gov/vocabulary/iso639-1.html, http://id.loc.gov/vocabulary/iso639-2.html) SHOULD be used.'],
                    objectIViewer: ['LanguageView'],
                    objectIEditor: ['LanguageInput'],
                    defaultValue: ['http://id.loc.gov/vocabulary/iso639-1/en']
                },
                'http://purl.org/dc/terms/temporal': {
                    label: ['Time coverage'],
                    category: ['date'],
                    hint: ['Time coverage of the data itself but not of the data collection. For example we collect pictures in 2015 about the war. However, the pictures themselves could have been taken from 1939 to 1945. So the time coverage is 1939-1945.'],
                    allowExtension: 1,
                    hasBlankNode: 1,
                    autoLoadDetails: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#startDate',
                                instances: [{value: '2010-12-24', valueType: 'literal'}]
                            },
                            config: {
                                label: ['Start date'],
                                category: ['date'],
                                hint: ['Start date of the time coverage.']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#endDate',
                                instances: [{value: '2015-12-24', valueType: 'literal'}]
                            },
                            config: {
                                label: ['End date'],
                                category: ['date'],
                                hint: ['End date of the time coverage.']
                            }
                        }
                    ]
                },
                'http://purl.org/dc/terms/spatial': {
                    label: ['Geographical coverage'],
                    category: ['overview'],
                    hint: ['The geographical area covered by the dataset.The same metadata could also be used to document the geographical area covered by an entity contained in the dataset in particular. For example we could say that the dataset covers all Eu countries or covers only France and Italy.'],
                    allowNewValue: 1,
                    objectReactor: ['AggregateObject'],
                    objectAViewer: ['DBpediaMapView'],
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1,
                    objectAEditor: ['BasicAggregateInput'],
                    objectIEditor: ['DBpediaInput'],
                    lookupClass: ['Place']
                },
                'http://purl.org/dc/terms/description': {
                    category: ['overview'],
                    label: ['Textual description'],
                    hint: ['A textual description of the dataset.'],
                    objectIEditor: ['BasicTextareaInput']
                },
                'http://purl.org/dc/terms/subject': {
                    category: ['overview'],
                    label: ['Keywords'],
                    hint: ['Tags a dataset with a topic. For the general case, we recommend the use of a DBpedia resource URI (http://dbpedia.org/resource/XXX) to categorise a dataset, where XXX stands for the thing which best describes the main topic of what the dataset is about.'],
                    allowNewValue: 1,
                    objectIEditor: ['DBpediaInput'],
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1
                },
                'http://purl.org/dc/terms/source': {
                    label: ['Data Source'],
                    allowNewValue: 1,
                    category: ['overview'],
                    hint: ['A related resource from which the dataset is derived. The source should be described using a URI if available, rather than as a literal.']
                },
                'http://purl.org/dc/terms/creator': {
                    allowNewValue: 1,
                    allowExtension: 1,
                    category: ['people'],
                    label: ['Creator'],
                    hint: ['An entity, such as a person, organisation, or service, that is primarily responsible for creating the dataset. The creator should be described using a URI if available, rather than just providing the name as a literal. ORCID provides a useful service for this.'],
                    objectIEditor: ['DBpediaInput'],
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Type of the entity'],
                                label: ['Type'],
                                category: ['people'],
                                objectIViewer: ['BasicOptionView'],
                                objectIEditor: ['BasicOptionInput'],
                                options: [
                                    {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                    {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                                ],
                                defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                                allowUserDefinedValue: 1,
                                isHidden: 0
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                                instances: [{value: 'Label', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A descriptor label for the URI'],
                                category: ['people'],
                                label: ['Label']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                                instances: [{value: 'email address', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A corresponding email address'],
                                category: ['people'],
                                label: ['Email']
                            }
                        }
                    ]
                },
                'http://purl.org/dc/terms/publisher': {
                    allowNewValue: 1,
                    allowExtension: 1,
                    category: ['people'],
                    label: ['Publisher'],
                    hint: ['An entity, such as a person, organisation, or service, that is responsible for making the dataset available. The publisher should be described using a URI if available, rather than just providing the name as a literal.'],
                    objectIEditor: ['DBpediaInput'],
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Type of the entity'],
                                category: ['people'],
                                label: ['Type'],
                                objectIViewer: ['BasicOptionView'],
                                objectIEditor: ['BasicOptionInput'],
                                options: [
                                    {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                    {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                                ],
                                defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                                allowUserDefinedValue: 1,
                                isHidden: 0
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                                instances: [{value: 'Label', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A descriptor label for the URI'],
                                category: ['people'],
                                label: ['Label']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                                instances: [{value: 'email address', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A corresponding email address'],
                                category: ['people'],
                                label: ['Email']
                            }
                        }
                    ]
                },
                'http://purl.org/dc/terms/contributor': {
                    allowNewValue: 1,
                    allowExtension: 1,
                    category: ['people'],
                    label: ['Contributor'],
                    hint: ['An entity, such as a person, organisation, or service, that is responsible for making contributions to the dataset. The contributor should be described using a URI if available, rather than just providing the name as a literal.'],
                    objectIEditor: ['DBpediaInput'],
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                                instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Type of the entity'],
                                category: ['people'],
                                label: ['Type'],
                                objectIViewer: ['BasicOptionView'],
                                objectIEditor: ['BasicOptionInput'],
                                options: [
                                    {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                    {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                                ],
                                defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                                allowUserDefinedValue: 1,
                                isHidden: 0
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                                instances: [{value: 'Label', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A descriptor label for the URI'],
                                category: ['people'],
                                label: ['Label']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                                instances: [{value: 'email address', valueType: 'literal'}]
                            },
                            config: {
                                hint: ['A corresponding email address'],
                                category: ['people'],
                                label: ['Email']
                            }
                        }
                    ]
                },
                'http://purl.org/dc/terms/created': {
                    label: ['Created date'],
                    category: ['date'],
                    hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601'],
                    allowNewValue: 1,
                    //calendarFormat: 'YYYY-MM-DD\\THH:mm:ss\\Z',
                    objectIEditor: ['BasicCalendarInput'],
                    dateTimeFormat: 'YYYY-MM-DD',
                    objectIViewer: ['BasicDateTimeView']
                },
                'http://purl.org/dc/terms/issued': {
                    label: ['Date issued'],
                    category: ['date'],
                    hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601.'],
                    allowNewValue: 1,
                    //calendarFormat: 'YYYY-MM-DD\\THH:mm:ss\\Z',
                    objectIEditor: ['BasicCalendarInput'],
                    dateTimeFormat: 'YYYY-MM-DD',
                    objectIViewer: ['BasicDateTimeView']
                },
                'http://purl.org/dc/terms/modified': {
                    label: ['Date modified'],
                    category: ['date'],
                    hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601'],
                    allowNewValue: 1,
                    //calendarFormat: 'YYYY-MM-DD\\THH:mm:ss\\Z',
                    objectIEditor: ['BasicCalendarInput'],
                    dateTimeFormat: 'YYYY-MM-DD',
                    objectIViewer: ['BasicDateTimeView']
                },
                'http://purl.org/dc/terms/license': {
                    category: ['legalAspects'],
                    label: ['License'],
                    hint: ['Data without explicit license is a potential legal liability and leaves consumers unclear what the usage conditions are. Therefore, it is very important that publishers make explicit the terms under which the dataset can be used.'],
                    allowNewValue: 1,
                    objectIViewer: ['BasicOptionView'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'Open Data Commons Public Domain Dedication and License (PDDL)', value: 'http://www.opendatacommons.org/licenses/pddl/'},
                        {label: 'Open Data Commons Attribution License', value: 'http://www.opendatacommons.org/licenses/by/'},
                        {label: 'Open Data Commons Open Database License (ODbL)', value: 'http://www.opendatacommons.org/licenses/odbl/'},
                        {label: 'Creative Commons Public Domain Dedication', value: 'http://creativecommons.org/publicdomain/zero/1.0/'},
                        {label: 'Creative Commons Attribution-ShareAlike', value: 'http://creativecommons.org/licenses/by-sa/3.0/'},
                        {label: 'GNU Free Documentation License', value: 'http://www.gnu.org/copyleft/fdl.html'}
                    ],
                    defaultValue: ['http://creativecommons.org/licenses/by-sa/3.0/'],
                    allowUserDefinedValue: 1
                },
                'http://purl.org/dc/terms/rights': {
                    label: ['Rights'],
                    category: ['legalAspects'],
                    hint: ['This describes the rights under which the dataset can be used/reused.']
                },
                'http://purl.org/dc/terms/format': {
                    label: ['Dataset File format'],
                    allowNewValue: 1,
                    category: ['technicalAspects'],
                    hint: ['Technical features of a dataset.'],
                    objectIEditor: ['MediaTypeInput'],
                    placeholder: ['Enter your specific file format...'],
                    allowUserDefinedValue: 1
                },
                'http://rdfs.org/ns/void#dataDump': {
                    label: ['Download address'],
                    category: ['technicalAspects'],
                    hint: ['If the dataset is available, then its location can be announced using this attribute. If the dataset is split into multiple dumps, then several values of this property can be provided.']
                },
                'http://rdfs.org/ns/void#exampleResource': {
                    label: ['Example of the resource'],
                    category: ['overview'],
                    hint: ['For documentation purposes, it can be helpful to name some representative example entities for a dataset. Looking up these entities allows users to quickly get an impression of the kind of data that is present in a dataset.'],
                    allowNewValue: 1
                },
                'http://rdfs.org/ns/void#vocabulary': {
                    isHidden: 1,
                    label: ['Vocabulary'],
                    category: ['overview'],
                    hint: ['Vocabularies used in the dataset.']
                },
                'http://www.w3.org/ns/dcat#byteSize': {
                    label: ['Size of the dataset'],
                    category: ['technicalAspects'],
                    hint: ['The size of the dataset. For example we could say that the dataset is 1.0 GB or 1024.0 MB'],
                    objectIEditor: ['FileSizeInput'],
                    objectIViewer: ['FileSizeView']
                },
                'http://www.w3.org/ns/dcat#accessURL': {
                    label: ['Access URL'],
                    category: ['access'],
                    hint: ['A landing page, feed, SPARQL endpoint or other type of resource that gives access to the distribution of the dataset'],
                    allowNewValue: 1
                },
                'http://xmlns.com/foaf/0.1/homepage': {
                    label: ['Home Page'],
                    category: ['overview'],
                    hint: ['Web page where further information about the dataset can be found.']
                },
                'http://xmlns.com/foaf/0.1/page': {
                    label: ['Documentation, Handbook or other Complementary Information'],
                    category: ['overview'],
                    hint: ['Additional web pages and files with relevant information about the dataset and its documentation.'],
                    allowNewValue: 1
                },
                'http://rdf.risis.eu/metadata/useCase': {
                    label: ['Use case(s)'],
                    category: ['overview'],
                    hint: ['Use case(s) related to the dataset.'],
                    allowNewValue: 1
                },
                'http://vocab.org/waiver/terms/norms': {
                    label: ['Terms of use'],
                    category: ['legalAspects'],
                    hint: ['Norms are non-binding conditions of use that publishers would like to encourage the users of their data to adopt. representing the community norms for access and use of a resource.']
                },
                'http://vocab.org/waiver/terms/waiver': {
                    label: ['Waiver'],
                    category: ['legalAspects'],
                    hint: ['To the extent possible under law, The Example Organisation has waived all copyright and related or neighboring rights to The Example Dataset.'],
                    objectIEditor: ['BasicTextareaInput']
                },
                'http://purl.org/pav/version': {
                    isHidden: 1,
                    label: ['Version'],
                    category: ['overview'],
                    hint: ['The version of the dataset described by this document']
                }
            }
        },
        dataset_object: {

        },
        resource_property: {

        },
        resource_object: {

        },
        property_object: {

        },
        //---------depth 3------------
        dataset_resource_property: {

        },
        dataset_resource_object: {

        },
        dataset_property_object: {

        },
        resource_property_object: {

        },
        //---------depth 4------------
        dataset_resource_property_object: {

        }
    }
};
