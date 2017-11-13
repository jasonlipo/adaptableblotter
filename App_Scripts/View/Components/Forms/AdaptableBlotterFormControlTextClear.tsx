import * as React from "react";
import * as Redux from "redux";
import { Helper } from '../../../Core/Helper'
import { StringExtensions } from '../../../Core/Extensions'
import { FormControl, FormControlProps, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { IUIError } from '../../../Core/Interface/IStrategy';
import { IConfigEntity } from '../../../Core/Interface/IAdaptableBlotter';
import * as PopupRedux from '../../../Redux/ActionsReducers/PopupRedux'

export interface AdaptableBlotterFormControlTextClearProps extends FormControlProps {
    OnTextChange: (textValue: string) => void
}

export class AdaptableBlotterFormControlTextClear extends React.Component<AdaptableBlotterFormControlTextClearProps, {}> {
    render() {
        return <ButtonGroup>
            <FormControl
                style={this.props.style}
                type="text"
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={(x) => this.props.OnTextChange((x.target as HTMLInputElement).value)} />
            {
                StringExtensions.IsNotNullOrEmpty(String(this.props.value)) &&
                <Glyphicon className="adaptable_blotter_clear_button" glyph={"remove-circle"} onClick={() => this.props.OnTextChange("")}></Glyphicon>
            }

        </ButtonGroup>
    }
}