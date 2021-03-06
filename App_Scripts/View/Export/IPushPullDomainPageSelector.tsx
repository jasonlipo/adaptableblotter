import * as React from "react";
import * as Redux from "redux";
import { connect } from 'react-redux';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { StrategyViewPopupProps } from '../Components/SharedProps/StrategyViewPopupProps'
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Button, Glyphicon } from 'react-bootstrap';
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as ExportRedux from '../../Redux/ActionsReducers/ExportRedux'
import { IPPDomain, ILiveReport } from "../../Strategy/Interface/IExportStrategy";
import { StringExtensions } from "../../Core/Extensions/StringExtensions";
import { ExportDestination } from "../../Core/Enums";
import * as StyleConstants from '../../Core/Constants/StyleConstants';

interface IPushPullDomainPageSelectorProps extends StrategyViewPopupProps<IPushPullDomainPageSelectorComponent> {
    IPPDomainsPages: IPPDomain[]
    onApplyExport: (value: string, folder: string, page: string) => ExportRedux.ExportApplyAction;
    onCancel: () => PopupRedux.PopupHideAction
    ErrorMsg: string
    LiveReports: ILiveReport[];
}

interface IPushPullDomainPageSelectorInternalState {
    SelectedFolder: string
    SelectedPage: string
}

class IPushPullDomainPageSelectorComponent extends React.Component<IPushPullDomainPageSelectorProps, IPushPullDomainPageSelectorInternalState> {
    constructor() {
        super();
        this.state = { SelectedFolder: null, SelectedPage: null }
    }
    render() {
        let cssClassName: string = StyleConstants.PUSHPULL_PAGE_SELECTOR
        let itemsElements: any[] = []
        this.props.IPPDomainsPages.forEach(x => {
            // let itemsElements = this.props.IPPDomainsPages.map(x => {
            if (x.Name == this.state.SelectedFolder) {
                itemsElements.push(<ListGroupItem key={x.Name}
                    onClick={() => { this.UnSelectFolder() }}
                    value={x.Name} ><Glyphicon glyph="folder-open" ></Glyphicon>{' '}{x.Name}</ListGroupItem>)
                x.Pages.forEach((page: string) => {
                    itemsElements.push(<ListGroupItem key={page} style={{ paddingLeft: '30px' }}
                        disabled={this.props.LiveReports.findIndex(x => x.WorkbookName == page) > -1}
                        onClick={() => { this.SelectPage(page) }} active={this.state.SelectedPage == page}
                        value={page} ><Glyphicon glyph="cloud-download" ></Glyphicon>{' '}{page}</ListGroupItem>)
                })
            }
            else {
                itemsElements.push(<ListGroupItem key={x.Name}
                    onClick={() => { this.SelectFolder(x.Name) }}
                    value={x.Name} ><Glyphicon glyph="folder-close" ></Glyphicon>{' '}{x.Name}</ListGroupItem>)
            }
        })
        return <PanelWithButton cssClassName={cssClassName} headerText="iPushPull Folder and Page Selector" bsStyle="primary" glyphicon="export">


            {StringExtensions.IsNotNullOrEmpty(this.props.ErrorMsg) ? <Alert bsStyle="danger">
                Error getting iPushPull Pages : {this.props.ErrorMsg}
            </Alert> : <ListGroup fill className="ab_preview_panel">
                    {itemsElements}
                </ListGroup>}
            <Button className="ab_right_modal_button" onClick={() => { this.props.onCancel() }}>Cancel <Glyphicon glyph="remove" /></Button>
            <Button disabled={StringExtensions.IsNullOrEmpty(this.state.SelectedPage)}
                className="ab_right_modal_button" bsStyle="primary"
                onClick={() => { this.props.onApplyExport(this.props.PopupParams, this.state.SelectedFolder, this.state.SelectedPage) }}>
                <Glyphicon glyph="user" /> Select</Button>
        </PanelWithButton>
    }

    SelectFolder(folder: string) {
        this.setState({ SelectedFolder: folder })
    }
    SelectPage(page: string) {
        this.setState({ SelectedPage: page })
    }
    UnSelectFolder() {
        this.setState({ SelectedFolder: "", SelectedPage: "" })
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        IPPDomainsPages: state.Export.IPPDomainsPages,
        ErrorMsg: state.Export.ErrorMsg,
        LiveReports: state.Export.CurrentLiveReports,
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onApplyExport: (value: string, folder: string, page: string) => dispatch(ExportRedux.ExportApply(value, ExportDestination.iPushPull, folder, page)),
        onCancel: () => { dispatch(PopupRedux.PopupHide()); dispatch(ExportRedux.ReportSetErrorMsg("")) }
    };
}

export let IPushPullDomainPageSelector = connect(mapStateToProps, mapDispatchToProps)(IPushPullDomainPageSelectorComponent);



