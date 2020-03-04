import React, { Component } from 'react';
import { Input, Pagination, notification, Select, Button, Form, Row, Col } from 'antd';
import { simplexTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
// import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
// import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
// import { CSVLink } from "react-csv";
import authAction from '../../../redux/auth/actions';
// import ColWithPadding from '../common.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from "../../../helpers/globals";
import { PageCounterComponent } from '../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../Shared/exportToCsv';
import { exportCreditCard } from '../../../helpers/exportToCsv/headers';

const Option = Select.Option;
const { logout } = authAction;

class UserSimplexHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTrades: [],
            allTradeCount: 0,
            searchTrade: '',
             limit: PAGESIZE,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            page: 1,
            loader: false,
            filterVal: '',
            trade_type: 2,
            sorterCol: 'created_at',
            sortOrder: 'descend',
            simplex_payment_status: '',
            openCsvModal:false,
            csvData:[]
        }
    }

    componentDidMount = () => {
        this._getUserSimplexTrades();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _changeSearch = (field, e) => {
        this.setState({ searchTrade: field.target.value })
    }

    _changeFilter = (val) => {
        this.setState({ filterVal: val });
    }

    _getUserSimplexTrades = (isExportToCsv=false) => {
        const { token, user_id } = this.props;
        const { searchTrade, page, limit, filterVal, sorterCol, sortOrder, trade_type, simplex_payment_status } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        (isExportToCsv?ApiUtils.getUserTrades(1, EXPORT_LIMIT_SIZE, token, "", user_id, "", "", "", trade_type, ""):ApiUtils.getUserTrades(page, limit, token, searchTrade, user_id, filterVal, sorterCol, sortOrder, trade_type, simplex_payment_status))
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    res.data=res.data.map(ele=>{
                        ele['simplex_payment_status']=ele['simplex_payment_status']==1?'Under Approval':(ele['simplex_payment_status']==2?'Approved':'Cancelled');
                        return ele;
                    })
                    if(isExportToCsv)
                    _this.setState({csvData:res.data});
                    else
                    _this.setState({ allTrades: res.data, allTradeCount: res.tradeCount });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errMsg: true, errMessage: 'Unable to complete the requested action.', errType: 'error', loader: false
                });
            });
    }

    _searchTrade = (e) => {
        e.preventDefault();
        this.setState({ page: 1 }, () => {
            this._getUserSimplexTrades();
        })
    }

    _changeStatus = (val) => {
        this.setState({ simplex_payment_status: val });
    }

    _handleTradePagination = (page) => {
        this.setState({ page }, () => {
            this._getUserSimplexTrades();
        })
    }

    _resetFilters = () => {
        this.setState({ filterVal: '', searchTrade: '', page: 1 }, () => {
            this._getUserSimplexTrades();
        })
    }

    _handleUserTradeChange = (pagination, filters, sorter) => {
        this.setState({ sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 }, () => {
            this._getUserSimplexTrades();
        })
    }

    _changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this._getUserSimplexTrades();
        });
    }

    render() {
        const { allTrades, allTradeCount, errType, errMsg, page, loader,
            searchTrade, limit, simplex_payment_status,csvData,openCsvModal } = this.state;
       let pageSizeOptions = PAGE_SIZE_OPTIONS

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
          <>
            <ExportToCSVComponent
              isOpenCSVModal={openCsvModal}
              onClose={() => {
                this.setState({ openCsvModal: false });
              }}
              filename="user_credit_card_history.csv"
              data={csvData}
              header={exportCreditCard}
            />
            <PageCounterComponent
              page={page}
              limit={limit}
              dataCount={allTradeCount}
              syncCallBack={this._resetFilters}
            />
            <Form onSubmit={this._searchTrade}>
              <Row type="flex" justify="start" className="table-filter-row">
                <Col sm={8}>
                  <Input
                    placeholder="Search trades"
                    onChange={this._changeSearch.bind(this)}
                    value={searchTrade}
                  />
                </Col>
                {/* <Col sm={4}>
                                <Select
                                    getPopupContainer={trigger => trigger.parentNode}
                                    placeholder="Select a type"
                                    onChange={this._changeFilter}
                                    value={filterVal}
                                >
                                    <Option value={''}>All</Option>
                                    <Option value={'Buy'}>Buy</Option>
                                    <Option value={'Sell'}>Sell</Option>
                                </Select>
                            </Col> */}
                <Col sm={7}>
                  <Select
                    getPopupContainer={trigger => trigger.parentNode}
                    placeholder="Select Status"
                    onChange={this._changeStatus}
                    value={simplex_payment_status}
                  >
                    <Option value={""}>All</Option>
                    <Option value={1}>Under Approval</Option>
                    <Option value={2}>Approved</Option>
                    <Option value={3}>Cancelled</Option>
                  </Select>
                </Col>
                <Col xs={12} sm={3}>
                  <Button
                    htmlType="submit"
                    icon="search"
                    className="filter-btn full-width"
                    type="primary"
                    style={{ margin: "0px" }}
                  >
                    Search
                  </Button>
                </Col>
                <Col xs={12} sm={3}>
                  <Button
                    icon="reload"
                    className="filter-btn full-width"
                    type="primary"
                    onClick={this._resetFilters}
                    style={{ margin: "0px" }}
                  >
                    Reset
                  </Button>
                </Col>
                <Col xs={12} sm={3}>
                  <Button
                    type="primary"
                    icon="export"
                    className="filter-btn btn-full-width"
                    onClick={() => {
                      this.setState({ openCsvModal: true }, () =>
                        this._getUserSimplexTrades(true)
                      );
                    }}
                  >
                    Export
                  </Button>
                </Col>
              </Row>
            </Form>
            {loader && <FaldaxLoader />}
            <div className="scroll-table">
              <TableWrapper
                rowKey="id"
                {...this.state}
                columns={simplexTableInfos[0].columns}
                pagination={false}
                dataSource={allTrades}
                bordered
                className="table-tb-margin"
                scroll={TABLE_SCROLL_HEIGHT}
                onChange={this._handleUserTradeChange}
              />
              {allTradeCount > 0 ? (
                <Pagination
                  className="ant-users-pagination"
                  onChange={this._handleTradePagination.bind(this)}
                  pageSize={limit}
                  current={page}
                  total={parseInt(allTradeCount)}
                  showSizeChanger
                  onShowSizeChange={this._changePaginationSize}
                  pageSizeOptions={pageSizeOptions}
                />
              ) : (
                ""
              )}
            </div>
          </>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(UserSimplexHistory);

export { UserSimplexHistory, simplexTableInfos };
