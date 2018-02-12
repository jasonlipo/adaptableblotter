import { IRange } from '../../Strategy/Interface/IExportStrategy';
import * as React from "react";
import { DropdownButton, MenuItem, Col } from 'react-bootstrap';
import { EntityListActionButtons } from '../Components/Buttons/EntityListActionButtons';
import { ExportDestination } from '../../Core/Enums';
import { RangeHelper } from '../../Core/Helpers/RangeHelper';
import { OpenfinHelper } from '../../Core/Helpers/OpenfinHelper';
import { ILiveRange } from '../../Strategy/Interface/IExportStrategy';
import { iPushPullHelper } from '../../Core/Helpers/iPushPullHelper';
import { ConfigEntityRowItem } from '../Components/ConfigEntityRowItem';
import { SharedEntityExpressionRowProps } from '../Components/SharedProps/ConfigEntityRowProps';
import { IColItem } from "../Interfaces";
import { AdaptableBlotterForm } from '../AdaptableBlotterForm'

export interface RangeEntityRowProps extends SharedEntityExpressionRowProps<RangeEntityRow> {
    IsLast: boolean
    LiveRanges: ILiveRange[]
    onExport: (exportDestination: ExportDestination) => void;
    onRangeStopLive: (exportDestination: ExportDestination.OpenfinExcel | ExportDestination.iPushPull) => void,
    isDropUp: boolean;
}

export class RangeEntityRow extends React.Component<RangeEntityRowProps, {}> {
    render(): any {
        let range: IRange = this.props.ConfigEntity as IRange;
        let csvMenuItem: any = <MenuItem onClick={() => this.props.onExport(ExportDestination.CSV)} key={"csv"}>{"Export to CSV"}</MenuItem>
        let clipboardMenuItem: any = <MenuItem onClick={() => this.props.onExport(ExportDestination.Clipboard)} key={"clipboard"}> {"Export to Clipboard"}</MenuItem>
        let openfinExcelMenuItem = (this.props.LiveRanges.find(x => x.Range == range.Name)) ?
            <MenuItem onClick={() => this.props.onRangeStopLive(ExportDestination.OpenfinExcel)} key={"OpenfinExcel"}> {"Stop Live Openfin Excel"}</MenuItem>
            : <MenuItem onClick={() => this.props.onExport(ExportDestination.OpenfinExcel)} key={"OpenfinExcel"}> {"Start Live Openfin Excel"}</MenuItem>

        let iPushPullExcelMenuItem = (this.props.LiveRanges.find(x => x.Range == range.Name && x.ExportDestination == ExportDestination.iPushPull)) ?
            <MenuItem onClick={() => this.props.onRangeStopLive(ExportDestination.iPushPull)} key={"IPPExcel"}> {"Stop Sync with iPushPull"}</MenuItem>
            : <MenuItem onClick={() => this.props.onExport(ExportDestination.iPushPull)} key={"IPPExcel"}> {"Start Sync with iPushPull"}</MenuItem>

        // let hasLive = this.props.LiveRanges.find(x => x.Range == range.Name && x.ExportDestination == ExportDestination.iPushPull) != null

        let colItems: IColItem[] = [].concat(this.props.ColItems);

        colItems[0].Content = range.Name
        colItems[1].Content = RangeHelper.GetRangeColumnsDescription(range, this.props.Columns)
        colItems[2].Content = RangeHelper.GetRangeExpressionDescription(range, this.props.Columns, this.props.UserFilters)
        let exportButton = <DropdownButton dropup={this.props.isDropUp}
            bsSize={"small"}
            bsStyle={"default"}
            title={"Export"}
            key={range.Name}
            id={range.Name}                >
            {csvMenuItem}
            {clipboardMenuItem}
            {OpenfinHelper.isRunningInOpenfin() && OpenfinHelper.isExcelOpenfinLoaded() && openfinExcelMenuItem}
            {iPushPullHelper.isIPushPullLoaded() && iPushPullExcelMenuItem}
        </DropdownButton>

        let buttons: any = <EntityListActionButtons
            ConfirmDeleteAction={this.props.onDeleteConfirm}
            editClick={() => this.props.onEdit(this.props.Index, range)}
            showShare={this.props.TeamSharingActivated}
            shareClick={() => this.props.onShare()}
            ConfigEntity={range}
            EntityName="Range" />

        let test = <AdaptableBlotterForm horizontal>
            <Col>
                {exportButton}</Col>
                <Col>{buttons} </Col>
        </AdaptableBlotterForm>
            colItems[3].Content = test
    
        return <ConfigEntityRowItem ColItems={colItems} />
            }
        }
