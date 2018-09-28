import React, { Component } from 'react';
import { Input, Tabs, Pagination, Button, Modal, notification } from 'antd';
import { countryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';

const Search = Input.Search;
const TabPane = Tabs.TabPane;

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
            errType: 'Success'
        }
        Countries.countryStatus = Countries.countryStatus.bind(this);
    }

    static countryStatus(value, name, country_code, is_active) {
        const { token } = this.props;

        let formData = {
            id: value,
            code: country_code,
            name,
            is_active: !is_active
        };

        ApiUtils.activateCountry(token, formData)
            .then((res) => res.json())
            .then((res) => {
                this._getAllCountries(0);
            })
            .catch(error => {
                console.error(error);
                this.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
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
                    _this.setState({ allCountries: res.data, allCountryCount: res.CountryCount, searchCountry: '' });
                } else {
                    _this.setState({ errMsg: true, message: res.message, searchCountry: '' });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _searchCountry = (val) => {
        this.setState({ searchCountry: val }, () => {
            this._getAllCountries(0);
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCountries(page - 1);
    }

    render() {
        const { allCountries, allCountryCount, errType, errMsg } = this.state;

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
                                        defaultCurrent={1}
                                        total={allCountryCount}
                                    />
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
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(Countries);

export { Countries, countryTableInfos };
