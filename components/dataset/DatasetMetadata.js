import React from 'react';
import ResourceList from './ResourceList';
import ResourceListPager from './ResourceListPager';
import URIUtil from '../utils/URIUtil';
class DatasetMetadata extends React.Component {
    constructor(props){
        super(props);
        this.state = {searchMode: 0};
    }
    handleSearchMode(searchMode) {
        this.setState({searchMode: searchMode});
    }
    componentDidMount() {
    }
    addCommas(n){
        let rx = /(\d+)(\d{3})/;
        return String(n).replace(/^\d+/, function(w){
            while(rx.test(w)){
                w = w.replace(rx, '$1,$2');
            }
            return w;
        });
    }
    render() {
        //check erros first
        if(this.props.error){
            return (
                <div className="ui fluid container ldr-padding" ref="DatasetMetadata">
                    <div className="ui grid">
                        <div className="ui column">
                            <div className="ui warning message"><h2>{this.props.error}</h2></div>
                        </div>
                    </div>
                </div>
            )
        }
        //continue
        let self = this;
        let resourceFocusType = this.props.config.resourceFocusType;
        let typeSt, typesLink = [];
        if(resourceFocusType){
            if(!resourceFocusType.length || (resourceFocusType.length && !resourceFocusType[0]) ){
                typeSt = <span className="ui black label"> Everything </span>;
            }else{
                resourceFocusType.forEach(function(uri) {
                    typesLink.push(<a key={uri} className="ui black label" target="_blank" href={uri}> {URIUtil.getURILabel(uri)} </a>);
                });
                typeSt = typesLink;
            }
        }
        let datasetTitle;
        if(this.props.datasetURI){
            datasetTitle = <a href={this.props.datasetURI}> {this.props.datasetURI} </a>;
            if(this.props.config && this.props.config.datasetLabel){
                datasetTitle = <a href={this.props.datasetURI}> {this.props.config.datasetLabel} </a>;
            }
        }
        let createResourceDIV = '';
        if(this.props.config && !this.props.readOnly && this.props.config.allowResourceNew){
            createResourceDIV = <div className="ui list">
                <div className="item">
                    <div  className="medium ui basic icon labeled button" onClick={this.props.onCreateResource.bind(this, this.props.datasetURI)}>
                        <i className="cube square large blue icon "></i> <i className="add black icon"></i> Add a New Resource
                    </div>
                </div>
                <br/>
            </div>;
        }
        return (
            <div className="ui fluid container ldr-padding" ref="DatasetMetadata">
                <div className="ui grid" ref="DatasetMetadata">
                    <div className="ui column">
                        <h3 className="ui header">
                            {this.props.total ? <a target="_blank" href={'/export/NTriples/' + encodeURIComponent(this.props.datasetURI)}><span className="ui big blue circular label">{this.state.searchMode ? this.addCommas(this.props.resources.length) + '/' :''}{this.addCommas(this.props.total)}</span></a> : ''} Dataset's Metadata
                        </h3>
                        <div className="ui segments">
                            <div className="ui segment">
                                <ResourceList enableAuthentication={this.props.enableAuthentication} resources={this.props.resources} datasetURI={this.props.datasetURI} isBig={true} config={this.props.config} onCloneResource={this.props.onCloneResource}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default DatasetMetadata;
