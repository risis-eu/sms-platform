import React from 'react';
import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import DatasetsStore from '../stores/DatasetsStore';
import DatasetAnnotationStore from '../stores/DatasetAnnotationStore';
import {navigateAction} from 'fluxible-router';
import {enableAuthentication, enableDatasetAnnotation, baseResourceDomain} from '../configs/general';
import { Button, Divider, Form, Progress } from 'semantic-ui-react';
import PrefixBasedInput from './object/editor/individual/PrefixBasedInput';
import url from 'url';
import annotateDataset from '../actions/annotateDataset';
import countAnnotatedResourcesWithProp from '../actions/countAnnotatedResourcesWithProp';

class DatasetAnnotation extends React.Component {
    constructor(props){
        super(props);
        this.state = {storingDataset: '', datasetURI: '', resourceType: '', propertyURI: '', annotationMode: 0, storeInNewDataset : false};
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
            tags.push({uri: prop, count: obj[prop].count, text: obj[prop].text});
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
    handleStoringCheckBox(e, t){
        if(t.value === '1'){
            //create a new random dataset URI
            let newDatasetURI = baseResourceDomain[0] + '/astore' + Math.round(+new Date() / 1000);
            //do not add two slashes
            if(baseResourceDomain[0].slice(-1) === '/'){
                newDatasetURI = baseResourceDomain[0] + 'astore' + Math.round(+new Date() / 1000);
            }
            this.setState({storeInNewDataset: true, storingDataset: newDatasetURI});
        }else{
            this.setState({storeInNewDataset: false, storingDataset: ''});
        }
    }
    startInterval(){
        let self=this;
        //set an interval for progress bar
        let intervalId = setInterval(()=>{
            self.context.executeAction(countAnnotatedResourcesWithProp, {
                id: self.state.storeInNewDataset ? self.state.storingDataset : self.state.datasetURI,
                resourceType: self.state.resourceType,
                propertyURI: self.state.propertyURI,
                inANewDataset: self.state.storeInNewDataset
            });
            if(self.props.DatasetAnnotationStore.stats.annotated && self.props.DatasetAnnotationStore.stats.annotated===self.props.DatasetAnnotationStore.stats.total){
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
            self.context.executeAction(annotateDataset, {
                id: self.state.datasetURI,
                resourceType: self.state.resourceType,
                propertyURI: self.state.propertyURI,
                storingDataset: self.state.storingDataset,
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
    render() {
        let optionsList, dss = this.props.DatasetsStore.datasetsList;
        let self = this, errorDIV='', formDIV='';
        let user = this.context.getUser();
        if(enableAuthentication && !user){
            errorDIV = <div className="ui warning message"><div className="header"> Please <a href="/register">Register</a> or <a href="/login">Login</a> to see the datasets.</div></div>;
        }else{
            if(!enableDatasetAnnotation){
                errorDIV = <div className="ui warning message"><div className="header"> It is not possible to annotate datasets in this application!</div></div>;
            }else if (!dss.length){
                errorDIV = <div className="ui warning message"><div className="header"> No dataset found for annotations!</div></div>;
            }
        }
        optionsList = dss.map(function(option, index) {
            return <option key={index} value={(option.d)}> {(option.features && option.features.datasetLabel) ? option.features.datasetLabel : option.d} </option>;
        });
        let tagsDIV = self.generateTagArray(this.props.DatasetAnnotationStore.tags).map((node, index)=>{
            return (<div className='ui basic label' key={index}><a href={node.uri} target="_blank">{node.text}</a> ({node.count})</div>);
        });
        if(!errorDIV){
            formDIV =
            <Form size='big'>
                <b>* Dataset</b>
                <select ref="datasetURI" className="ui search dropdown" onChange={this.handleChange.bind(this, 'datasetURI')}>
                    <option value={''}> Select a Dataset </option>
                    {optionsList}
                </select>
                <Divider hidden />
                <b>URI of the resource types</b>
                <PrefixBasedInput includeOnly={['ldrClasses', 'classes']} noFocus={true} spec={{value:''}} onDataEdit={this.handleResourceURIChange.bind(this)} placeholder="URI of the resource types to be annotated / leave empty for all resources" allowActionByKey={false}/>
                <Divider hidden />
                <b>* URI of the property used for annotation</b>
                <PrefixBasedInput includeOnly={['ldrProperties', 'properties']} noFocus={true} spec={{value:''}} onDataEdit={this.handlePropertyURIChange.bind(this)} placeholder="URI of the property for which the values are annotated" allowActionByKey={false}/>
                <Form.Group>
                    <label>Store annotations in a new dataset?</label>
                    <Form.Radio label='No, just enrich the original dataset' name='storeAnn' value='0' checked={!this.state.storeInNewDataset} onChange={this.handleStoringCheckBox.bind(this)} />
                    <Form.Radio label='Yes, create a new dataset for annotations' name='storeAnn' value='1' checked={this.state.storeInNewDataset} onChange={this.handleStoringCheckBox.bind(this)} />
                </Form.Group>
                <Divider hidden />
                <div className='ui big blue button' onClick={this.handleAnnotateDataset.bind(this)}>Annotate  Dataset</div>
                <Divider hidden />
            </Form>;
        }
        let progressDIV = '';
        if(this.state.annotationMode){
            formDIV = '';
            progressDIV = <div>
                <div className='ui list'>
                    <div className='item'>Dataset: <b><a href={'/dataset/1/'+encodeURIComponent(this.state.datasetURI)} target="_blank">{this.findDatasetLabel(this.state.datasetURI)}</a></b> {!this.state.storingDataset ? '' : <span> -> <b><a href={'/browse/'+encodeURIComponent(this.state.storingDataset)} target="_blank">[Annotated] {this.findDatasetLabel(this.state.datasetURI)}</a></b></span>} </div>
                    {!this.state.resourceType ? '' : <div className='item'>Resource Type: <b>{this.state.resourceType}</b></div>}
                    <div className='item'>Property used: <b>{this.state.propertyURI}</b></div>
                </div>
                { (this.props.DatasetAnnotationStore.stats.annotated && this.props.DatasetAnnotationStore.stats.annotated===this.props.DatasetAnnotationStore.stats.total) ?
                    <Progress percent={100} progress success>
                        Enriched {this.props.DatasetAnnotationStore.stats.annotated} out of {this.props.DatasetAnnotationStore.stats.total} items
                    </Progress>
                    :
                    <div>
                        <Progress percent={this.props.DatasetAnnotationStore.stats.annotated ? Math.floor((this.props.DatasetAnnotationStore.stats.annotated / this.props.DatasetAnnotationStore.stats.total) * 100) : 0} progress active color='blue'>
                            Enriched {this.props.DatasetAnnotationStore.stats.annotated} out of {this.props.DatasetAnnotationStore.stats.total} items <a className="ui button mini circular" onClick={this.handleAnnotateDataset.bind(this)}><i className="ui icon blue refresh"></i> refresh</a>
                        </Progress>
                        <div className="ui raised stacked segments">
                          <div className="ui secondary compact segment">
                            <a href={'/dataset/' + encodeURIComponent(this.state.datasetURI) + '/resource/'+encodeURIComponent(this.props.DatasetAnnotationStore.currentID)} target="_blank">{this.props.DatasetAnnotationStore.currentID}</a>
                          </div>
                          <div className="ui compact segment">
                            <div dangerouslySetInnerHTML={{__html: this.props.DatasetAnnotationStore.annotatedText}} />
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
            <div className="ui page grid" ref="datasets">
                <div className="ui column">
                    <h2>Annotate dataset</h2>
                    {errorDIV}
                    {formDIV}
                    {progressDIV}
                </div>
            </div>
        );
    }
}
DatasetAnnotation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};
DatasetAnnotation = connectToStores(DatasetAnnotation, [DatasetsStore, DatasetAnnotationStore], function (context, props) {
    return {
        DatasetsStore: context.getStore(DatasetsStore).getState(),
        DatasetAnnotationStore: context.getStore(DatasetAnnotationStore).getState()
    };
});
export default DatasetAnnotation;
