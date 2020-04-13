import React, { Component } from 'react';
import { notification, Pagination,Icon,Button,Form, Row, Col,Select,Input } from 'antd';
import { tierPendingReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import ApiUtils from '../../../helpers/apiUtills';
import FaldaxLoader from "../faldaxLoader";
import { PAGE_SIZE_OPTIONS,TABLE_SCROLL_HEIGHT, PAGESIZE } from "../../../helpers/globals";
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { PageCounterComponent } from '../../Shared/pageCounter';
import { exportTier } from '../../../helpers/exportToCsv/headers';
import { PendingTierReqActionCell, getTierDoc } from '../../../components/tables/helperCells';

const { logout } = authAction;
const {Option}=Select;
var self;

class PendingRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingRequests:[],
            page:1,
            limit:PAGESIZE,
            tradeCount:0,
            searchData:"",
            type:"",
            csvData:[],
            openCsvExportModal:false
        }
        self = this;
        PendingRequests.approvePendingReq = PendingRequests.approvePendingReq.bind(this);
    }
    
    componentDidMount(){
        this.getAllPendingRequest();
    }

    onSearch=(e)=>{
        e.preventDefault();
        this.getAllPendingRequest();
    }
    formateTradeRequest(data){
      let tradeData=[];
      for(let i of data){
        // let index=data.indexOf(i);
        if(tradeData.length==0){
          tradeData.push({
            email:i["email"],
            name:i["first_name"]+" "+i["last_name"],
            data:[i]

          })
        }else{
          let found=false;
          for(let i2 of tradeData){
            let index=tradeData.indexOf(i2);
            let tradeIndex=tradeData.findIndex(ele=>ele["email"]==i["email"]);
            if(tradeIndex!=-1){
              tradeData[tradeIndex]["data"].push(i);
              found=true;
              break
            }
          }
          if(!found){
            tradeData.push({
              email:i["email"],
              name:i["first_name"]+" "+i["last_name"],
              data:[i]
  
            })
          }
        }
      }
      return tradeData;
    }

    getAllPendingRequest=(isExportToCsv=false)=>{
        const { token } = this.props;
        const { sorterCol, sortOrder,limit,page,type,searchData } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getAllTierRequests(token,this.props.tier, sorterCol, sortOrder,100000,1,undefined,1,searchData,type):ApiUtils.getAllTierRequests(token,this.props.tier, sorterCol, sortOrder,limit,page,undefined,1,searchData,type))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                  if(isExportToCsv){
                    _this.setState({
                      csvData:res.tradeData
                    })
                  }else{
                    let data=_this.formateTradeRequest(res.tradeData)
                    _this.setState({
                      pendingRequests:data,
                      tradeCount:res.tradeCount
                    });
                  }
                  } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.', loader: false
                });
            }); 
    }
    static approvePendingReq(value, first_name, last_name, tier_step, is_approved, user_id) {
        const { token } = self.props;
        self.setState({ loader: true })
        ApiUtils.approveRejectRequest(token, tier_step,value, is_approved,user_id)
            .then((response) => response.json())
            .then((res)=> {
                if (res.status == 200) {
                    self.setState({ errMsg: true, errMessage: res.message, errType: 'Success' });
                    self.getAllPendingRequest();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                    self.setState({ loader: false })
                } else {
                    self.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    self.setState({ loader: false })
                }
            })
            .catch(() => {
                self.setState({
                    errType: 'error', errMsg: true, errMessage: 'Unable to complete the requested action.', loader: false
                });
            });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.setState({ pendingRequests: nextProps.data })
        }
    }
    onExport=()=>{
      this.setState({openCsvExportModal:true},()=>this.getAllPendingRequest(true));
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };
    
    changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
          this.getAllPendingRequest();
        });
      };
    
    _handlePagination = page => {
        this.setState({ page }, () => {
          this.getAllPendingRequest();
        });
      };

    render() {
        const { errType, errMsg, pendingRequests,loader,tradeCount,page,limit,searchData,type,csvData,openCsvExportModal} = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <Form onSubmit={this.onSearch}>
                <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} onClose={()=>{this.setState({openCsvExportModal:false})}} filename={`pending_tier${this.props.tier}_request.csv`} data={csvData} header={exportTier}/>
                <PageCounterComponent page={page} limit={limit} dataCount={tradeCount} syncCallBack={()=>this.setState({type:"",searchData:""},()=>this.getAllPendingRequest())}/>
                <Row  type="flex" justify="start" className="table-filter-row">
                  <Col lg={8}>
                    <Form.Item
                      validateStatus={this.state.searchValid}
                      className="cty-search"
                    >
                      <Input
                        placeholder="Search"
                        onChange={(field)=>{this.setState({searchData:field.target.value})}}
                        value={searchData}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                  {this.props.tier==2 &&
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a Type"
                      onChange={(field)=>{this.setState({type:field})}}
                      value={type}
                    >
                        <Option value="">All</Option>
                     <Option key="1" value={"1"}>Valid ID</Option>
                      <Option key="2" value={"2"}>Prof of Residency</Option>
                      <Option key="3" value={"3"}>Equivalent Govt</Option>
                    </Select>}
                    {this.props.tier==3 &&  <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a Type"
                      onChange={(field)=>{this.setState({type:field})}}
                      value={type}
                    >
                      <Option value="">All</Option>
                      <Option value={"1"}>IDCP</Option>
                      <Option key="2" value={"2"}>Proof of Assets Form</Option>
                    </Select>}
                  </Col>
                  <Col lg={3}>
                    <Button
                      htmlType="submit"
                      className="filter-btn btn-full-width"
                      type="primary"
                    >
                      <Icon type="search" />
                      Search
                    </Button>
                  </Col>
                  <Col lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={()=>{this.setState({searchData:"",type:""},()=>this.getAllPendingRequest())}}
                    >
                      <Icon type="reload" />
                      Reset
                    </Button>
                  </Col>
                  <Col lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      icon="export"
                      onClick={this.onExport}
                    >
                      Export
                    </Button>
                  </Col>
                </Row>
              </Form>
                {loader && <FaldaxLoader/>}
                {tierPendingReqTableInfos.map(tableInfo => (
                    <TableWrapper

                        rowKey="id"
                        {...this.state}
                        columns={tableInfo.columns}
                        pagination={false}
                        dataSource={pendingRequests}
                        className="table-tb-margin"
                        onChange={this._handlePairsChange}
                        bordered
                        scroll={TABLE_SCROLL_HEIGHT}
                        expandedRowRender={record => {
                          return (<>
                                  
                                  
                          {record.data.map((ele)=>{
                            return(<>
                                  <tr>
                            <td className="custom-tr-width">{PendingTierReqActionCell(ele["id"], ele["first_name"], ele["last_name"], ele["tier_step"],ele["is_approved"], ele["user_id"])}</td>
                            <td className="custom-tr-width"><b>Unique Id &nbsp;: </b>&nbsp;{ele["unique_key"]}</td>
                            <td className="custom-tr-width"><b>SSN &nbsp;: </b>&nbsp;{ele["ssn"]?ele["ssn"]:'N/A'}</td>
                            <td className="custom-tr-width"><b>Type &nbsp;: </b>&nbsp;{<span>{getTierDoc(this.props.tier,ele["type"])}</span>}</td>
                            </tr>
                            </>)
                                })}
                          </>)
                        }}
                    />
                ))}
                <Pagination
                      className="ant-users-pagination"
                      onChange={this._handlePagination}
                      pageSize={limit}
                      current={page}
                      total={tradeCount}
                      showSizeChanger
                      onShowSizeChange={this.changePaginationSize}
                      pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(PendingRequests);

export { PendingRequests, tierPendingReqTableInfos };
