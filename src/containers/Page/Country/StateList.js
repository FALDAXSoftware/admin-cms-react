import React, { Component } from 'react';
import { Input, Tabs, notification, Row,Button ,Col } from 'antd';
import { stateTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditStateModal from './editStateModal';
import FaldaxLoader from '../faldaxLoader';
// import { Link } from 'react-router-dom';
import authAction from '../../../redux/auth/actions';
// import { BackButton } from '../../Shared/backBttton';
import { BreadcrumbComponent } from '../../Shared/breadcrumb';
import { PageCounterComponent } from '../../Shared/pageCounter';
import { DateTimeCell } from '../../../components/tables/helperCells';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { TABLE_SCROLL_HEIGHT } from '../../../helpers/globals';
import clone from "clone"
import { exportState } from '../../../helpers/exportToCsv/headers';
const { logout } = authAction;
const Search = Input.Search;
// const TabPane = Tabs.TabPane;
var self;

class StateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStates: [],
            searchState: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showEditStateModal: false,
            stateDetails: [],
            stateCount:0,
            openCsvExportModal:"",
            csvData:[]
        }
        self = this;
        StateList.stateStatus = StateList.stateStatus.bind(this);
        StateList.editState = StateList.editState.bind(this);
    }

    static stateStatus(value, name, legality, color, is_active) {
        const { token } = this.props;

        self.setState({ loader: true })
        let message = is_active ? 'State has been inactivated successfully.' : 'State has been activated successfully.'
        let formData = {
            id: value,
            legality,
            color,
            name,
            is_active: !is_active
        };

        ApiUtils.activateState(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self.setState({
                        loader: false, errMsg: true, errMessage: message, errType: 'Success'
                    })
                    self._getAllStates();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, searchState: '' });
                }
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                });
            });
    }

    static editState(value, name, legality, color, is_active) {
        let stateDetails = { value, name, legality, color, is_active };
        self.setState({ showEditStateModal: true, stateDetails })
    }

    componentDidMount = () => {
        this._getAllStates();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllStates = (isExportToCsv=false) => {
        const { token } = this.props;
        const { searchState, sorterCol, sortOrder } = this.state;
        let _this = this;
        let countryId = '';
        let path = this.props.location.pathname.split('/');
        countryId = path[3];
        _this.setState({ loader: true });   
        (isExportToCsv?ApiUtils.getAllStates(token, countryId,""):ApiUtils.getAllStates(token, countryId, searchState, sorterCol, sortOrder))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    // Map to legality
                    if(isExportToCsv){
                    let csvData=clone(res.data);
                    csvData=csvData.map((ele)=>{
                        ele["updated_at"]=isExportToCsv?DateTimeCell(ele["updated_at"],'string'): ele["updated_at"];
                        ele["created_at"]=isExportToCsv?DateTimeCell(ele["created_at"],'string'): ele["created_at"];
                        ele["deleted_at"]=isExportToCsv?DateTimeCell(ele["deleted_at"],'string'): ele["deleted_at"];
                        ele.legality=ele.legality==1?"Legal":ele.legality==2?"Illegal":ele.legality==3?'Neutral':"Partial Services Available";
                        return ele;
                    })
                    _this.state({csvData})  
                   }else{
                        res.data=res.data.map((ele)=>{
                            ele.legality=ele.legality==1?"Legal":ele.legality==2?"Illegal":ele.legality==3?'Neutral':"Partial Services Available";
                            return ele;
                        })
                        _this.setState({ allStates: res.data,stateCount:res.stateCount});
                    }
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, searchState: '' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    loader: false, errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error'
                })
            });
    }

    _closeEditStateModal = () => {
        this.setState({ showEditStateModal: false })
    }

    _searchState = (val) => {
        this.setState({ searchState: val, loader: true }, () => {
            this._getAllStates();
        });
    }

    compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const legalityA = a.legality.toUpperCase();
        const legalityB = b.legality.toUpperCase();
      
        let comparison = 0;
        if (legalityA > legalityB) {
          comparison = 1;
        } else if (legalityA < legalityB) {
          comparison = -1;
        }
        return comparison;
      }

    _handleStateChange = (pagination, filters, sorter) => {
        if(sorter.columnKey=="legality"){
            let {allStates}=this.state;
            if(sorter.order=="ascend"){
                allStates=allStates.sort(this.compare)
            }else if(sorter.order=="descend"){
                allStates=allStates.sort(this.compare)
                allStates=allStates.reverse()
            }
            this.setState({allStates});
        }else{
            this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order }, () => {
                this._getAllStates();
            })
        }
    }

    onExport=()=>{
        this.setState({openCsvExportModal:true},()=>this._getAllStates(true));
      }

    render() {
        const { allStates, errType, errMsg,openCsvExportModal,csvData, loader, showEditStateModal, stateDetails,stateCount } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          <LayoutWrapper>
            {/* <BackButton {...this.props}/> */}
            <BreadcrumbComponent {...this.props} />
            <TableDemoStyle className="isoLayoutContent">
              <PageCounterComponent
                page={0}
                limit={0}
                dataCount={stateCount}
                syncCallBack={this._getAllStates}
              />
              <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} onClose={()=>{this.setState({openCsvExportModal:false})}} filename="states.csv" data={csvData} header={exportState}/>
              <Row type="flex" justify="start" className="table-filter-row">
                <Col lg={8}>
                  <Search
                    placeholder="Search states"
                    onSearch={value => this._searchState(value)}
                    className="edit-profile-input"
                    enterButton
                  />
                </Col>
                <Col lg={3}>
                  <Button
                    type="primary"
                    onClick={this.onExport}
                    icon="export"
                  >
                    Export
                  </Button>
                </Col>
              </Row>
              {loader && <FaldaxLoader />}
              <div>
                <TableWrapper
                  rowKey="id"
                  {...this.state}
                  columns={stateTableInfos[0].columns}
                  pagination={false}
                  dataSource={allStates}
                  className="float-clear"
                  onChange={this._handleStateChange}
                  bordered
                  scroll={TABLE_SCROLL_HEIGHT}
                />
                {showEditStateModal && (
                  <EditStateModal
                    fields={stateDetails}
                    showEditStateModal={showEditStateModal}
                    closeEditStateModal={this._closeEditStateModal}
                    getAllStates={this._getAllStates}
                  />
                )}
              </div>
            </TableDemoStyle>
          </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(StateList);

export { StateList, stateTableInfos };
