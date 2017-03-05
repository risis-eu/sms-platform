import React from 'react';
import DatasetStore from '../stores/DatasetStore';
import {enableAuthentication} from '../configs/general';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink} from 'fluxible-router';


class DatasetsMetadata extends React.Component {
    includesProperty(list, resource) {
        let out = false;
        list.forEach(function(el) {
            if (el.r === resource){
                out = true;
                return out;
            }
        });
        return out;
    }
    checkAccess(user, graph, resource) {
        if(enableAuthentication) {
            if(user){
                if(parseInt(user.isSuperUser)){
                    return {access: true, type: 'full'};
                }else{
                    if(graph && user.editorOfGraph.indexOf(graph) !== -1){
                        return {access: true, type: 'full'};
                    }else{
                        if(resource && user.editorOfResource.indexOf(resource) !== -1){
                            return {access: true, type: 'full'};
                        }else{
                            if(resource && this.includesProperty(user.editorOfProperty, resource)){
                                return {access: true, type: 'partial'};
                            }else{
                                return {access: false};
                            }
                        }
                    }
                }
            }else{
                return {access: false};
            }
        }else{
            return {access: true, type: 'full'};
        }
    }
    render() {
        let userAccess, list, dbClass = 'black database icon';
        let self = this;
        let user = this.context.getUser();
        if(this.props.DatasetStore.dataset.resources){
            list = this.props.DatasetStore.dataset.resources.map(function(node, index) {
                if(!enableAuthentication) {
                    dbClass = 'green database icon';
                }else{
                    userAccess = self.checkAccess(user, node.g, node.v);
                    if(userAccess.access){
                        if(userAccess.type === 'full'){
                            dbClass = 'green database icon';
                        }else{
                            dbClass = 'yellow database icon';
                        }
                    }else{
                        dbClass = 'black database icon';
                    }
                }
                return (
                    <div className="item animated fadeIn" key={index}>
                        <NavLink routeName="resource" href={'/dataset/' + encodeURIComponent(node.g) + '/resource/' + encodeURIComponent(node.v)} >
                        <div className="content"> <i className={dbClass}></i> {node.title} </div>
                      </NavLink>
                    </div>
                );
            });
        }else{
            list = <div className="ui warning message"><div className="header"> Sorry! No dataset found!</div></div>;
        }
        //force login
        if(!user){
            list = <div className="ui warning message"><div className="header"> Please <a href="http://datasets.risis.eu/register">Register</a> or <a href="/login">Login</a> to see the datasets.</div></div>;
        }
        return (
          <div className="ui page grid">
            <div className="row">
              <div className="column">
                <div className="ui blue message">
                      <a href="https://youtu.be/p_2D3ydcx1U" className="ui blue label">Watch</a> the <a href="https://youtu.be/p_2D3ydcx1U">tutorial video</a> on adding metadata for datasets
                </div>
                <h1 className="ui header">RISIS Datasets</h1>
                  <div className="ui segment">
                    <div className="ui huge divided animated list">
                      {list}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        );
    }
}
DatasetsMetadata.contextTypes = {
    getUser: React.PropTypes.func
};
DatasetsMetadata = connectToStores(DatasetsMetadata, [DatasetStore], function (context, props) {
    return {
        DatasetStore: context.getStore(DatasetStore).getState()
    };
});
export default DatasetsMetadata;
