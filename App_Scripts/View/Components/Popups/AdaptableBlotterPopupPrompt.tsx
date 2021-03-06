import * as React from "react";
//we use that syntax to import the default export from the module.... Took me a while to find the syntax
import SweetAlert from 'react-bootstrap-sweetalert'
import * as StyleConstants from '../../../Core/Constants/StyleConstants';


export interface AdaptableBlotterPopupPromptProps extends React.ClassAttributes<AdaptableBlotterPopupPrompt> {
    ShowPopup: boolean
    Title: string
    Msg: string
    onClose: Function
    onConfirm: Function
}


export class AdaptableBlotterPopupPrompt extends React.Component<AdaptableBlotterPopupPromptProps, {}> {
    render() {
        return this.props.ShowPopup && <div className={StyleConstants.POPUP_PROMPT}>
            <SweetAlert
                input
                showCancel
                placeholder={this.props.Msg}
                confirmBtnBsStyle="primary"
                cancelBtnBsStyle="default"
                title={this.props.Title}
                onConfirm={(inputValue: any) => this.props.onConfirm(inputValue)}
                onCancel={() => this.props.onClose()}
            >
            </SweetAlert>
        </div>
    }
}