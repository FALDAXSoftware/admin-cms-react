import React, { Component } from 'react';
import { Tabs, notification, Pagination, Input, DatePicker, Row, Form, Button, Icon, Col } from 'antd';
import { KYCInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import ViewKYCModal from './viewKYCModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';
import ApprovedKYC from './approvedKYC';
import ReviewKYC from './reviewKYC';
import DeclinedKYC from './declinedKYC';
import moment from 'moment';
import ColWithMarginBottom from '../common.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import styled from 'styled-components';

const IframeCol = styled(Col)`
  width: 100%;
  > iframe {
    height: calc(100vh - 326px);
    min-height: 500px;
  }
`;

const { logout } = authAction;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
var self;

class KYC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allKYCData: [],
      showViewKYCModal: false,
      kycDetails: [],
      errMessage: '',
      errMsg: false,
      errType: '',
      loader: false,
      page: 1,
      limit: PAGESIZE,
      searchKYC: '',
      allKYCCount: 0,
      startDate: '',
      endDate: '',
      rangeDate: [],
      metabaseUrl: ""
    }
    self = this;
    KYC.viewKYC = KYC.viewKYC.bind(this);
  }

  static viewKYC(value, mtid, first_name, last_name, email, direct_response, kycDoc_details,
    webhook_response, address, country, city, zip, dob, id_type, created_at) {
    let kycDetails = {
      value, mtid, first_name, last_name, email, direct_response, kycDoc_details,
      webhook_response, address, country, city, zip, dob, id_type, created_at
    }
    self.setState({ kycDetails, showViewKYCModal: true })
  }

  componentDidMount = () => {
    this._getAllKYCData();
  }

  _getAllKYCData = () => {
    const { token } = this.props;
    const { page, limit, searchKYC, sorterCol, sortOrder, startDate, endDate } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getKYCData(token, page, limit, searchKYC, sorterCol, sortOrder, startDate, endDate)
      .then((response) => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allKYCData: res.data, allKYCCount: parseInt(res.KYCCount) });
        } else if (res.status == 403) {
          _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
            _this.props.logout();
          });
        } else {
          _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
        });
      });
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  isabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : '',
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ''
    })
  }

  openNotificationWithIcon = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _closeViewKYCModal = () => {
    this.setState({ showViewKYCModal: false });
  }

  _handleKYCPagination = (page) => {
    this.setState({ page }, () => {
      this._getAllKYCData();
    })
  }

  _handleKYCTableChange = (pagination, filters, sorter) => {
    this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
      this._getAllKYCData();
    })
  }

  _searchKYC = (e) => {
    e.preventDefault();
    this.setState({ page: 1 }, () => {
      this._getAllKYCData();
    })
  }

  _changeSearch = (field, e) => {
    this.setState({ searchKYC: field.target.value })
  }

  _resetFilters = () => {
    this.setState({
      filterVal: '', searchKYC: '', startDate: '', endDate: '',
      rangeDate: [], page: 1, sorterCol: '', sortOrder: ''
    }, () => {
      this._getAllKYCData();
    })
  }

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllKYCData();
    });
  }

  async getMetaBaseUrl() {
    try {
      this.setState({ loader: true })
      let response = await (await ApiUtils.metabase(this.props.token).getKYCRequest()).json();
      if (response.status == 200) {
        this.setState({ metabaseUrl: response.frameURL })
      } else if (response.statue == 400 || response.status == 403) {

      }
    } catch (error) {

    } finally {
      this.setState({ loader: false })
    }
  }

  onChangeTabs = (key) => {
    if (key == "metabase" && this.state.metabaseUrl == "") {
      console.log("Metabase is calling")
      this.getMetaBaseUrl();
    }
  }

  render() {
    const { allKYCData, errMsg, errType, loader, kycDetails, showViewKYCModal, page,
      allKYCCount, rangeDate, searchKYC, limit, metabaseUrl } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS

    if (errMsg) {
      this.openNotificationWithIcon(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab" onChange={this.onChangeTabs}>
          <TabPane tab={KYCInfos[0].title} key={KYCInfos[0].value}>
            <TableDemoStyle className="isoLayoutContent">
              <Form onSubmit={this._searchKYC}>
                <Row type="flex" justify="end">
                  <ColWithMarginBottom md={6}>
                    <Input
                      placeholder="Search KYC"
                      onChange={this._changeSearch.bind(this)}
                      value={searchKYC}
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom md={6}>
                    <RangePicker
                      value={rangeDate}
                      disabledTime={this.disabledRangeTime}
                      onChange={this._changeDate}
                      format="YYYY-MM-DD"
                      allowClear={false}
                      style={{ width: "100%" }}
                    />
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={12} md={3}>
                    <Button
                      htmlType="submit"
                      className="filter-btn btn-full-width"
                      type="primary"
                    >
                      <Icon type="search" />Search
                          </Button>
                  </ColWithMarginBottom>
                  <ColWithMarginBottom xs={12} md={3}>
                    <Button
                      className="filter-btn btn-full-width"
                      type="primary"
                      onClick={this._resetFilters}
                    >
                      <Icon type="reload" />Reset
                          </Button>
                  </ColWithMarginBottom>
                </Row>
              </Form>
              {loader && <FaldaxLoader />}
              <ViewKYCModal
                kycDetails={kycDetails}
                showViewKYCModal={showViewKYCModal}
                closeViewModal={this._closeViewKYCModal}
              />
              {KYCInfos.map(tableInfo => (
                <TableWrapper
                  {...this.state}
                  columns={tableInfo.columns}
                  pagination={false}
                  dataSource={allKYCData}
                  className="isoCustomizedTable"
                  onChange={this._handleKYCTableChange}
                />
              ))}
              {allKYCCount > 0 ? (
                <Pagination
                  style={{ marginTop: "15px" }}
                  className="ant-users-pagination"
                  onChange={this._handleKYCPagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={allKYCCount}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                  ""
                )}
            </TableDemoStyle>
          </TabPane>
          <TabPane tab="Approved KYC" key="2">
            <ApprovedKYC />
          </TabPane>
          <TabPane tab="Under Review KYC" key="3">
            <ReviewKYC />
          </TabPane>
          <TabPane tab="Declined KYC" key="4">
            <DeclinedKYC />
          </TabPane>
          <TabPane tab="Metabase-KYC Management" key="metabase">
            <TableDemoStyle className="isoLayoutContent">
              {metabaseUrl &&
                <IframeCol>
                  <iframe
                    src={metabaseUrl}
                    frameborder="0"
                    width="100%"
                    allowtransparency
                  ></iframe>
                </IframeCol>}
            </TableDemoStyle>
          </TabPane>
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    user: state.Auth.get('user'),
    token: state.Auth.get('token')
  }), { logout })(KYC);

export { KYC }
