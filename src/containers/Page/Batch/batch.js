import React from "react";
import {
  Table,
  Input,
  Form,
  Button,
  Checkbox,
  notification,
  Pagination,
  Row,
  Modal,
  Icon,
  Tabs
} from "antd";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import authAction from "../../../redux/auth/actions";
import FaldaxLoader from "../faldaxLoader";
import SimpleReactValidator from "simple-react-validator";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import moment from "moment";
import ColWithMarginBottom from "../common.style";
import { CSVLink } from "react-csv";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import { TabPane } from "../../../components/uielements/tabs";
import BatchMetabase from "./betchMetabase"

const EditableContext = React.createContext();
const { logout } = authAction;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  triggerInputFile = () => this.fileInput.click();

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e, data) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class BatchBalance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allBatches: [],
      fields: {},
      page: 1,
      limit: PAGESIZE,
      batchCount: 0,
      transactionID: "",
      showDownloadPopup: false,
      selectedExport: ["XLSX"],
      downloadData: [],
      selectedOptions: [0]
    };
    this.columns = [
      {
        title: "Batch",
        dataIndex: "batch_number",
        render: (text, record) =>
          this.state.allBatches.length >= 1 ? (
            <Button
              onClick={() => {
                this.props.history.push(
                  `/dashboard/batch-and-balance/${record.batch_number}`
                );
              }}
            >
              {record.batch_number}
            </Button>
          ) : null
      },
      {
        title: "Transactions",
        dataIndex: "transaction_start",
        render: (text, record) =>
          this.state.allBatches.length >= 1 ? (
            <span>
              {record.transaction_start} - {record.transaction_end}
            </span>
          ) : null
      },
      {
        title: "Batch Date",
        dataIndex: "batch_date",
        render: (text, record) => (
          <span>
            {moment
              .utc(record.batch_date)
              .local()
              .format("DD MMM YYYY HH:mm:ss")}
          </span>
        )
      },
      {
        title: "Purchases",
        dataIndex: "is_purchased",
        render: (text, record) =>
          this.state.allBatches.length >= 1 ? (
            <Checkbox
              key={record.id}
              checked={record.is_purchased}
              onChange={this._checkBatch.bind(this, "is_purchased", record)}
            >
              Purchase
            </Checkbox>
          ) : null
      },
      {
        title: "Withdrawals",
        dataIndex: "is_withdrawled",
        render: (text, record) =>
          this.state.allBatches.length >= 1 ? (
            <Checkbox
              key={record.id}
              checked={record.is_withdrawled}
              onChange={this._checkBatch.bind(this, "is_withdrawled", record)}
            >
              Withdrawals
            </Checkbox>
          ) : null
      },
      {
        title: "Manual Withdrawals",
        dataIndex: "is_manual_withdrawled",
        render: (text, record) =>
          this.state.allBatches.length >= 1 ? (
            <Checkbox
              key={record.id}
              checked={record.is_manual_withdrawled}
              onChange={this._checkBatch.bind(
                this,
                "is_manual_withdrawled",
                record
              )}
            >
              Manual Withdraw
            </Checkbox>
          ) : null
      },
      {
        title: "Net Profit",
        dataIndex: "net_profit"
      },
      {
        title: "Download",
        dataIndex: "download",
        render: (text, record) => {
          return (
            <Button
              type="primary"
              icon="download"
              onClick={this._downloadModal.bind(this, record)}
            >
              Download
            </Button>
          );
        }
      },
      {
        title: "Upload",
        dataIndex: "upload",
        render: (text, record) => {
          return (
            <div>
              <div className="upload-btn-wrapper">
                <Button
                  type="primary"
                  icon="upload"
                  disabled={record.uploaded_file !== null ? true : false}
                >
                  Upload
                </Button>
                <input
                  type="file"
                  name="myfile"
                  onChange={this.onChangeFile.bind(this, record)}
                />
              </div>
            </div>
          );
        }
      }
    ];
    this.validator = new SimpleReactValidator();
  }

  onChangeFile = (e, data, value) => {
    data.stopPropagation();
    data.preventDefault();

    const { token } = this.props;
    this.setState({ loader: true });

    let formData = new FormData();
    formData.append("batch_id", e.id);
    formData.append("batch_upload", data.target.files[0]);

    ApiUtils.uploadBatchDoc(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          this.setState({
            errMsg: true,
            errMessage: res.message,
            loader: false,
            errType: "Success"
          });
          this._getAllBatches();
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errMsg: true,
            errMessage: res.err,
            loader: false,
            errType: "Error"
          });
        }
      })
      .catch(err => {
        this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          loader: false,
          errType: "error"
        });
      });
  };

  _checkBatch = (e, data, val) => {
    let updatedBatch;
    this.state.allBatches.map(batch => {
      if (batch.batch_number == data.batch_number) {
        batch[e] = !data[e];
        updatedBatch = batch;
      }
    });
    const { token } = this.props;
    let _this = this;
    let formData = {
      batch_id: updatedBatch.batch_number,
      is_purchased: updatedBatch.is_purchased,
      is_withdrawled: updatedBatch.is_withdrawled,
      is_manual_withdrawled: updatedBatch.is_manual_withdrawled
    };

    _this.setState({ loader: true });
    ApiUtils.updateBatch(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState(prevState => ({
            errMsg: true,
            errMessage: res.message,
            errType: "Success",
            allBatches: [
              ...prevState.allBatches.slice(0, updatedBatch.batch_number),
              updatedBatch,
              ...prevState.allBatches.slice(updatedBatch.batch_number + 1)
            ]
          }));
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
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(err => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _downloadModal = values => {
    this.setState({ showDownloadPopup: true, selectedBatch: values });
  };

  _closeDownloadBatch = () => {
    this.setState({ showDownloadPopup: false });
  };

  handleSave = row => {
    const newData = [...this.state.allBatches];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ allBatches: newData });
  };

  componentDidMount = () => {
    this._getAllBatches();
  };

  _getAllBatches = () => {
    const { token } = this.props;
    const { page, limit } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllBatches(token, page, limit)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            allBatches: res.data.batches,
            batchCount: res.data.batch_count
          });
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
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  openNotificationWithIcon = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _searchBatch = val => {
    this.setState({ searchBatch: val, page: 1 }, () => {
      this._getAllBatches();
    });
  };

  _handleBatchPagination = page => {
    this.setState({ page }, () => {
      this._getAllBatches();
    });
  };

  _createBatch = () => {
    const { token } = this.props;
    const { transactionID } = this.state;
    let _this = this;
    let formData = {
      last_transaction_id: transactionID
    };

    _this.setState({ loader: true });
    ApiUtils.createBatch(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "Success"
          });
          _this._getAllBatches();
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
            errMessage: res.err,
            errType: "error"
          });
        }
        _this.setState({ loader: false, transactionID: "" });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _changeTransID = (field, e) => {
    this.setState({ transactionID: field.target.value });
  };

  _onChangeList = checkedList => {
    this.setState({ selectedOptions: checkedList });
  };

  _onChangeExportVal = value => {
    this.setState({ selectedExport: value });
  };

  _downloadBatch = () => {
    const { token } = this.props;
    const { selectedBatch, selectedOptions } = this.state;
    // console.log('selectedOptions', selectedOptions)
    let _this = this;
    let formData = {
      batch_id: selectedBatch.batch_number,
      options: selectedOptions
    };

    _this.setState({ loader: true });
    ApiUtils.downloadBatch(token, formData)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({
            purchaseDownloadData: res.data.purchases,
            summaryDownloadData: res.data.summary.data,
            errMsg: true,
            errMessage: res.message,
            errType: "Success"
          });
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
            errMessage: res.err,
            errType: "error"
          });
        }
        _this.setState({ loader: false, showDownloadPopup: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  render() {
    const {
      allBatches,
      loader,
      errMsg,
      errType,
      batchCount,
      page,
      limit,
      transactionID,
      showDownloadPopup,
      selectedExport,
      purchaseDownloadData,
      summaryDownloadData
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;
    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    const downloadOptions = [
      { label: "Summary", value: 1 },
      { label: "Purchases", value: 2 },
      // { label: 'Auto Withdrawal', value: 'Auto Withdrawal' },
      // { label: 'Manual Withdrawal', value: 'Manual Withdrawal' },
      { label: "All", value: 0 }
    ];

    const exportOptions = [
      { label: ".PDF", value: "PDF" },
      { label: ".XLSX", value: "XLSX" }
    ];
    const headers = [
      { label: "Asset", key: "coin" },
      { label: "faldax_fees", key: "faldax_fees" },
      { label: "faldax_usd_fees", key: "faldax_usd_fees" },
      { label: "asset_net", key: "asset_net" }
    ];

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane tab="Batch" key="1">
            <TableDemoStyle className="isoLayoutContent scroll-table">
              <Form layout="inline" onSubmit={this._createBatch}>
                <Row type="flex" justify="end">
                  <ColWithMarginBottom md={6}>
                    <Input
                      placeholder="Enter Last Transaction ID"
                      onChange={this._changeTransID.bind(this)}
                      value={transactionID}
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom md={4}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._createBatch}
                    >
                      <Icon type="plus" />
                      Create Batch
                    </Button>
                  </ColWithMarginBottom>
                </Row>
              </Form>
              {/* {
                        summaryDownloadData && selectedExport.map((exportFile) => {
                            selectedExport.includes('XLSX') &&
                                <CSVLink
                                    data={summaryDownloadData}
                                    filename={'batch.csv'}
                                />
                        })
                    } */}
              {summaryDownloadData &&
                summaryDownloadData.length > 0 &&
                selectedExport[0] == "XLSX" && (
                  <CSVLink
                    data={summaryDownloadData}
                    headers={headers}
                    filename={"batch.csv"}
                  />
                )}
              {showDownloadPopup && (
                <Modal
                  title="Download Batch"
                  visible={showDownloadPopup}
                  confirmLoading={loader}
                  onCancel={this._closeDownloadBatch}
                  footer={[
                    <Button onClick={this._closeDownloadBatch}>Cancel</Button>,
                    <Button onClick={this._downloadBatch}> Download</Button>
                  ]}
                >
                  <div style={{ marginBottom: "15px" }}>
                    <span>
                      <b>
                        Which parts of the batch would you like to download?{" "}
                      </b>
                    </span>
                    <Checkbox.Group
                      options={downloadOptions}
                      defaultValue={[0]}
                      onChange={this._onChangeList}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <span>
                      <b>Export as? </b>
                    </span>
                    <br />
                    <Checkbox.Group
                      options={exportOptions}
                      defaultValue={["XLSX"]}
                      onChange={this._onChangeExportVal}
                    />
                  </div>
                </Modal>
              )}
              <input
                id="myInput"
                type="file"
                ref={ref => (this.upload = ref)}
                style={{ display: "none" }}
                onChange={this.onChangeFile.bind(this)}
              />
              <Table
                components={components}
                bordered
                dataSource={allBatches}
                columns={columns}
                pagination={false}
              />
              {batchCount > 0 ? (
                <Pagination
                  style={{ marginTop: "15px" }}
                  className="ant-users-pagination"
                  onChange={this._handleBatchPagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={Number(batchCount)}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                ""
              )}
              {loader && <FaldaxLoader />}
            </TableDemoStyle>
          </TabPane>
          <TabPane tab="Report" key="2">
              <TableDemoStyle>
                  <BatchMetabase></BatchMetabase>
              </TableDemoStyle>
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(BatchBalance);
