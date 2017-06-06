import React from 'react';
import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import DatasetsStore from '../stores/DatasetsStore';
import DatasetGeoEnrichmentStore from '../stores/DatasetGeoEnrichmentStore';
import {navigateAction} from 'fluxible-router';
import {enableAuthentication, enableDatasetAnnotation, baseResourceDomain} from '../configs/general';
import {checkViewAccess, checkEditAccess} from '../services/utils/accessManagement';
import { Button, Divider, Form, Progress } from 'semantic-ui-react';
import PrefixBasedInput from './object/editor/individual/PrefixBasedInput';
import BasicMapView from './object/viewer/individual/BasicMapView';
import url from 'url';
import geoEnrichDataset from '../actions/geoEnrichDataset';
import countGeoEnrichedResourcesWithProp from '../actions/countGeoEnrichedResourcesWithProp';

class DatasetGeoEnrichment extends React.Component {
    constructor(props){
        super(props);
        this.state = {storingDataset: '', datasetURI: '', resourceType: '', propertyURI: '', longPropertyURI: '', latPropertyURI: '', countryPropertyURI: '', annotationMode: 0, storeInNewDataset : false, boundarySource: 'GADM', hasCoords: false};
    }
    componentDidMount() {
    }
    componentDidUpdate() {

    }
    compareObjProps(a,b) {
        if (a.count < b.count)
            return 1;
        if (a.count > b.count)
            return -1;
        return 0;
    }
    generateTagArray(obj){
        let tags = [];
        for(let prop in obj){
            tags.push({uri: obj[prop].uri, count: obj[prop].count, text: obj[prop].text, level: obj[prop].level});
        }
        tags.sort(this.compareObjProps);
        //limit it to 500
        if(tags.length>2000){
            tags = tags.slice(0, 2000);
        }
        return tags;
    }
    handleChange(element, e){
        if(element=== 'datasetURI'){
            if(e.target.value){
                this.setState({datasetURI: e.target.value.trim()});
            }else{
                this.setState({datasetURI: ''});
            }
        }else if(element=== 'resourceType'){
            this.setState({resourceType: e.target.value.trim()});
        }else if(element=== 'propertyURI'){
            this.setState({propertyURI: e.target.value.trim()});
        }
    }
    handleResourceURIChange(val){
        this.setState({resourceType: val.trim()});
    }
    handlePropertyURIChange(val){
        this.setState({propertyURI: val.trim()});
    }
    handleLongPropertyChange(val){
        this.setState({longPropertyURI: val.trim()});
    }
    handleLatPropertyChange(val){
        this.setState({latPropertyURI: val.trim()});
    }
    handleCountryPropertyChange(val){
        this.setState({countryPropertyURI: val.trim()});
    }
    handleStoringCheckBox(e, t){
        if(t.value === '1'){
            //create a new random dataset URI
            let newDatasetURI = baseResourceDomain[0] + '/gestore' + Math.round(+new Date() / 1000);
            //do not add two slashes
            if(baseResourceDomain[0].slice(-1) === '/'){
                newDatasetURI = baseResourceDomain[0] + 'gestore' + Math.round(+new Date() / 1000);
            }
            this.setState({storeInNewDataset: true, storingDataset: newDatasetURI});
        }else{
            this.setState({storeInNewDataset: false, storingDataset: ''});
        }
    }
    handleIsGeocodedCheckBox(e, t){
        if(t.value === '1'){
            this.setState({hasCoords: true});
        }else{
            this.setState({hasCoords: false});
        }
    }
    handleEnrichmentTypeCheckBox(e, t){
        this.setState({boundarySource: t.value});
    }
    startInterval(){
        let self=this;
        //set an interval for progress bar
        let intervalId = setInterval(()=>{
            self.context.executeAction(countGeoEnrichedResourcesWithProp, {
                id: self.state.storeInNewDataset ? self.state.storingDataset : self.state.datasetURI,
                resourceType: self.state.resourceType,
                propertyURI: self.state.propertyURI,
                boundarySource: self.state.boundarySource,
                inANewDataset: self.state.storingDataset
            });
            if(self.props.DatasetGeoEnrichmentStore.stats.annotated && self.props.DatasetGeoEnrichmentStore.stats.annotated===self.props.DatasetGeoEnrichmentStore.stats.total){
                clearInterval(intervalId);
            }
        }, 2200);
        this.setState({intervalId: intervalId});
    }
    handleAnnotateDataset() {
        let self=this;
        if(self.state.datasetURI && self.state.propertyURI){
            self.startInterval();
            self.setState({annotationMode: 1});
            self.context.executeAction(geoEnrichDataset, {
                id: self.state.datasetURI,
                resourceType: self.state.resourceType,
                propertyURI: self.state.propertyURI,
                storingDataset: self.state.storingDataset,
                boundarySource: self.state.boundarySource,
                latPropertyURI: self.state.latPropertyURI,
                longPropertyURI: self.state.longPropertyURI,
                countryPropertyURI: self.state.countryPropertyURI,
                datasetLabel: self.findDatasetLabel(self.state.datasetURI)
            });
        }
    }
    findDatasetLabel(datasetURI) {
        let dss = this.props.DatasetsStore.datasetsList;
        let label = datasetURI;
        dss.forEach((node)=>{
            if(node.features && node.features.datasetLabel && node.d === datasetURI){
                label = node.features.datasetLabel;
                return label;
            }
        });
        return label;
    }
    handleNewDatasetChange(event) {
        this.setState({storingDataset: event.target.value});
    }
    render() {
        let optionsList, dss = this.props.DatasetsStore.datasetsList;
        let self = this, errorDIV='', formDIV='';
        let user = this.context.getUser();
        let allowChangingNewDataset= false;
        //only admin can change the random new dataset!
        if (user && (parseInt(user.isSuperUser) || user.member.indexOf('http://rdf.risis.eu/user/SMSTeam') !== -1)) {
            allowChangingNewDataset = true;
        }
        if(enableAuthentication && !user){
            errorDIV = <div className="ui warning message"><div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to see the datasets.</div></div>;
        }else{
            if(!enableDatasetAnnotation){
                errorDIV = <div className="ui warning message"><div className="header"> It is not possible to annotate datasets in this application!</div></div>;
            }else if (!dss.length){
                errorDIV = <div className="ui warning message"><div className="header"> No dataset found for annotations!</div></div>;
            }
        }
        let tmpOption = '';
        optionsList = dss.map(function(option, index) {
            tmpOption = <option key={index} value={(option.d)}> {(option.d && option.features.datasetLabel) ? option.features.datasetLabel : option.d} </option>;
            //filter out datasets if no access is provided
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
            if(tmpOption){
                return tmpOption;
            }
        });
        let tagsDIV = self.generateTagArray(this.props.DatasetGeoEnrichmentStore.tags).map((node, index)=>{
            return (<div className='ui basic label' key={index}><a href={node.uri} target="_blank">{node.text}</a> ({node.count})</div>);
        });
        if(!errorDIV){
            formDIV =
            <Form size='big'>
                <div className="ui info message">
                    This feature helps you to geocode addresses you have in your dataset and also to find their container boundaries.
                </div>
                <b>* Dataset</b>
                <select ref="datasetURI" className="ui search dropdown" onChange={this.handleChange.bind(this, 'datasetURI')}>
                    <option value={''}> Select a Dataset </option>
                    {optionsList}
                </select>
                <Divider hidden />
                <b>URI of the resource types</b>
                <PrefixBasedInput includeOnly={['ldrClasses', 'classes']} noFocus={true} spec={{value:''}} onDataEdit={this.handleResourceURIChange.bind(this)} placeholder="URI of the resource types to be geo-enrichment / leave empty for all focused types" allowActionByKey={false}/>
                <Divider hidden />
                <b>* URI of the property used for geo-enrichment</b>
                <PrefixBasedInput includeOnly={['ldrProperties', 'properties']} noFocus={true} spec={{value:''}} onDataEdit={this.handlePropertyURIChange.bind(this)} placeholder="URI of the property for which the values are geo-enrichment" allowActionByKey={false}/>
                <div className="ui secondary segment">
                    <Form.Group>
                        <label>Is your dataset already geocoded? (i.e. already has geo coordinates.)</label>
                        <Form.Radio label='No, it needs geocoding too.' name='idGeocoded' value='0' checked={!this.state.hasCoords} onChange={this.handleIsGeocodedCheckBox.bind(this)} />
                        <Form.Radio label='Yes, there is no need for geocoding it again!' name='idGeocoded' value='1' checked={this.state.hasCoords} onChange={this.handleIsGeocodedCheckBox.bind(this)} />
                    </Form.Group>
                    {!this.state.hasCoords ? '' :
                        <div>
                            <b>* URI of the "longitude" property</b>
                            <PrefixBasedInput includeOnly={['ldrProperties', 'properties']} noFocus={true} spec={{value:''}} onDataEdit={this.handleLongPropertyChange.bind(this)} placeholder="URI of the property which has longitude value" allowActionByKey={false}/>
                            <Divider hidden />
                            <b>* URI of the "latitude" property</b>
                            <PrefixBasedInput includeOnly={['ldrProperties', 'properties']} noFocus={true} spec={{value:''}} onDataEdit={this.handleLatPropertyChange.bind(this)} placeholder="URI of the property which has latitude value" allowActionByKey={false}/>
                            <Divider hidden />
                            <b>URI of the "country" property (will result in faster boundary recognition if provided)</b>
                            <PrefixBasedInput includeOnly={['ldrProperties', 'properties']} noFocus={true} spec={{value:''}} onDataEdit={this.handleCountryPropertyChange.bind(this)} placeholder="URI of the property which has country ISO code / leave it empty if there is not such a property " allowActionByKey={false}/>
                        </div>
                    }
                </div>
                <div className="ui segment">
                    <Form.Group>
                        <label>Source of Boundaries for Geo-enrichment</label>
                        <Form.Radio label='GADM' name='gadmB' value='GADM' checked={this.state.boundarySource== 'GADM'} onChange={this.handleEnrichmentTypeCheckBox.bind(this)} />
                        <Form.Radio label='OpenStreetMap' name='osmB' value='OSM' checked={this.state.boundarySource== 'OSM'} onChange={this.handleEnrichmentTypeCheckBox.bind(this)} />
                    </Form.Group>
                </div>
                <div className="ui tertiary segment">
                    <Form.Group>
                        <label>Store geo-enrichments in a new dataset?</label>
                        <Form.Radio label='No, just enrich the original dataset' name='storeAnn' value='0' checked={!this.state.storeInNewDataset} onChange={this.handleStoringCheckBox.bind(this)} />
                        <Form.Radio label='Yes, create a new dataset for geo-enrichments' name='storeAnn' value='1' checked={this.state.storeInNewDataset} onChange={this.handleStoringCheckBox.bind(this)} />
                    </Form.Group>
                </div>
                <Divider hidden />
                {allowChangingNewDataset && this.state.storeInNewDataset ?
                    <input ref="newDatasetInput" type="text" value={this.state.storingDataset} placeholder="Add URI of the new dataset" onChange={this.handleNewDatasetChange.bind(this)} />
                : ''}
                <Divider hidden />
                <div className='ui big blue button' onClick={this.handleAnnotateDataset.bind(this)}>Geo-enrich  Dataset</div>
                <Divider hidden />
            </Form>;
        }
        let progressDIV = '';
        if(this.state.annotationMode){
            formDIV = '';
            progressDIV = <div>
                <div className='ui list'>
                    <div className='item'>Dataset: <b><a href={'/dataset/1/'+encodeURIComponent(this.state.datasetURI)} target="_blank">{this.findDatasetLabel(this.state.datasetURI)}</a></b> {!this.state.storingDataset ? '' : <span> -> <b><a href={'/browse/'+encodeURIComponent(this.state.storingDataset)} target="_blank">[Geo-enriched] {this.findDatasetLabel(this.state.datasetURI)}</a></b></span>} </div>
                    {!this.state.resourceType ? '' : <div className='item'>Resource Type: <b>{this.state.resourceType}</b></div>}
                    <div className='item'>Property used: <b>{this.state.propertyURI}</b></div>
                    <div className='item'>Boundary Source: <b>{this.state.boundarySource}</b></div>
                </div>
                { (this.props.DatasetGeoEnrichmentStore.stats.annotated && this.props.DatasetGeoEnrichmentStore.stats.annotated===this.props.DatasetGeoEnrichmentStore.stats.total) ?
                    <Progress percent={100} progress success>
                        Enriched {this.props.DatasetGeoEnrichmentStore.stats.annotated} out of {this.props.DatasetGeoEnrichmentStore.stats.total} items
                    </Progress>
                    :
                    <div>
                        <Progress percent={this.props.DatasetGeoEnrichmentStore.stats.annotated ? Math.floor((this.props.DatasetGeoEnrichmentStore.stats.annotated / this.props.DatasetGeoEnrichmentStore.stats.total) * 100) : 0} progress active color='blue'>
                            Enriched {this.props.DatasetGeoEnrichmentStore.stats.annotated} out of {this.props.DatasetGeoEnrichmentStore.stats.total} items <a className="ui button mini circular" onClick={this.handleAnnotateDataset.bind(this)}><i className="ui icon blue refresh"></i> refresh</a>
                        </Progress>
                        <div className="ui raised stacked segments">
                          <div className="ui secondary compact segment">
                            <a href={'/dataset/' + encodeURIComponent(this.state.datasetURI) + '/resource/'+encodeURIComponent(this.props.DatasetGeoEnrichmentStore.currentID)} target="_blank">{this.props.DatasetGeoEnrichmentStore.currentID}</a>
                          </div>
                          <div className="ui compact segment">
                            address: <b>{this.props.DatasetGeoEnrichmentStore.currentText}</b>
                            <br/>
                            formatted: <b>{this.props.DatasetGeoEnrichmentStore.formattedText}</b>
                            <br/>
                            <BasicMapView spec={{value: this.props.DatasetGeoEnrichmentStore.geometry}} config={{mapWidth: 200, mapHeight:200}} />
                          </div>
                        </div>
                    </div>
                }
                <div className='ui segment'>
                    {tagsDIV}
                </div>
            </div>
        }
        return (
            <div className="ui fluid container ldr-padding-more" ref="datasets">
            <div className="ui grid">
                <div className="ui column">
                    <h2>Geo-enrich dataset</h2>
                    {errorDIV}
                    {formDIV}
                    {progressDIV}
                </div>
            </div>
            </div>
        );
    }
}
DatasetGeoEnrichment.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};
DatasetGeoEnrichment = connectToStores(DatasetGeoEnrichment, [DatasetsStore, DatasetGeoEnrichmentStore], function (context, props) {
    return {
        DatasetsStore: context.getStore(DatasetsStore).getState(),
        DatasetGeoEnrichmentStore: context.getStore(DatasetGeoEnrichmentStore).getState()
    };
});
export default DatasetGeoEnrichment;
