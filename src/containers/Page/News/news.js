import React, { Component } from "react";
import {
  Input,
  Tabs,
  Pagination,
  notification,
  Select,
  DatePicker,
  Button,
  Form,
  Row,
  Icon,
  Col
} from "antd";
import { newsTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import moment from "moment";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import {ColWithMarginBottom} from "../common.style";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import { isAllowed } from '../../../helpers/accessControl';
import styled from "styled-components";

const Option = Select.Option;
const { logout } = authAction;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
var self;

const IframeCol = styled(Col)`
  width: 100%;
  > iframe {
    height: calc(100vh - 326px);
    min-height: 500px;
  }
`;

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNews: [],
      allNewsCount: 0,
      searchNews: "",
      limit: PAGESIZE,
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false,
      filterVal: "",
      startDate: "",
      endDate: "",
      rangeDate: [],
      metabaseUrl: ""
    };
    self = this;
    News.newsStatus = News.newsStatus.bind(this);
  }

  static newsStatus(
    value,
    cover_image,
    title,
    link,
    posted_at,
    description,
    is_active,
    owner
  ) {
    const { token } = this.props;
    let formData = {
      id: value,
      is_active: !is_active
    };

    let message = is_active
      ? "News has been inactivated successfully."
      : "News has been activated successfully.";
    self.setState({ loader: true });
    ApiUtils.changeNewsStatus(token, formData)
      .then(response => response.json())
      .then(function (res) {
        if (res) {
          self._getAllNews();
          self.setState({
            errMsg: true,
            errMessage: message,
            errType: "Success",
            loader: false
          });
        }
        self.setState({ loader: false });
      })
      .catch(err => {
        self.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          searchNews: "",
          errType: "error",
          loader: false
        });
      });
  }

  componentDidMount = () => {
    this._getAllNews();
    this._getAllNewsSources();
  };

  _getAllNews = () => {
    const { token } = this.props;
    const {
      searchNews,
      page,
      limit,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder
    } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllNews(
      page,
      limit,
      token,
      searchNews,
      filterVal,
      startDate,
      endDate,
      sorterCol,
      sortOrder
    )
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allNews: res.data, allNewsCount: res.newsCount });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
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

  _getAllNewsSources = () => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllNewsSources(token)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allNewsSources: res.data });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
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

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _searchNews = e => {
    e.preventDefault();
    var patt = new RegExp("^[_A-z0-9]*((-|s)*[_A-z0-9])*$");
    if (patt.test(this.state.searchNews)) {
      this.setState({ page: 1 }, () => {
        this._getAllNews();
      });
    } else {
      this.setState({
        errMsg: true,
        errMessage: "Special Characters are not allowed in search.",
        errType: "error",
        loader: false
      });
    }
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _changeSearch = (field, e) => {
    this.setState({ searchNews: field.target.value }, () => {
      var patt = new RegExp("^[_A-z0-9]*((-|s)*[_A-z0-9])*$");
      if (patt.test(this.state.searchNews)) {
        this.setState({ searchValid: "success" });
      } else {
        this.setState({ searchValid: "error" });
      }
    });
  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  isabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56]
    };
  };

  _changeDate = (date, dateString) => {
    this.setState({
      rangeDate: date,
      startDate: date.length > 0 ? moment(date[0]).toISOString() : "",
      endDate: date.length > 0 ? moment(date[1]).toISOString() : ""
    });
  };

  _resetFilters = () => {
    this.setState(
      {
        filterVal: "",
        searchNews: "",
        startDate: "",
        endDate: "",
        rangeDate: [],
        sorterCol: "",
        sortOrder: ""
      },
      () => {
        this._getAllNews();
      }
    );
  };

  _changeFilter = val => {
    this.setState({ filterVal: val });
  };

  _handleNewsPagination = page => {
    this.setState({ page }, () => {
      this._getAllNews();
    });
  };

  _handleNewsTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllNews();
      }
    );
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllNews();
    });
  };

  async getMetaBaseUrl() {
    try {
      this.setState({ loader: true })
      let response = await (await ApiUtils.metabase(this.props.token).getNewsRequest()).json();
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
    const {
      allNews,
      allNewsCount,
      errType,
      errMsg,
      page,
      loader,
      searchNews,
      rangeDate,
      filterVal,
      allNewsSources,
      limit,
      metabaseUrl
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width" onChange={this.onChangeTabs}>
          {newsTableInfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                <Form onSubmit={this._searchNews}>
                  <Row>
                    <ColWithMarginBottom md={6}>
                      <Form.Item
                        validateStatus={this.state.searchValid}
                        className="news-search"
                      >
                        <Input
                          placeholder="Search news"
                          onChange={this._changeSearch.bind(this)}
                          value={searchNews}
                        />
                      </Form.Item>
                    </ColWithMarginBottom>
                    {isAllowed("get_all_news_source") &&
                      <ColWithMarginBottom md={6}>
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                          placeholder="Select a source"
                          onChange={this._changeFilter}
                          value={filterVal}
                        >
                          <Option value={""}>{"All"}</Option>
                          {allNewsSources &&
                            allNewsSources.map((news, index) => (
                              <Option key={news.id} value={news.slug}>
                                {news.source_name}
                              </Option>
                            ))}
                        </Select>
                      </ColWithMarginBottom>
                    }
                    <ColWithMarginBottom md={6}>
                      <RangePicker
                        value={rangeDate}
                        disabledTime={this.disabledRangeTime}
                        onChange={this._changeDate}
                        format="YYYY-MM-DD"
                        allowClear={false}
                      />
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} md={3}>
                      <Button
                        htmlType="submit"
                        className="filter-btn btn-full-width"
                        type="primary"
                      >
                        <Icon type="search" />
                        Search
                      </Button>
                    </ColWithMarginBottom>
                    <ColWithMarginBottom xs={12} md={3}>
                      <Button
                        className="filter-btn btn-full-width"
                        type="primary"
                        onClick={this._resetFilters}
                      >
                        <Icon type="reload" /> Reset
                      </Button>
                    </ColWithMarginBottom>
                  </Row>
                </Form>
                {loader && <FaldaxLoader />}
                <div className="float-clear">
                  <TableWrapper
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={allNews}
                    className="isoCustomizedTable"
                    onChange={this._handleNewsTableChange}
                  />
                </div>
                {allNewsCount > 0 ? (
                  <Pagination
                    style={{ marginTop: "15px" }}
                    className="ant-users-pagination"
                    onChange={this._handleNewsPagination.bind(this)}
                    pageSize={limit}
                    current={page}
                    total={allNewsCount}
                    showSizeChanger
                    onShowSizeChange={this._changePaginationSize}
                    pageSizeOptions={pageSizeOptions}
                  />
                ) : (
                    ""
                  )}
              </TableDemoStyle>
            </TabPane>
          ))}
          <TabPane tab="Metabase-News Management" key="metabase">
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
    token: state.Auth.get("token")
  }),
  { logout }
)(News);

export { News, newsTableInfos };
