import React, { Component } from 'react';
import { notification, Pagination,Icon,Button,Form, Row, Col,Select,Input, Tag, Modal } from 'antd';
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
import { PendingTierReqActionCell, getTierDoc, DateTimeCell } from '../../../components/tables/helperCells';
import TextArea from 'antd/lib/input/TextArea';
import ViewNotesModal from '../../Shared/viewNotesModal';
// import { PendingTierReqActionCell, getTierDoc } from '../../../components/tables/helperCells';
const { logout } = authAction;
// const {Option}=Select;
var self,columns;

class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingRequests: [],
      page: 1,
      limit: PAGESIZE,
      tradeCount: 0,
      searchData: "",
      type: "",
      csvData: [],
      openCsvExportModal: false,
      expandRowLoader: false,
      tierDetailsRequest: [],
      expandedRowKeys: [],
      showRejectNoteModal:false,
      rejectRequestData:undefined,
      privateNote:"",
      publicNote:"",
      callbackFunction:PendingRequests.approvePendingReq,
      callbackParams:{},
      showNotesModal:false,
      public_note:"",
      private_note:""
    };
    self = this;
    columns = tierPendingReqTableInfos[0].columns.slice();
    columns.push({
      title: "Action",
      key: "count",
      width:450,
      align: "left",
      ellipsis: true,
      render: (object) => (
        <span>
          <Button
            type="primary"
            onClick={() =>
              self.forceApproveRejectTierRequest(true, object["id"])
            }
          >
            Force Approve
          </Button>
          &nbsp;&nbsp;
          <Button
            type="danger"
            onClick={() =>
              self.forceApproveRejectTierRequest(false, object["id"])
            }
          >
            Force Reject
          </Button>
          &nbsp;&nbsp;
           <Button disabled={!(object['public_note'] || object['private_note'])} onClick={()=>this.setState({showNotesModal:true,public_note:object["public_note"],private_note:object["private_note"]})}>Show Notes</Button>
        </span>
      ),
    });
    PendingRequests.approvePendingReq = PendingRequests.approvePendingReq.bind(
      this
    );
  }

  componentDidMount() {
    this.getAllPendingRequest();
  }

  async forceApproveRejectTierRequest(status, id) {
    try {
      let {showRejectNoteModal}=this.state;
      if(!showRejectNoteModal)
      {
        this.setState({showRejectNoteModal:true,callbackFunction:this.forceApproveRejectTierRequest.bind(this),callbackParams:{id,status}});
        return false;
      }
      this.setState({ loader: true });
      let {publicNote,privateNote}=this.state;
      let response = await (
        await ApiUtils.forceApproveRejectTierRequest(
          this.props.token,
          id,
          status,
          publicNote,
          privateNote
        )
      ).json();
      if (response.status == 200) {
        this.setState(
          {
            errMsg: true,
            errMessage: response.message,
            errType: "success",
            loader: false,
            showRejectNoteModal:false
          },
          () => this.getAllPendingRequest()
        );
      } else if (response.status == 403) {
        this.setState(
          {
            errMsg: true,
            loader: false,
            errMessage: response.err,
            errType: "error",
          },
          () => {
            this.props.logout();
          }
        );
      } else {
        this.setState({
          errMsg: true,
          errMessage: response.message,
          errType: "error",
          loader: false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  onSearch = (e) => {
    e.preventDefault();
    this.getAllPendingRequest();
  };
  
  getAllPendingRequest = async (isExportToCsv = false) => {
    const { token } = this.props;
    const { sorterCol, sortOrder, limit, page, type, searchData } = this.state;
    let _this = this;
    try {
      this.setState({ loader: true });
      let res = await (
        await (isExportToCsv
          ? ApiUtils.getAllTierRequests(
              token,
              this.props.tier,
              sorterCol,
              sortOrder,
              100000,
              1,
              undefined,
              1,
              searchData,
              type
            )
          : ApiUtils.getAllTierRequests(
              token,
              this.props.tier,
              sorterCol,
              sortOrder,
              limit,
              page,
              undefined,
              1,
              searchData,
              type
            ))
      ).json();
      if (res.status == 200) {
        if (isExportToCsv) {
          _this.setState({
            csvData: res.tradeData,
          });
        } else {
          let data = res.tradeData;
          _this.setState({
            pendingRequests: data,
            tradeCount: res.tradeCount,
          });
        }
      } else if (res.status == 403) {
        _this.setState(
          { errMsg: true, errMessage: res.err, errType: "error" },
          () => {
            _this.props.logout();
          }
        );
      } else {
        _this.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "error",
        });
      }
    } catch (error) {
      _this.setState({
        errType: "error",
        errMsg: true,
        errMessage: "Unable to complete the requested action.",
        loader: false,
      });
    } finally {
      _this.setState({ loader: false });
    }
  };

  onRejectRequestSubmit=()=>{
    if(this.state.callbackParams.first_name){
      let {value,first_name,last_name,tier_step,is_approved,request_id}=this.state.callbackParams;
      this.state.callbackFunction(value,first_name,last_name,tier_step,is_approved,request_id);
    }else{
      let {id,status}=this.state.callbackParams;
      this.state.callbackFunction(status,id); 
    }
  }

  static async approvePendingReq(
    value,
    first_name,
    last_name,
    tier_step,
    is_approved,
    request_id
  ) {
    if(!is_approved && !self.state.showRejectNoteModal){
      self.setState({showRejectNoteModal:true,callbackParams:{value,first_name,last_name,tier_step,is_approved,request_id}});
      return
    }
    const { token } = self.props;
    const {publicNote,privateNote}=self.state;
    self.setState({ loader: true });
    try {
      let res = await (
        await ApiUtils.approveRejectRequest(
          token,
          tier_step,
          value,
          is_approved,
          request_id,
          privateNote,
          publicNote
        )
      ).json();
      if (res.status == 200) {
        self.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "Success",
          expandedRowKeys: [],
          showRejectNoteModal:false
        });
        await self.getAllPendingRequest();
      } else if (res.status == 403) {
        self.setState(
          { errMsg: true, errMessage: res.err, errType: "error" },
          () => {
            self.props.logout();
          }
        );
        self.setState({ loader: false });
      } else {
        self.setState({
          errMsg: true,
          errMessage: res.message,
          errType: "error",
        });
        self.setState({ loader: false });
      }
    } catch (error) {
      self.setState({
        errType: "error",
        errMsg: true,
        errMessage: "Unable to complete the requested action.",
        loader: false,
      });
    } finally {
      self.setState({ loader: false });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props !== nextProps) {
      this.setState({ pendingRequests: nextProps.data });
    }
  };
  onExport = () => {
    this.setState({ openCsvExportModal: true }, () =>
      this.getAllPendingRequest(true)
    );
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this.getAllPendingRequest();
    });
  };

  _handlePagination = (page) => {
    this.setState({ page }, () => {
      this.getAllPendingRequest();
    });
  };

  async getDetTierDetails(expanded, row) {
    var keys = [];
    if (expanded) {
      keys.push(row.id);
    }
    this.setState({ expandedRowKeys: keys });
    if (!expanded) {
      return false;
    }
    try {
      this.setState({ expandRowLoader: true, tierDetailsRequest: [] });
      let res = await (
        await ApiUtils.getTierDetails(this.props.token, row.id, row.tier_step)
      ).json();
      if (res.status == 200) {
        this.setState({ tierDetailsRequest: [].concat.apply([], res.data) });
      } else if (res.status == 403) {
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
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ expandRowLoader: false });
    }
  }
  onCancel=()=>{
    this.setState({showRejectNoteModal:false,rejectRequestData:undefined});
  }
  onChange=({target})=>{
    if(target.name=="private_note")
    {
      this.setState({"privateNote":target.value});
    }else{
      this.setState({"publicNote":target.value});
    }
  }
  render() {
    const {
      errType,
      errMsg,
      pendingRequests,
      tierDetailsRequest,
      expandRowLoader,
      loader,
      tradeCount,
      page,
      limit,
      searchData,
      type,
      csvData,
      openCsvExportModal,
      showNotesModal
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    console.log(showNotesModal)

    return (
      <div className="isoLayoutContent">
        <Form onSubmit={this.onSearch}>
          <ExportToCSVComponent
            isOpenCSVModal={openCsvExportModal}
            onClose={() => {
              this.setState({ openCsvExportModal: false });
            }}
            filename={`pending_tier${this.props.tier}_request.csv`}
            data={csvData}
            header={exportTier}
          />
          <PageCounterComponent
            page={page}
            limit={limit}
            dataCount={tradeCount}
            syncCallBack={() =>
              this.setState({ type: "", searchData: "" }, () =>
                this.getAllPendingRequest()
              )
            }
          />
          <Row type="flex" justify="start" className="table-filter-row">
            <Col lg={8}>
              <Form.Item
                validateStatus={this.state.searchValid}
                className="cty-search"
              >
                <Input
                  placeholder="Search"
                  onChange={(field) => {
                    this.setState({ searchData: field.target.value });
                  }}
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
                onClick={() => {
                  this.setState({ searchData: "", type: "" }, () =>
                    this.getAllPendingRequest()
                  );
                }}
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
        {loader && <FaldaxLoader />}
        {/* {tierPendingReqTableInfos.map(tableInfo => ( */}
        <TableWrapper
          rowKey="id"
          {...this.state}
          columns={columns}
          pagination={false}
          dataSource={pendingRequests}
          className="table-tb-margin"
          onChange={this._handlePairsChange}
          bordered
          loading={expandRowLoader}
          scroll={TABLE_SCROLL_HEIGHT}
          expandedRowKeys={this.state.expandedRowKeys}
          expandedRowRender={() => {
            return (
              <><tr>
                <th className="custom-tr-width">Submitted On</th>
                <th className="custom-tr-width">Status</th>
                <th className="custom-tr-width">Updated By</th>
                <th className="custom-tr-width">Id</th>
                <th className="custom-tr-width">Type</th>
                <th className="custom-tr-width">Notes</th>
              </tr>
                {tierDetailsRequest.map((ele) => {
                  return (
                  <>
                    <tr>
                       <td className="custom-tr-width">
                                      {/* <b>Submitted On &nbsp;: </b>&nbsp; */}
                                      {DateTimeCell(ele["created_at"],"string")}
                                    </td>
                      {ele["is_approved"] == null && (
                        <td className="custom-tr-width">
                          {PendingTierReqActionCell(
                            ele["id"],
                            ele["first_name"],
                            ele["last_name"],
                            ele["tier_step"],
                            ele["is_approved"],
                            ele["request_id"]
                          )}
                        </td>
                      )}
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
                            <Icon type="close"></Icon>&nbsp;Rejected
                          </Tag>
                        </td>
                      )}
                      <td className="custom-tr-width">
                      {/* <b>{ele["is_approved"]==null?"-":ele["is_approved"]?"Approved By :":"Rejected By :"}</b> */}
                      {ele["updated_by"]?ele["updated_by"]:"-"}
                      </td>
                      <td className="custom-tr-width">
                        {/* <b>{ele['ssn'] && <span>Govt.Issued ID Number &nbsp;</span>} </b>&nbsp; */}
                        {/* <b>{!ele['ssn'] && <span>Unique Id &nbsp;</span>} </b>&nbsp; */}
                        {ele["unique_key"]
                          ? ele["unique_key"]
                          : ele["type"] == "4"
                          ? "Enabled"
                          : ele["ssn"]+"(Govt.Issued ID Number)"}
                      </td>
                      {/* <td className="custom-tr-width">{ele["ssn"] &&<> <b>SSN &nbsp;: </b>&nbsp;{ele["ssn"]?ele["ssn"]:'N/A'}</>}</td> */}
                      <td className="custom-tr-width">
                        {/* <b>Type &nbsp;: </b>&nbsp; */}
                        {
                          <span>
                            {getTierDoc(this.props.tier, ele["type"])}
                          </span>
                        }
                      </td>
                      <td className="custom-tr-width">
                        <Button  disabled={!(ele['public_note'] || ele['private_note'])} onClick={()=>{this.setState({"showNotesModal":true,"public_note":ele["public_note"],"private_note":ele["private_note"]})}}>Show Notes</Button>
                      </td>
            
                    {/* <td className="custom-tr-width">
                      {ele["public_note"]?ele["public_note"]:"-"}</td>
                    <td className="custom-tr-width">
                      {ele["private_note"]?ele["private_note"]:"-"}</td> */}
                  </tr>
                  </>
                  );
                })}
              </>
            );
          }}
          onExpand={(expanded, records) => {
            this.getDetTierDetails(expanded, records);
          }}></TableWrapper>
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
          <Modal
          title="Notes"
          visible={this.state.showRejectNoteModal}
          footer={[
          <Button onClick={this.onCancel}>Cancel</Button>,
          <Button type="primary" onClick={this.onRejectRequestSubmit}>Submit</Button>
          ]}
        >
          <TextArea
          placeholder="Private Note"
          autoSize={{ minRows: 2, maxRows: 6 }}
          name="private_note"
          onChange={this.onChange}
        />


        <TextArea
        className="mt-8"
          placeholder="Public Note"
          name="public_note"
          autoSize={{ minRows: 2, maxRows: 6 }}
          onChange={this.onChange}
        />
        </Modal>
        <ViewNotesModal visible={showNotesModal} public_note={this.state.public_note} private_note={this.state.private_note} setVisible={(showNotesModal)=>this.setState({showNotesModal})}/>
      </div>
    );
  }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(PendingRequests);

export { PendingRequests, tierPendingReqTableInfos };
