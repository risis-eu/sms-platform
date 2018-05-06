import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import SearchInAllStore from '../stores/SearchInAllStore';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import {defaultGraphName, authGraphName, enableAuthentication} from '../configs/general';
import {config} from '../configs/reactor';
import URIUtil from './utils/URIUtil';
import searchinAll from '../actions/searchinAll';
import { Accordion, Icon } from 'semantic-ui-react'

class SearchAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {query: ''};
    }
    componentDidMount() {

    }
    handleKeyDown(evt) {
        switch (evt.keyCode) {
            //case 9: // Tab
            case 13: // Enter
                this.handleSearch()
                break;
        }
    }
    handleSearch() {
        let keyword = jQuery.trim(this.refs.keyword.value);
        if(keyword.length > 3){
            this.context.executeAction(searchinAll, {
                keyword: keyword
            });
        }else{

        }
    }
    render() {
        let propList, objList, self = this, cpanels =[];
        let counter = 0, user = this.context.getUser();
        if(this.props.SearchInAllStore.count){
            let items = this.props.SearchInAllStore.suggestions;
            for(let prop in items){
                let row =[];
                items[prop].forEach((re, index)=>{
                    row.push(<tr key={index}><td><a target="_blank" href={'/dataset/'+encodeURIComponent(prop)+'/resource/'+encodeURIComponent(re.resource)}>{URIUtil.getURILabel(re.resource)}</a></td><td>{URIUtil.getURILabel(re.property)}</td><td>{re.text}</td></tr>);
                })
                cpanels.push({
                    content: {
                        content: <table className="ui striped compact table"><tbody>{row}</tbody></table>,
                        key: 'pp'+ prop
                    },
                    title: prop
                });
            }

        }
        return (
            <div className="ui page grid" ref="searchAll">
                <div className="ui row">
                    <div className="center aligned column">
                        <br/><br/>
                        <div className="ui">
                            <div className="ui fluid category search">
                                <div className="ui large icon input">
                                    <input ref="keyword" className="prompt" type="text" placeholder="Search on Linked Open Data..." style={{width: 500}} onKeyDown={this.handleKeyDown.bind(this)}/>
                                    <i className="search icon"></i>
                                </div>
                          &nbsp;<button className="ui grey circular button" onClick={this.handleSearch.bind(this)}>Search in all datasets</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ui row">
                    <div className="center aligned column">
                        <div className="ui relaxed">
                            {this.props.SearchInAllStore.isComplete ? '' : <span className="ui active"><img src="/assets/img/loader.gif" alt="loading..."/> </span>}
                            {this.props.SearchInAllStore.count ? <div><b>{this.props.SearchInAllStore.count}</b> resource(s) found:
                                <br/>
                                <div style={{textAlign: 'left'}}>
                                    <Accordion panels={cpanels} styled exclusive={false} fluid />
                                </div>
                            </div> : ''}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
SearchAll.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
SearchAll = connectToStores(SearchAll, [SearchInAllStore], function (context, props) {
    return {
        SearchInAllStore: context.getStore(SearchInAllStore).getState()
    };
});
export default SearchAll;
