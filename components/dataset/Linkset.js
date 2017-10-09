import React from 'react';
import PropTypes from 'prop-types';
import URIUtil from '../utils/URIUtil';
import {connectToStores} from 'fluxible-addons-react';
import LinksetStore from '../../stores/LinksetStore';
import getLinksetDetails from '../../actions/getLinksetDetails';
import { Accordion, Dropdown } from 'semantic-ui-react'

class Linkset extends React.Component {
    constructor(props) {
        super(props);
        this.state ={relations: {}}
    }
    componentDidMount() {
        this.context.executeAction(getLinksetDetails, {source: this.props.LinksetStore.dataset.source, target: this.props.LinksetStore.dataset.target, entities: this.props.LinksetStore.dataset.resources});
    }
    handleRel(index, val){
        let tmp = this.state.relations;
        tmp[index] = val;
        this.setState({relations: tmp});
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
        let self = this, sTitle, tTitle, spanels, tpanels , sDetails=[], tDetails=[];
        let list = this.props.LinksetStore.dataset.resources.map((node, index)=> {
            sTitle = node.s;
            tTitle = node.t;
            sDetails = [];
            tDetails = [];
            if(self.props.LinksetStore.dataset.details[node.s] && self.props.LinksetStore.dataset.details[node.s]['http://purl.org/dc/terms/title']){
                sTitle = self.props.LinksetStore.dataset.details[node.s]['http://purl.org/dc/terms/title'][0];
            }
            if(self.props.LinksetStore.dataset.details[node.s]){
                for(let prop in self.props.LinksetStore.dataset.details[node.s]){
                    sDetails.push(<div className="item"><span className="ui small label">{URIUtil.getURILabel(prop)} </span> {URIUtil.truncateMiddle(self.props.LinksetStore.dataset.details[node.s][prop][0], 40)}</div>);
                }
            }
            if(self.props.LinksetStore.dataset.details[node.t]){
                for(let prop in self.props.LinksetStore.dataset.details[node.t]){
                    tDetails.push(<div className="item"><span className="ui small label">{URIUtil.getURILabel(prop)}</span> {URIUtil.truncateMiddle(self.props.LinksetStore.dataset.details[node.t][prop][0], 40)}</div>);
                }
            }

            if(self.props.LinksetStore.dataset.details[node.t] && self.props.LinksetStore.dataset.details[node.t]['http://purl.org/dc/terms/title']){
                tTitle = self.props.LinksetStore.dataset.details[node.t]['http://purl.org/dc/terms/title'][0];
            }
            spanels = [{
                title: sTitle,
                content: <div className="ui divided list">{sDetails}</div>,
            }];
            tpanels = [{
                title: tTitle,
                content: <div className="ui divided list">{tDetails}</div>,
            }];
            return (
                <div className="row" key={index}>
                    <div className="column" >
                        <Accordion panels={spanels} styled />
                    </div>
                    <div className="column">
                        <Dropdown className="ui button" fluid search text={self.state.relations[index] ? self.state.relations[index] : 'Same As'}>
                            <Dropdown.Menu>
                                <Dropdown.Item text='Same As' onClick={self.handleRel.bind(self, index,'Same As')}/>
                                <Dropdown.Item text='->Broader than' onClick={self.handleRel.bind(self, index,'->Broader than')}/>
                                <Dropdown.Item text='Broader than<-' onClick={self.handleRel.bind(self, index,'Broader than<-')}/>
                                <Dropdown.Item text='Narrower than<-' onClick={self.handleRel.bind(self, index,'Narrower than<-')}/>
                                <Dropdown.Item text='->Narrower than' onClick={self.handleRel.bind(self, index,'->Narrower than')}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="column" >
                        <Accordion panels={tpanels} styled />
                    </div>
                </div>
            );
        });
        return (
            <div className="ui fluid container ldr-padding-more" ref="linkset">
                <div className="ui three column centered grid">
                    <h3><span className="ui big black circular label">{this.addCommas(this.props.LinksetStore.dataset.total)}</span> Links found.</h3>
                    <div className="row">
                        <div className="column right attached" >
                            <a className="ui blue fluid button">{this.props.LinksetStore.dataset.source}</a>
                        </div>
                        <div className="column" >
                            <a className="ui fluid black button">relation</a>
                        </div>
                        <div className="column" >
                            <a className="ui green fluid button">{this.props.LinksetStore.dataset.target}</a>
                        </div>
                    </div>
                    {list}
                </div>
            </div>
        );
    }
}
Linkset.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func
};
Linkset = connectToStores(Linkset, [LinksetStore], function (context, props) {
    return {
        LinksetStore: context.getStore(LinksetStore).getState()
    };
});
export default Linkset;
