import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import BasicAggregateView from './BasicAggregateView';
import BasicAggregateMapView from './BasicAggregateMapView';
import BoundaryMapStore from '../../../../stores/BoundaryMapStore';
import getBoundaries from '../../../../actions/getBoundaries';

class GeoBoundaryView extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //initialize map
        let source= 'GADM';
        if(this.props.config && this.props.config.boundarySource){
            source = this.props.config.boundarySource;
        }
        this.context.executeAction(getBoundaries, {uris: this.props.spec.instances, property: this.props.property, source: source});
    }
    componentDidUpdate(prevProps) {
        let source= 'GADM';
        if(this.props.config && this.props.config.boundarySource){
            source = this.props.config.boundarySource;
        }
        let newProps = this.props;
        let uris = newProps.spec.instances;
        if (prevProps.spec.instances.length !== newProps.spec.instances.length) {
            this.context.executeAction(getBoundaries, {uris: uris, property: this.props.property, source: source});
        }
    }
    render () {
        return (
            <div>
                {this.props.BoundaryMapStore.boundaries[this.props.property] && this.props.BoundaryMapStore.boundaries[this.props.property].length? <BasicAggregateMapView spec={{instances: this.props.BoundaryMapStore.boundaries[this.props.property]}} config={this.props.config}/> :''}
                {this.props.onlyShowMap ? '' :
                    <BasicAggregateView spec={this.props.spec} config={this.props.config} />
                }
            </div>
    	);
    }
}
GeoBoundaryView.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
GeoBoundaryView = connectToStores(GeoBoundaryView, [BoundaryMapStore], function (context, props) {
    return {
        BoundaryMapStore: context.getStore(BoundaryMapStore).getState()
    };
});
export default GeoBoundaryView;
