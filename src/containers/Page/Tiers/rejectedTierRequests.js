import React, { Component } from "react";
import {
  notification,
  Pagination,
  Icon,
  Button,
  Form,
  Row,
  Col,
  Select,
  Input,
  Modal,
  message,
  Upload,
  Tag
} from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { tierReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import authAction from "../../../redux/auth/actions";
import {
  PAGE_SIZE_OPTIONS,
  TABLE_SCROLL_HEIGHT,
  PAGESIZE,
} from "../../../helpers/globals";
import ApiUtils from "../../../helpers/apiUtills";
import FaldaxLoader from "../faldaxLoader";
import { ExportToCSVComponent } from "../../Shared/exportToCsv";
import { PageCounterComponent } from "../../Shared/pageCounter";
import { exportTier } from "../../../helpers/exportToCsv/headers";
import { getTierDoc, DateTimeCell } from "../../../components/tables/helperCells";
const { logout } = authAction;
const { Option } = Select;
var self;
var columns = tierReqTableInfos[0].columns.slice();
var columns=tierReqTableInfos[0].columns.slice(),self;
columns.push({
  title:"Action",
  key: 'count',
  width:250,
  align:"left",
  ellipsis:true,
  render:object=><span><Button type="primary" onClick={()=>self.forceApproveRejectTierRequest(true,object["id"])}>Force Approve</Button></span>
});
class RejectedRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rejectedRequests: [],
      limit: PAGESIZE,
      page: 1,
      loader: false,
      tradeCount: 0,
      searchData: "",
      type: "",
      csvData: [],
      openCsvExportModal: false,
      showDocUploadModal: false,
      fileUploadLoading: false,
      tierDetailsRequest:[],
      imageUrl: "",
      selectedRequest: {},
      expandRowLoader:false
    };
    self = this;
  }
  onSearch = (e) => {
    e.preventDefault();
    this.getAllRejectedTier();
  };

  componentDidMount() {
    this.getAllRejectedTier();
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
        },()=>this.getAllRejectedTier());
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
  changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this.getAllRejectedTier();
    });
  };

  _handlePagination = (page) => {
    this.setState({ page }, () => {
      this.getAllRejectedTier();
    });
  };
  getAllRejectedTier(isExportToCsv = false) {
    const { token } = this.props;
    const { sorterCol, sortOrder, limit, page, searchData, type } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    (isExportToCsv
      ? ApiUtils.getAllTierRequests(
          token,
          this.props.tier,
          sorterCol,
          sortOrder,
          100000,
          1,
          undefined,
          3,
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
          3,
          searchData,
          type
        )
    )
      .then((response) => response.json())
      .then(function (res) {
        if (res.status == 200) {
          if (isExportToCsv) {
            _this.setState({ csvData: res.tradeData });
          } else {
            _this.setState({
              rejectedRequests:res.tradeData,
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
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          loader: false,
        });
      });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props !== nextProps) {
      this.setState({ rejectedRequests: nextProps.data });
    }
  };
  onExport = () => {
    this.setState({ openCsvExportModal: true }, () =>
      this.getAllRejectedTier(true)
    );
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

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

  onSubmit = async () => {
    try {
      this.setState({ loader: true });
      let { selectedRequest } = this.state;
      let formData = new FormData();
      formData.append("id", selectedRequest["id"]);
      if (selectedRequest.type == "3")
        formData.append("ssn", selectedRequest["doc"]);
      else formData.append("files", selectedRequest["doc"]);
      let res = await (
        await ApiUtils.uploadDoc(this.props.token, formData)
      ).json();
      if (res.status == 200) {
        this.setState(
          {
            errType: "success",
            errMsg: true,
            errMessage: res.message,
          },
          () =>
            this.setState(
              {
                showDocUploadModal: false,
                imageUrl: "",
                fileUploadLoading: false,
                selectedRequest: {},
              },
              () => this.getAllRejectedTier()
            )
        );
      } else if (res.status == 403) {
        this.setState(
          { errMsg: true, errMessage: res.err?res.err:res.message, errType: "error" ,loader: false},
          () => {
            this.props.logout();
          }
        );
      } else {
        this.setState({
          errType: "error",
          errMsg: true,
          errMessage: res.message,
          loader: false
        });
      }
    } catch (error) {
      this.setState({
        errType: "error",
        errMsg: true,
        errMessage: "Unable to complete the requested action.",
        loader: false 
      });
    } finally {
     
    }
  };

  async getDetTierDetails(expanded,row){
    var keys = [];
    if(!expanded){
      return false;
    }
    try{
      this.setState({expandRowLoader:true,tierDetailsRequest:[]})
       let res=await(await ApiUtils.getTierDetails(this.props.token,row.id,row.tier_step)).json();
       if(res.status==200){
         this.setState({tierDetailsRequest:[].concat.apply([],res.data)});
       }
     } catch(error){
       console.log(error);
     } finally{
       this.setState({expandRowLoader:false})
     }
   }


  render() {
    const {
      errType,
      errMsg,
      showDocUploadModal,
      rejectedRequests,
      loader,
      searchData,
      type,
      page,
      limit,
      tradeCount,
      csvData,
      openCsvExportModal,
      imageUrl,
      tierDetailsRequest
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    const uploadButton = (
      <div>
        {this.state.fileUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="isoLayoutContent">
        <ExportToCSVComponent
          isOpenCSVModal={openCsvExportModal}
          onClose={() => {
            this.setState({ openCsvExportModal: false });
          }}
          filename={`rejected_tier${this.props.tier}_request.csv`}
          data={csvData}
          header={exportTier}
        />
        <PageCounterComponent
          page={page}
          limit={limit}
          dataCount={tradeCount}
          syncCallBack={() =>
            this.setState({ type: "", searchData: "" }, () =>
              this.getAllRejectedTier()
            )
          }
        />
        <Form onSubmit={this.onSearch}>
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
                    this.getAllRejectedTier()
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
        <TableWrapper
          rowKey="id"
          {...this.state}
          columns={columns}
          pagination={false}
          dataSource={rejectedRequests}
          className="table-tb-margin"
          onChange={this._handlePairsChange}
          bordered
          scroll={TABLE_SCROLL_HEIGHT}
          loading={this.state.expandRowLoader}
          expandedRowRender={()=>{
            return <>
                {tierDetailsRequest.map((ele)=>{
                  return <tr>
                  <td className="custom-tr-width">
                                      <b>Submitted On &nbsp;: </b>&nbsp;
                                      {DateTimeCell(ele["created_at"],"string")}
                                    </td>
                  {ele["is_approved"]==true && <td className="custom-tr-width"><Tag color="#87d068"><Icon type="check"></Icon>&nbsp;Approved</Tag></td>}
                  {ele["is_approved"]==null && <td className="custom-tr-width"><Tag color="#6896d0"><Icon type="info-circle"></Icon>&nbsp;Pending</Tag></td>}
                  {ele["is_approved"]==false &&<td className="custom-tr-width"><Tag color="#f50"><Icon type="close"></Icon>&nbsp;Rejected</Tag></td>} 
                  <td className="custom-tr-width"><b>Unique Id &nbsp;: </b>&nbsp;{ele["unique_key"]?ele["unique_key"]:ele["type"]=="4"?'Enabled':ele["ssn"]}</td>
                    <td className="custom-tr-width"><b>Type &nbsp;: </b>&nbsp;{<span>{getTierDoc(this.props.tier,ele["type"])}</span>}</td>
                  </tr>
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
  (state) => ({
    token: state.Auth.get("token"),
  }),
  { logout }
)(RejectedRequests);

export { RejectedRequests, tierReqTableInfos };
