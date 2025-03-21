import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import {navigateAction, NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {enableAuthentication, defaultDatasetURI, enableAddingNewDatasets, enableDatasetAnnotation, enableDatasetGeoEnrichment, enableQuerySaveImport} from '../configs/general';
import SearchInput, {createFilter} from 'react-search-input'
import {checkViewAccess, checkEditAccess} from '../services/utils/accessManagement';
import DatasetsStore from '../stores/DatasetsStore';
import URIUtil from './utils/URIUtil';

class Datasets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseOverList: [], selectedList: [], searchTerm: ''};
        this.searchUpdated = this.searchUpdated.bind(this)
    }
    componentDidMount() {
        const canvasDIV = this.refs['linker_canvas'];
        let instance = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            Container: canvasDIV,
            EndpointHoverStyle: { fill: 'orange' },
            HoverPaintStyle: { stroke: 'orange' }
        });
        let commonPropLink = {
            connector: 'Straight',
            anchor:['AutoDefault'],
            overlays:[
                [ 'Label', { label:' ', id:'prop1' } ]
            ],
            endpoint:'Dot'
        }
        /*
        let commonPropLinkLoop = {
            connector: ['StateMachine', {
                curviness: 1
            }],
            connectorStyle: {
                lineWidth: 4
            },
            anchor:['AutoDefault'],
            overlays:[
                [ 'Label', { label:' ', id:'prop1' } ]
            ],
            endpoint:'Dot'
        }
        */
        let commonPropLink2 = {
            anchor:['AutoDefault'],
            overlays:[
                [ 'Label', { label:' ', id:'prop1' } ]
            ],
            endpoint:'Dot'
        }
        jsPlumb.ready(()=> {
            const containerOrgs = this.refs.containerOrgs;
            const containerProjects = this.refs.containerProjects;
            const containerPersons = this.refs.containerPersons;
            const containerPatents = this.refs.containerPatents;
            const containerPublications = this.refs.containerPublications;
            const containerFundingProgram = this.refs.containerFundingProgram;
            const containerOrgRanking = this.refs.containerOrgRanking;
            const containerGeoBoundaries = this.refs.containerGeoBoundaries;
            const containerGeoStats = this.refs.containerGeoStats;
            const containerGeoLocations = this.refs.containerGeoLocations;
            const containerOthers = this.refs.containerOthers;

            //instance.draggable(containerOrgs);
            //instance.draggable(containerProjects);
            //instance.draggable(containerPersons);
            //instance.draggable(containerPatents);
            //instance.draggable(containerPublications);
            //instance.draggable(containerFundingProgram);
            //instance.draggable(containerOrgRanking);
            //instance.draggable(containerGeoBoundaries);
            //instance.draggable(containerGeoStats);
            //instance.draggable(containerGeoLocations);
            //instance.draggable(containerOthers);
            instance.connect({
                source: containerGeoLocations,
                target: containerGeoBoundaries,
            }, commonPropLink);
            instance.connect({
                source: containerGeoBoundaries,
                target: containerGeoStats,
            }, commonPropLink);
            instance.connect({
                source: containerOrgs,
                target: containerProjects,
            }, commonPropLink);
            /*
            instance.connect({
                source: containerOrgs,
                target: containerOrgs,
            }, commonPropLinkLoop);
            */
            instance.connect({
                source: containerOrgs,
                target: containerPersons
            }, commonPropLink);
            instance.connect({
                source: containerProjects,
                target: containerPersons
            }, commonPropLink);
            instance.connect({
                source: containerProjects,
                target: containerFundingProgram
            }, commonPropLink);
            instance.connect({
                source: containerOrgs,
                target: containerOrgRanking
            }, commonPropLink);
            instance.connect({
                source: containerOrgs,
                target: containerPublications
            }, commonPropLink);
            instance.connect({
                source: containerOrgs,
                target: containerPatents
            }, commonPropLink);
            instance.connect({
                source: containerPersons,
                target: containerPublications
            }, commonPropLink);
            instance.connect({
                source: containerPersons,
                target: containerPatents
            }, commonPropLink);
        });
    }
    searchUpdated (term) {
        this.setState({searchTerm: term})
    }
    prepareFocusList(list) {
        let out = [];
        list.forEach(function(f, i){
            out.push(<a key={i} href={f} target="_blank">{URIUtil.getURILabel(f)} </a>);
        });
        return out;
    }
    handleCreateDataset() {
        this.context.executeAction(navigateAction, {
            url: '/newDataset'
        });
    }
    displayResource(){
        let resourceURI = ReactDOM.findDOMNode(this.refs.resourceURI).value;
        let datasetURI = ReactDOM.findDOMNode(this.refs.datasetURI).value.trim();
        let output = '/dataset/' + encodeURIComponent(datasetURI) + '/resource/' + encodeURIComponent(resourceURI);
        if(resourceURI){
            this.context.executeAction(navigateAction, {
                url: output
            });
        }
    }
    handleMouseOver(category){
        let current = this.state.mouseOverList;
        current.push(category);
        this.setState({mouseOverList: current});
    }
    handleMouseOut(category){
        let current = this.state.mouseOverList;
        current.splice(current.indexOf(category), 1);
        this.setState({mouseOverList: current});
    }
    handleMouseClick(category){
        let current = this.state.selectedList;
        if(current.indexOf(category) === -1){
            current.push(category);
        }else{
            current.splice(current.indexOf(category), 1);
        }
        this.setState({selectedList: current});
        //scroll to datasets list
        let body = $('html, body');
        body.stop().animate({scrollTop:$('#datasetsList').offset().top}, '500', 'swing', function() {
        });
    }
    render() {
        let self = this;
        let optionsList, output ='', outputDSS;
        let color = 'black';
        let user = this.context.getUser();
        let createDatasetDIV = '';
        let annotateDatasetDIV = '';
        let geoEnrichDatasetDIV = '';
        let datasetActionsDIV = '';
        let info = '';
        let queryImportDIV = '';
        let dsCategoryObj = {links: [], orgRanking: [], orgs: [], persons: [], fundingPrograms: [], projects: [], publications: [], patents: [], geoLocations: [], geoBoundaries: [], geoStats: [], others: []};
        let dss = this.props.DatasetsStore.datasetsList;
        //check erros first
        let errorDIV = '';
        if(this.props.DatasetsStore.error){
            errorDIV =
                <div className="ui warning message"><h2>{this.props.DatasetsStore.error} <a className="ui fluid primary button" href="/contact">Contact Us</a></h2></div>;
        }
        let dss2 = [];
        dss.forEach((item)=>{
            if(!user && item.features && item.features.datasetLabel && (item.features.datasetLabel[0].indexOf('WoS')!== -1 || item.features.datasetLabel[0].indexOf('ERC ')!== -1)){

            }else{
                dss2.push(item);
            }
        });
        dss = dss2;
        dss.forEach((item)=>{
            if(item.features.datasetCategory){
                if (!dsCategoryObj[item.features.datasetCategory[0]]){
                    dsCategoryObj.others.push(item);
                }else{
                    dsCategoryObj[item.features.datasetCategory[0]].push(item);
                }
            }
        });
        let outputX;
        if(enableAuthentication && !user){
            outputX = <div className="ui warning message"><div className="header"> Please <a href="http://datasets.risis.eu/register">Register</a> or <a href="/login">Login</a> to access the SMS datasets.</div></div>;
        }
        if(enableAddingNewDatasets){
            createDatasetDIV = <div className="item">
                <div  className={'medium ui basic icon labeled button ' + (user && (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1) ? '': 'disabled-no')} onClick={this.handleCreateDataset.bind(this)}>
                    <i className="cubes large blue icon "></i> <i className="add black icon"></i>Add a New Dataset
                </div>
            </div>;
        }
        if(enableDatasetAnnotation){
            annotateDatasetDIV = <div className="item">
                <a  className={'medium ui basic icon labeled button ' + (user &&  (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1) ? '': 'disabled-no')} href="/annotateDataset">
                    <i className="cubes  large blue icon "></i> <i className="hashtag black icon"></i>Annotate a Dataset
                </a>
            </div>;
        }
        if(enableDatasetGeoEnrichment){
            geoEnrichDatasetDIV = <div className="item">
                <a  className={'medium ui basic icon labeled button ' + (user &&  (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1) ? '': 'disabled-no')} href="/geoEnrichDataset">
                    <i className="cubes large blue icon "></i> <i className="marker black icon"></i>Geo-enrich a Dataset
                </a>
            </div>;
        }
        if(enableQuerySaveImport){
            queryImportDIV = <div className="item">
                <NavLink  className={'medium ui basic icon labeled button ' + (user &&  (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1) ? '': 'disabled-no')} href="/wysiwyq">
                    <i className="large blue level down icon"></i>Import a Query
                </NavLink>
            </div>;
        }
        datasetActionsDIV = <div className="ui horizontal divided list">
            {createDatasetDIV} {annotateDatasetDIV} {geoEnrichDatasetDIV} {queryImportDIV}
            <br/>
        </div>;
        if(!dss.length){
            if(defaultDatasetURI[0]){
                output = <div className="ui item" key={defaultDatasetURI[0]}> <div className="content"> <i className="ui blue icon cubes"></i> <a href={'/dataset/1/' + encodeURIComponent(defaultDatasetURI[0])} title="go to resource list">{defaultDatasetURI[0]}</a> <i className="ui green flag icon" title="default dataset"></i> </div> </div>;
            }else{
                //no graph name is specified
                output = <div className="ui big item" key="empty" > <div className="content">  Your config is empty!<a href={'/dataset/'}> <span className="ui big blue label">See all resources in all local datasets</span></a></div> </div>;
            }
        }else{
            let filterdDSS = [];
            if(self.state.selectedList.length){
                dss.forEach((item)=>{
                    if(item.features.datasetCategory){
                        if(self.state.selectedList.indexOf(item.features.datasetCategory[0]) !== -1){
                            filterdDSS.push(item);
                        }
                    }
                });
                dss = filterdDSS;
            }
            let tmpOption = '';
            optionsList = dss.filter(function(option, index) {
                tmpOption = '1';
                //filter out datasetfilter(function(option, index) {}.s if no access is provided
                if(enableAuthentication && option.features.hasLimitedAccess && parseInt(option.features.hasLimitedAccess)){
                    //need to handle access to the dataset
                    //if user is the editor by default he already has view access
                    let editAccess = checkEditAccess(user, option.d, 0, 0, 0);
                    if(!editAccess.access || editAccess.type === 'partial'){
                        let viewAccess = checkViewAccess(user, option.d, 0, 0, 0);
                        if(!viewAccess.access){
                            tmpOption = '';
                        }
                    }
                }
                //hide metadata dataset
                if(option.d=== 'metadata'){
                    tmpOption = '';
                }
                if(tmpOption){
                    return true;
                }else{
                    return false; // skip
                }
            }).map(function(option, index) {
                return <option key={option.d} value={(option.d)}> {(option.d && option.features.datasetLabel) ? option.features.datasetLabel : option.d} </option>;
            });
            let dsLink = '';
            let dsIcon = '';

            //allow search in datasets list
            const KEYS_TO_FILTERS = ['features.datasetLabel', 'features.resourceFocusType', 'd'];
            dss = dss.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

            outputDSS = dss.map(function(ds, index) {
                dsLink = <a href={'/dataset/1/' + encodeURIComponent(ds.d)} title="go to resource list">{ds.features && ds.features.datasetLabel ? ds.features.datasetLabel : ds.d}</a>;
                if(ds.features && ds.features.isBrowsable){
                    dsLink = <a href={'/browse/' + encodeURIComponent(ds.d)} title="browse data">{ds.features && ds.features.datasetLabel ? ds.features.datasetLabel : ds.d}</a>;
                }
                dsIcon = ' cubes ';
                //remove links if no access is provided
                if(enableAuthentication && ds.features.hasLimitedAccess && parseInt(ds.features.hasLimitedAccess)){
                    dsIcon = ' unlock '
                    //need to handle access to the dataset
                    //if user is the editor by default he already has view access
                    let editAccess = checkEditAccess(user, ds.d, 0, 0, 0);
                    if(!editAccess.access || editAccess.type === 'partial'){
                        let viewAccess = checkViewAccess(user, ds.d, 0, 0, 0);
                        if(!viewAccess.access){
                            dsLink = <span>{ds.features && ds.features.datasetLabel ? ds.features.datasetLabel : ds.d}</span>;
                            dsIcon = ' lock '
                        }
                    }
                }
                if(ds.features){
                    if(typeof ds.features.readOnly === 'undefined' ){
                        color = 'black';
                    }else{
                        if(ds.features.readOnly){
                            color = 'black';
                        }else{
                            color = 'blue';
                        }
                    }
                }
                if(ds.d !== 'metadata'){
                    return <div className="ui item" key={ds.d}> <div className="content"> <i className={'ui icon ' + dsIcon + color}></i> {dsLink} {ds.features && ds.features.resourceFocusType ? <span className="ui small circular label"> {self.prepareFocusList(ds.features.resourceFocusType)} </span> : ''}
                        {ds.features && ds.features.metadata ? <a className="ui label rounded" href={ds.features.metadata} title="metadata" target="_blank"><i className="info icon"></i>metadata</a> : ''}
                        {/*ds.features && ds.features.isStaticDynamic ? <i className="ui brown theme icon" title="loaded from both static and dynamic config"></i> :''*/}
                        {/*ds.features && ds.features.isDynamic && !ds.features.isStaticDynamic ? <i className="ui orange theme icon" title="loaded from dynamic config"></i> :''*/}
                        {ds.features && ds.features.isDefaultDataset ? <i className="ui teal flag icon" title="default dataset"></i> :''}</div> </div>;
                }
            });
        }
        const containerOrgsClass = classNames({
            'ui inverted orange circular segment': true,
            'secondary': self.state.selectedList.indexOf('orgs') === -1,
            'raised': self.state.selectedList.indexOf('orgs') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('orgs') === -1 && self.state.selectedList.indexOf('orgs') === -1
        });
        const containerLinksslass = classNames({
            'ui inverted black circular segment': true,
            'secondary': self.state.selectedList.indexOf('links') === -1,
            'raised': self.state.selectedList.indexOf('links') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('links') === -1 && self.state.selectedList.indexOf('links') === -1
        });
        const containerOrgRankingClass = classNames({
            'ui inverted brown circular segment': true,
            'secondary': self.state.selectedList.indexOf('orgRanking') === -1,
            'raised': self.state.selectedList.indexOf('orgRanking') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('orgRanking') === -1 && self.state.selectedList.indexOf('orgRanking') === -1
        });
        const containerPersonsClass = classNames({
            'ui inverted blue circular segment': true,
            'secondary': self.state.selectedList.indexOf('persons') === -1,
            'raised': self.state.selectedList.indexOf('persons') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('persons') === -1 && self.state.selectedList.indexOf('persons') === -1
        });
        const containerFundingProgramClass = classNames({
            'ui inverted teal circular segment': true,
            'secondary': self.state.selectedList.indexOf('fundingPrograms') === -1,
            'raised': self.state.selectedList.indexOf('fundingPrograms') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('fundingPrograms') === -1 && self.state.selectedList.indexOf('fundingPrograms') === -1
        });
        const containerGeoLocationslass = classNames({
            'ui inverted circular segment': true,
            'secondary': self.state.selectedList.indexOf('geoLocations') === -1,
            'raised': self.state.selectedList.indexOf('geoLocations') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('geoLocations') === -1 && self.state.selectedList.indexOf('geoLocations') === -1
        });
        const containerProjectslass = classNames({
            'ui inverted green circular segment': true,
            'secondary': self.state.selectedList.indexOf('projects') === -1,
            'raised': self.state.selectedList.indexOf('projects') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('projects') === -1 && self.state.selectedList.indexOf('projects') === -1
        });
        const containerGeoBoundariesClass = classNames({
            'ui inverted yellow circular segment': true,
            'secondary': self.state.selectedList.indexOf('geoBoundaries') === -1,
            'raised': self.state.selectedList.indexOf('geoBoundaries') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('geoBoundaries') === -1 && self.state.selectedList.indexOf('geoBoundaries') === -1
        });
        const containerOthersClass = classNames({
            'ui inverted red circular segment': true,
            'secondary': self.state.selectedList.indexOf('others') === -1,
            'raised': self.state.selectedList.indexOf('others') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('others') === -1 && self.state.selectedList.indexOf('others') === -1
        });
        const containerPublicationsClass = classNames({
            'ui inverted violet circular segment': true,
            'secondary': self.state.selectedList.indexOf('publications') === -1,
            'raised': self.state.selectedList.indexOf('publications') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('publications') === -1 && self.state.selectedList.indexOf('publications') === -1
        });
        const containerGeoStatsClass = classNames({
            'ui inverted pink circular segment': true,
            'secondary': self.state.selectedList.indexOf('geoStats') === -1,
            'raised': self.state.selectedList.indexOf('geoStats') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('geoStats') === -1 && self.state.selectedList.indexOf('geoStats') === -1
        });
        const containerPatentsClass = classNames({
            'ui inverted purple circular segment': true,
            'secondary': self.state.selectedList.indexOf('patents') === -1,
            'raised': self.state.selectedList.indexOf('patents') !== -1,
            'tertiary': self.state.mouseOverList.indexOf('patents') === -1 && self.state.selectedList.indexOf('patents') === -1
        });
        return (
            <div className="ui fluid container ldr-padding-more" ref="datasets">
                <div className="ui grid">
                    <div className="ui column">
                        <div className="ui segment" ref="linker_canvas">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerOrgRankingClass} ref="containerOrgRanking" onMouseOver={this.handleMouseOver.bind(this, 'orgRanking')} onMouseOut={this.handleMouseOut.bind(this, 'orgRanking')} onClick={this.handleMouseClick.bind(this, 'orgRanking')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.orgRanking.length}</div>
                                                Organization Ranking
                                            </div>
                                        </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerFundingProgramClass} ref="containerFundingProgram" onMouseOver={this.handleMouseOver.bind(this, 'fundingPrograms')} onMouseOut={this.handleMouseOut.bind(this, 'fundingPrograms')} onClick={this.handleMouseClick.bind(this, 'fundingPrograms')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.fundingPrograms.length}</div>
                                                Funding Programs
                                            </div>
                                        </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerGeoLocationslass} ref="containerGeoLocations" onMouseOver={this.handleMouseOver.bind(this, 'geoLocations')} onMouseOut={this.handleMouseOut.bind(this, 'geoLocations')} onClick={this.handleMouseClick.bind(this, 'geoLocations')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.geoLocations.length}</div>
                                                <span style={{color: '#FFF'}}>Geo Locations</span>
                                            </div>
                                        </td>
                                        <td>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerLinksslass} ref="containerLinks" onMouseOver={this.handleMouseOver.bind(this, 'links')} onMouseOut={this.handleMouseOut.bind(this, 'links')} onClick={this.handleMouseClick.bind(this, 'links')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.links.length}</div>
                                                <span style={{color: '#FFF'}}>Links</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="7">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <br/>
                                            <br/>
                                            <br/>
                                            <br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerOrgsClass} ref="containerOrgs" onMouseOver={this.handleMouseOver.bind(this, 'orgs')} onMouseOut={this.handleMouseOut.bind(this, 'orgs')} onClick={this.handleMouseClick.bind(this, 'orgs')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.orgs.length}</div>
                                            Organizations
                                                <br/>
                                                <div className="ui inverted disabled black small circular label">Geo</div>
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerProjectslass} ref="containerProjects" onMouseOver={this.handleMouseOver.bind(this, 'projects')} onMouseOut={this.handleMouseOut.bind(this, 'projects')} onClick={this.handleMouseClick.bind(this, 'projects')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.projects.length}</div>
                                            Projects
                                                <br/>
                                                <div className="ui inverted disabled black small circular label">Geo</div>
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerGeoBoundariesClass} ref="containerGeoBoundaries" onMouseOver={this.handleMouseOver.bind(this, 'geoBoundaries')} onMouseOut={this.handleMouseOut.bind(this, 'geoBoundaries')} onClick={this.handleMouseClick.bind(this, 'geoBoundaries')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.geoBoundaries.length}</div>
                                                <span style={{color: '#000'}}>Geo Boundaries</span>
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer'}} className={containerOthersClass} ref="containerOthers" onMouseOver={this.handleMouseOver.bind(this, 'others')} onMouseOut={this.handleMouseOut.bind(this, 'others')} onClick={this.handleMouseClick.bind(this, 'others')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.others.length}</div>
                                            Other Entity Types
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="7">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <br/>
                                            <br/>
                                            <br/>
                                            <br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerPersonsClass} ref="containerPersons" onMouseOver={this.handleMouseOver.bind(this, 'persons')} onMouseOut={this.handleMouseOut.bind(this, 'persons')} onClick={this.handleMouseClick.bind(this, 'persons')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.persons.length}</div>
                                            Persons
                                                <br/>
                                                <div className="ui inverted disabled black small circular label">Geo</div>
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerPublicationsClass} ref="containerPublications" onMouseOver={this.handleMouseOver.bind(this, 'publications')} onMouseOut={this.handleMouseOut.bind(this, 'publications')} onClick={this.handleMouseClick.bind(this, 'publications')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.publications.length}</div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Publications&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerGeoStatsClass} ref="containerGeoStats" onMouseOver={this.handleMouseOver.bind(this, 'geoStats')} onMouseOut={this.handleMouseOut.bind(this, 'geoStats')} onClick={this.handleMouseClick.bind(this, 'geoStats')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.geoStats.length}</div>
                                                <span style={{color: '#000'}}>Geo Statistical Data</span>
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="7">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <br/>
                                            <br/>
                                            <br/>
                                            <br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>

                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>
                                            <div style={{cursor: 'pointer', minHeight: 200, minWidth: 160}} className={containerPatentsClass} ref="containerPatents" onMouseOver={this.handleMouseOver.bind(this, 'patents')} onMouseOut={this.handleMouseOut.bind(this, 'patents')} onClick={this.handleMouseClick.bind(this, 'patents')}>
                                                <div className="ui top left attached small label">{dsCategoryObj.patents.length}</div>
                                            Patents
                                            </div>
                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>

                                        </td>
                                        <td>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {outputX}
                            {errorDIV ? '' :
                                <h2><span className="ui big black circular label">{dss.length}</span> Datasets { self.state.selectedList.length ? <span className="ui tag label">{self.state.selectedList.join(', ')}</span> : ''}</h2>
                            }
                            {errorDIV ? '' : this.props.DatasetsStore.datasetsList.length < 7 ? '' :
                                <div className="ui">
                                    <div className="ui form fluid category search">
                                        <div className="ui large icon input">
                                            <SearchInput className="prompt circular ui fluid category search" onChange={this.searchUpdated} placeholder="Search in datasets..." style={{width: 400}} />
                                            <i className="search icon"></i>
                                        </div>
                                    </div>
                                </div>
                            }

                            <div className="ui big divided list" id="datasetsList">
                                {errorDIV ? errorDIV : output}{errorDIV ? '' : outputDSS}
                                {
                                    !user ?
                                        <div className='ui item'><i className={'ui icon lock'}></i>More private datasets such as WoS and ERC starting grants are provided on-site...</div>
                                        :
                                        ''
                                }
                            </div>
                            <div className= "ui bottom attached">
                                {datasetActionsDIV}
                            </div>
                            {user && dss.length ?
                                <div className="ui grey message form">
                                    <select ref="datasetURI" className="ui search dropdown">
                                        {optionsList}
                                    </select>
                                    <input ref="resourceURI" type="text" className="input" placeholder="Enter the URI of the resource e.g. http://dbpedia.org/resource/VU_University_Amsterdam"/>
                                    <button className="fluid ui primary button" onClick={this.displayResource.bind(this)}>Display resource in the selected dataset</button>
                                </div>
                                : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Datasets.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
Datasets = connectToStores(Datasets, [DatasetsStore], function (context, props) {
    return {
        DatasetsStore: context.getStore(DatasetsStore).getState()
    };
});
export default Datasets;
