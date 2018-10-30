import React, { Component } from 'react';
import { Input, Tabs, Pagination, notification, Spin } from 'antd';
import { countryTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditCountryModal from './editCountryModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCountries: [],
            allCountryCount: 0,
            searchCountry: '',
            limit: 50,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            page: 1,
            showEditCountryModal: false,
            countryDetails: []
        }
        self = this;
        Countries.countryStatus = Countries.countryStatus.bind(this);
        Countries.editCountry = Countries.editCountry.bind(this);
        Countries.showStates = Countries.showStates.bind(this);
    }

    static countryStatus(value, name, legality, color, is_active) {
        const { token } = this.props;

        self.setState({ loader: true })
        let message = is_active ? 'Country has been de-activated successfully.' : 'Country has been activated successfully.'
        let formData = {
            id: value,
            legality,
            color,
            name,
            is_active: !is_active
        };

        ApiUtils.activateCountry(token, formData)
            .then((res) => res.json())
            .then((res) => {
                self.setState({
                    errMsg: true, errMessage: message, errType: 'Success',
                    loader: false, page: 1
                })
                self._getAllCountries(1);
            })
            .catch(() => {
                self.setState({ errMsg: true, errMessage: 'Something went wrong!!', errType: 'error' });
            });
    }

    static editCountry(value, name, legality, color, is_active) {
        let countryDetails = { value, name, legality, color, is_active };
        self.setState({ showEditCountryModal: true, countryDetails, page: 1 })
    }

    static showStates(value) {
        this.props.history.push('/dashboard/country/' + value + '/states');
    }

    componentDidMount = () => {
        this._getAllCountries(1);
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
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, message: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    _closeEditCountryModal = () => {
        this.setState({ showEditCountryModal: false, countryDetails: [] })

    }

    _searchCountry = (val) => {
        this.setState({ searchCountry: val, page: 1, loader: true }, () => {
            this._getAllCountries(1);
        });
    }

    _handleCoinPagination = (page) => {
        this._getAllCountries(page);
        this.setState({ page })
    }

    render() {
        const { allCountries, allCountryCount, errType, errMsg, loader,
            page, showEditCountryModal, countryDetails } = this.state;

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
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allCountries}
                                        className="isoCustomizedTable"
                                    />
                                    {showEditCountryModal &&
                                        <EditCountryModal
                                            fields={countryDetails}
                                            showEditCountryModal={showEditCountryModal}
                                            closeEditCountryModal={this._closeEditCountryModal}
                                            getAllCountry={this._getAllCountries.bind(this, 1)}
                                        />
                                    }
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleCoinPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
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
        token: state.Auth.get('token')
    }))(Countries);

export { Countries, countryTableInfos };
