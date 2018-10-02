import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Icon, Spin } from 'antd';
import { countryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
var self;

class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCountries: [],
            allCountryCount: 0,
            searchCountry: '',
            limit: 5,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            page: 1
        }
        self = this;
        Countries.countryStatus = Countries.countryStatus.bind(this);
    }

    static countryStatus(value, name, country_code, is_active) {
        const { token } = this.props;

        self.setState({ loader: true })
        let formData = {
            id: value,
            code: country_code,
            name,
            is_active: !is_active
        };

        ApiUtils.activateCountry(token, formData)
            .then((res) => res.json())
            .then(() => {
                self.setState({ loader: false, page: 1 })
                self._getAllCountries(0);
            })
            .catch(error => {
                self.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    componentDidMount = () => {
        this._getAllCountries(0);
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllCountries = (page) => {
        const { token } = this.props;
        const { limit, searchCountry } = this.state;
        let _this = this;

        ApiUtils.getAllCountries(page, limit, token, searchCountry)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allCountries: res.data, allCountryCount: res.CountryCount });
                } else {
                    _this.setState({ errMsg: true, message: res.message, searchCountry: '' });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _searchCountry = (val) => {
        this.setState({ searchCountry: val, page: 1 }, () => {
            this._getAllCountries(0);
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCountries(page - 1);
        this.setState({ page })
    }

    render() {
        const { allCountries, allCountryCount, errType, errMsg, loader, page } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {countryTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search countries"
                                        onSearch={(value) => this._searchCountry(value)}
                                        style={{ "float": "right", "width": "250px" }}
                                        enterButton
                                    />
                                </div>
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCountries}
                                        className="isoCustomizedTable"
                                    />
                                    <Pagination
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={5}
                                        current={page}
                                        total={allCountryCount}
                                    />
                                    {loader && <Spin indicator={loaderIcon} />}
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </TableDemoStyle>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(Countries);

export { Countries, countryTableInfos };
