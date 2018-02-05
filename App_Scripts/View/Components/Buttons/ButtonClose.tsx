import * as React from "react";
import * as Redux from "redux";
import { Helper } from '../../../Core/Helpers/Helper'
import { Button, OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap';
import { IConfigEntity } from '../../../Core/Interface/IAdaptableBlotter';
import * as PopupRedux from '../../../Redux/ActionsReducers/PopupRedux'
import { ButtonBase, ButtonProps } from './ButtonBase'

export class ButtonClose extends React.Component<ButtonProps, {}> {
    render() {
        return <ButtonBase ToolTipAndText="Close"
            bsStyle='default'
            bsSize={this.props.size}
             ConfigEntity={this.props.ConfigEntity}
            glyph="remove"
            onClick={() => this.props.onClick()}
            overrideDisableButton={this.props.overrideDisableButton}
            overrideTooltip={this.props.overrideTooltip}
            style={this.props.style}
            DisplayMode={this.props.DisplayMode}
            overrideText={this.props.overrideText}
        />;
    }
}

