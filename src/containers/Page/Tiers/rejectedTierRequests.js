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
  Upload
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
import { getTierDoc } from "../../../components/tables/helperCells";
const { logout } = authAction;
const { Option } = Select;
var columns = tierReqTableInfos[0].columns.slice();
var self;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 4;
  if (!isLt2M) {
    message.error("Image must smaller than 4MB!");
  }
  return false;
}

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
      imageUrl: "",
      selectedRequest: {},
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

  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ fileUploadLoading: true });
      return;
    }
    let { selectedRequest } = this.state;
    selectedRequest["doc"] = info.file;
    getBase64(info.file, (imageUrl) =>
      this.setState({
        imageUrl,
        selectedRequest,
        fileUploadLoading: false,
      })
    );
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
              rejectedRequests:_this.formateTradeRequest(res.tradeData),
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
          expandedRowRender={(record) => {
            return (
              <>
                {record.data.map((ele) => {
                  return (
                    <>
                      <tr>
                        <td className="custom-tr-width">
                          <Button
                            type="primary"
                            onClick={() =>
                              this.setState({
                                showDocUploadModal: true,
                                selectedRequest: ele,
                              })
                            }
                          >
                            Re-submit
                          </Button>
                        </td>
                        {/* <td className="custom-tr-width">{PendingTierReqActionCell(ele["id"], ele["first_name"], ele["last_name"], ele["tier_step"],ele["is_approved"], ele["user_id"])}</td> */}
                        <td className="custom-tr-width">
                          <b>Unique Id &nbsp;: </b>&nbsp;{ele["unique_key"]}
                        </td>
                        <td className="custom-tr-width">
                          <b>SSN &nbsp;: </b>&nbsp;
                          {ele["ssn"] ? ele["ssn"] : "N/A"}
                        </td>
                        <td className="custom-tr-width"><b>Type &nbsp;: </b>&nbsp;{<span>{getTierDoc(this.props.tier,ele["type"])}</span>}</td>
                      </tr>
                    </>
                  );
                })}
              </>
            );
          }}
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
        {/* Modal for show document upload*/}
        <Modal
          title="Upload Docs"
          visible={showDocUploadModal}
          footer={[
            <Button
              onClick={() => {
                this.setState({ showDocUploadModal: false });
              }}
            >
              Cancel
            </Button>,
            <Button color="primary" onClick={this.onSubmit}>
              Upload
            </Button>,
          ]}
        >
          <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader text-center"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
            <p class="upload-doc-text">
              * Upload{" "}
              {getTierDoc(this.props.tier,this.state.selectedRequest["type"])}
            </p>
          </div>
        </Modal>
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
