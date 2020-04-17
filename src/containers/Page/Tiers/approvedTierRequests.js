import React, { Component } from 'react';
import { notification, Pagination,Icon,Button,Form, Row, Col,Select,Input, Tag } from 'antd';
import { tierReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS,TABLE_SCROLL_HEIGHT, PAGESIZE } from "../../../helpers/globals";
import FaldaxLoader from "../faldaxLoader";
import ApiUtils from '../../../helpers/apiUtills';
import { PageCounterComponent } from '../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import {  exportTier } from '../../../helpers/exportToCsv/headers';
import { getTierDoc, DateTimeCell } from '../../../components/tables/helperCells';

const { logout } = authAction;
const {Option}=Select;
var columns=tierReqTableInfos[0].columns.slice(),self;
columns.push({
  title:"Action",
  key: 'count',
  width:250,
  align:"left",
  ellipsis:true,
  render:object=><span><Button type="danger" onClick={()=>self.forceApproveRejectTierRequest(false,object["id"])}>Force Reject</Button></span>
});

class ApprovedRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            approvedRequests:[],
            page:1,
            limit:PAGESIZE,
            loader:false,
            tradeCount:0,
            searchData:"",
            type:"",
            csvData:[],
            openCsvExportModal:false,
            tierDetailsRequest:[],
            expandRowLoader:false
        }
        self=this;
    }
    async forceApproveRejectTierRequest(status,id){
      try {
        this.setState({ loader: true });
        let response = await (
          await ApiUtils.forceApproveRejectTierRequest(
            this.props.token,
            id,
            status
          )
        ).json();
        if (response.status == 200) {
          this.setState({
            errMsg: true,
            errMessage: response.message,
            errType: "success",
            loader:false
          },()=>this.getAllApprovedTierRequest());
        } else if (response.status == 403) {
          this.setState(
            { errMsg: true, errMessage: response.err,loader:false, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errMsg: true,
            loader:false,
            errMessage: response.message,
            errType: "error",
          });
        }
      } catch (error) {
        this.setState({loader:false})
        console.log(error);
      } finally {
      }
    }

    formateTradeRequest(data){
      let tradeData=[];
      for (let i of data) {
        // let index=data.indexOf(i);
        if (tradeData.length == 0) {
          tradeData.push({
            email: i["email"],
            name: i["first_name"] + " " + i["last_name"],
            data: [i],
          });
        } else {
          let found = false;
          for (let i2 of tradeData) {
            let index = tradeData.indexOf(i2);
            let tradeIndex = tradeData.findIndex(
              (ele) => ele["email"] == i["email"]
            );
            if (tradeIndex != -1) {
              tradeData[tradeIndex]["data"].push(i);
              found = true;
              break;
            }
          }
          if (!found) {
            tradeData.push({
              email: i["email"],
              name: i["first_name"] + " " + i["last_name"],
              data: [i],
            });
          }
        }
      }
      if (this.props.tier == 3) {
        return tradeData.filter((ele) => {
          return ele.data.length == 2;
        });
      } else if (this.props.tier == 2) {
        return tradeData.filter((ele) => {
          return ele.data.length == 3;
        })
        }else{
          return tradeData;
        }
    }
    onSearch=(e)=>{
        e.preventDefault();
        this.getAllApprovedTierRequest();
    }
    componentDidMount(){
        this.getAllApprovedTierRequest();
    }
    getAllApprovedTierRequest(isExportToCsv=false){
        const { token } = this.props;
        const { sorterCol, sortOrder,limit,page,searchData,type } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getAllTierRequests(token,this.props.tier, sorterCol, sortOrder,100000,1,undefined,2,searchData,type):ApiUtils.getAllTierRequests(token,this.props.tier, sorterCol, sortOrder,limit,page,undefined,2,searchData,type))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    if(isExportToCsv){
                        _this.setState({csvData:res.tradeData});
                    }else{
                        _this.setState({
                            approvedRequests:res.tradeData,
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

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.setState({ approvedRequests: nextProps.data })
        }
    }
    changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
          this.getAllApprovedTierRequest();
        });
      };
    
    _handlePagination = page => {
        this.setState({ page }, () => {
          this.getAllApprovedTierRequest();
        });
      };
    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    async getDetTierDetails(expanded,row){
      if(!expanded){
        return false;
      }
      try{
        this.setState({expandRowLoader:true,tierDetailsRequest:[]})
         let res=await(await ApiUtils.getTierDetails(this.props.token,row.id,row.tier_step)).json();
         if(res.status==200){
           this.setState({tierDetailsRequest:[].concat.apply([],res.data)});
         }else if (res.status == 403) {
          this.setState(
            {
              errMsg: true,
              loader: false,
              errMessage: res.err,
              errType: "error",
            },
            () => {
              this.props.logout();
            }
          );
        }
       } catch(error){

         console.log(error);
       } finally{
         this.setState({expandRowLoader:false})
       }
     }

    onExport=()=>{
        this.setState({openCsvExportModal:true},()=>this.getAllApprovedTierRequest(true));
      }
    render() {
        const { errType, tierDetailsRequest,errMsg, approvedRequests ,loader,page,tradeCount,limit,searchData,type,csvData,openCsvExportModal} = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
                <ExportToCSVComponent isOpenCSVModal={openCsvExportModal} onClose={()=>{this.setState({openCsvExportModal:false})}} filename={`approved_tier${this.props.tier}_request.csv`} data={csvData} header={exportTier}/>
                <PageCounterComponent page={page} limit={limit} dataCount={tradeCount} syncCallBack={()=>this.setState({type:"",searchData:""},()=>this.getAllApprovedTierRequest())}/>
                <Form onSubmit={this.onSearch}>
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
                      onClick={()=>{this.setState({searchData:"",type:""},()=>this.getAllApprovedTierRequest())}}
                    >
                      <Icon type="reload" />
                      Reset
                    </Button>
                  </Col>
                  <Col lg={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this.onExport}
                      icon="export"
                    >
                      Export
                    </Button>
                  </Col>
                </Row>
              </Form>
                {loader && <FaldaxLoader/>}
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={columns}
                        pagination={false}
                        dataSource={approvedRequests}
                        className="table-tb-margin"
                        onChange={this._handlePairsChange}
                        bordered
                        loading={this.state.expandRowLoader}
                        scroll={TABLE_SCROLL_HEIGHT}
                        expandedRowRender={()=>{
                          return <>
                              {tierDetailsRequest.map((ele)=>{
                                return (
                                  <tr>
                                    <td className="custom-tr-width">
                                      <b>Submitted On &nbsp;: </b>&nbsp;
                                      {DateTimeCell(ele["created_at"],"string")}
                                    </td>
                                    {ele["is_approved"] == true && (
                                      <td className="custom-tr-width">
                                        <Tag color="#87d068">
                                          <Icon type="check"></Icon>
                                          &nbsp;Approved
                                        </Tag>
                                      </td>
                                    )}
                                    {ele["is_approved"] == false && (
                                      <td className="custom-tr-width">
                                        <Tag color="#f50">
                                          <Icon type="close"></Icon>
                                          &nbsp;Rejected
                                        </Tag>
                                      </td>
                                    )}
                                    {ele["is_approved"] == null && (
                                      <td className="custom-tr-width">
                                        <Tag color="#6896d0">
                                          <Icon type="info-circle"></Icon>
                                          &nbsp;Pending
                                        </Tag>
                                      </td>
                                    )}
                                    <td className="custom-tr-width">
                                      <b>Unique Id &nbsp;: </b>&nbsp;
                                      {ele["unique_key"]
                                        ? ele["unique_key"]
                                        : ele["type"] == "4"
                                        ? "Enabled"
                                        : ele["ssn"]}
                                    </td>
                                    <td className="custom-tr-width">
                                      <b>Type &nbsp;: </b>&nbsp;
                                      {
                                        <span>
                                          {getTierDoc(
                                            this.props.tier,
                                            ele["type"]
                                          )}
                                        </span>
                                      }
                                    </td>
                                  </tr>
                                );
                              })}
                          </>
                        }}
                        onExpand={(expanded,records)=>{this.getDetTierDetails(expanded,records)}}
                    />
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
    }), { logout })(ApprovedRequests);

export { ApprovedRequests, tierReqTableInfos };
