import React, { Component } from 'react';
import { notification, Pagination,Icon,Button,Form, Row, Col,Select,Input } from 'antd';
import { tierReqTableInfos } from "../../Tables/antTables";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import authAction from '../../../redux/auth/actions';
import { PAGE_SIZE_OPTIONS,TABLE_SCROLL_HEIGHT, PAGESIZE } from "../../../helpers/globals";
import ApiUtils from '../../../helpers/apiUtills';
import FaldaxLoader from "../faldaxLoader";
const { logout } = authAction;
const {Option}=Select;

class RejectedRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rejectedRequests:[],
            limit:PAGESIZE,
            page:1,
            loader:false,
            tradeCount:0,
            searchData:"",
            type:""
        }
    }onSearch=(e)=>{
      e.preventDefault();
      this.getAllRejectedTier();
  }

    componentDidMount(){
        this.getAllRejectedTier();
    }

    changePaginationSize = (current, pageSize) => {
      this.setState({ page: current, limit: pageSize }, () => {
        this.getAllRejectedTier();
      });
    };
  
  _handlePagination = page => {
      this.setState({ page }, () => {
        this.getAllRejectedTier();
      });
    };

    getAllRejectedTier(){
        const { token } = this.props;
        const { sorterCol, sortOrder,limit,page,searchData,type } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllTierRequests(
          token,
          this.props.tier,
          sorterCol,
          sortOrder,
          limit,
          page,
          undefined,
          3,searchData,type
        )
          .then((response) => response.json())
          .then(function (res) {
            if (res.status == 200) {
              _this.setState({
                rejectedRequests: res.tradeData,
                tradeCount:res.tradeCount
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
            this.setState({ rejectedRequests: nextProps.data })
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    render() {
        const { errType, errMsg, rejectedRequests,loader,searchData,type,page,limit,tradeCount } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <div className="isoLayoutContent">
              <Form onSubmit={this.onSearch}>
                <Row  type="flex" justify="start" className="table-filter-row">
                  <Col lg={8}>
                    <Form.Item
                      validateStatus={this.state.searchValid}
                      className="cty-search"
                    >
                      <Input
                        placeholder="Search Tier"
                        onChange={(field)=>{this.setState({searchData:field.target.value})}}
                        value={searchData}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={7}>
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      placeholder="Select a Type"
                      onChange={(field)=>{this.setState({type:field})}}
                      value={type}
                    >
                        <Option value="">All</Option>
                      <Option value={"1"}>Valid ID</Option>
                      <Option value={"2"}>Prof of Residency</Option>
                      <Option value={"3"}>Equivalent Govt</Option>
                    </Select>
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
                      onClick={()=>{this.setState({searchData:"",type:""},()=>this.getAllRejectedTier())}}
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
                    >
                      Export
                    </Button>
                  </Col>
                </Row>
              </Form>
                {loader && <FaldaxLoader/>}
                {tierReqTableInfos.map(tableInfo => (
                    <TableWrapper
                        rowKey="id"
                        {...this.state}
                        columns={tableInfo.columns}
                        pagination={false}
                        dataSource={rejectedRequests}
                        className="table-tb-margin"
                        onChange={this._handlePairsChange}
                        bordered
                        scroll={TABLE_SCROLL_HEIGHT}
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
    }), { logout })(RejectedRequests);

export { RejectedRequests, tierReqTableInfos };
