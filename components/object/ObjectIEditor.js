import React from 'react';
import BasicIndividualInput from './editor/individual/BasicIndividualInput';
import BasicTextareaInput from './editor/individual/BasicTextareaInput';
import BasicIndividualDetailEdit from './editor/individual/BasicIndividualDetailEdit';
import BasicOptionInput from './editor/individual/BasicOptionInput';
import DBpediaInput from './editor/individual/DBpediaInput';
import PasswordInput from './editor/individual/PasswordInput';
import LanguageInput from './editor/individual/LanguageInput';
import BasicCalendarInput from './editor/individual/BasicCalendarInput';
import PrefixBasedInput from './editor/individual/PrefixBasedInput';
import ToggleEdit from './editor/individual/ToggleEdit';
import FileSizeInput from './editor/individual/FileSizeInput';
import MediaTypeInput from './editor/individual/MediaTypeInput';

class ObjectIEditor extends React.Component {
    handleDataEdit(value){
        this.props.onDataEdit(value);
    }
    handleDetailDataEdit(detailData){
        this.props.onDetailDataEdit(detailData);
    }
    handleEnterPress(){
        this.props.onEnterPress();
    }
    render() {
        let editor, editorConfig = '', extendedEditor, extendedEditorConfig = '';
        if(this.props.config){
            if(this.props.config.extendedOEditor){
                extendedEditorConfig = this.props.config.extendedOEditor[0];
            }
            if(this.props.config.objectIEditor){
                editorConfig = this.props.config.objectIEditor[0];
            }
        }
        if(this.props.spec.extendedViewData){
            //go to extended edit
            switch(extendedEditorConfig){
                case 'BasicIndividualDetailEdit':
                    extendedEditor = <BasicIndividualDetailEdit spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onDetailDataEdit={this.handleDetailDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)}/>;
                    break;
                default:
                    extendedEditor = <BasicIndividualDetailEdit spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onDetailDataEdit={this.handleDetailDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)}/>;
            }
        }
        //normal edit
        switch(editorConfig){
            case 'BasicIndividualInput':
                editor = <BasicIndividualInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'BasicTextareaInput':
                editor = <BasicTextareaInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)}/>;
                break;
            case 'ToggleEdit':
                editor = <ToggleEdit spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)}/>;
                break;
            case 'PasswordInput':
                editor = <PasswordInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'DBpediaInput':
                editor = <DBpediaInput asWikipedia="1" spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'LanguageInput':
                editor = <LanguageInput spec={this.props.spec} config={this.props.config}   onDataEdit={this.handleDataEdit.bind(this)}/>;
                break;
            case 'BasicCalendarInput':
                editor = <BasicCalendarInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)}/>;
                break;
            case 'BasicOptionInput':
                editor = <BasicOptionInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'PrefixBasedInput':
                editor = <PrefixBasedInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'MediaTypeInput':
                editor = <MediaTypeInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            case 'FileSizeInput':
                editor = <FileSizeInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)}/>;
                break;
            default:
                editor = <BasicIndividualInput spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} allowActionByKey="1" onEnterPress={this.handleEnterPress.bind(this)}/>;
        }
        //check if it has a blank node value config
        let hideObject = 0;
        if(this.props.config && this.props.config.hasBlankNode && extendedEditor){
            hideObject = 1;
        }
        return (
            <div className="ui" ref="objectIEditor">
                {hideObject ? '' : <div className="ui attached message"> {editor} </div>}
                {extendedEditor}
            </div>
        );
    }
}

export default ObjectIEditor;
