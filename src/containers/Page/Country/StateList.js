import React, { Component } from 'react';
import { Input, Tabs, notification, Spin } from 'antd';
import { stateTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditStateModal from './editStateModal';

const Search = Input.Search;
const TabPane = Tabs.TabPane;
var self;

class StateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStates: [],
            searchState: '',
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showEditStateModal: false,
            stateDetails: []
        }
        self = this;
        StateList.stateStatus = StateList.stateStatus.bind(this);
        StateList.editState = StateList.editState.bind(this);
    }

    static stateStatus(value, name, legality, color, is_active) {
        const { token } = this.props;

        self.setState({ loader: true })
        let message = is_active ? 'State has been de-activated successfully.' : 'State has been activated successfully.'
        let formData = {
            id: value,
            legality,
            color,
            name,
            is_active: !is_active
        };

        ApiUtils.activateState(token, formData)
            .then((res) => res.json())
            .then((res) => {
                self.setState({
                    loader: false, errMsg: true, errMessage: message, errType: 'Success'
                })
                self._getAllStates();
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    static editState(value, name, legality, color, is_active) {
        let stateDetails = { value, name, legality, color, is_active };
        self.setState({ showEditStateModal: true, stateDetails })
    }

    componentDidMount = () => {
        this._getAllStates();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllStates = () => {
        const { token } = this.props;
        const { searchState } = this.state;
        let _this = this;
        let countryId = '';
        let path = this.props.location.pathname.split('/');
        countryId = path[3];

        ApiUtils.getAllStates(token, countryId, searchState)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allStates: res.data });
                } else {
                    _this.setState({ errMsg: true, message: res.message, searchState: '' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    loader: false, errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error',
                })
            });
    }

    _closeEditStateModal = () => {
        this.setState({ showEditStateModal: false })
    }

    _searchState = (val) => {
        this.setState({ searchState: val, loader: true }, () => {
            this._getAllStates();
        });
    }

    render() {
        const { allStates, errType, errMsg, loader, showEditStateModal, stateDetails } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {stateTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Search
                                        placeholder="Search states"
                                        onSearch={(value) => this._searchState(value)}
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
                                        dataSource={allStates}
                                        className="isoCustomizedTable"
                                    />
                                    {showEditStateModal &&
                                        <EditStateModal
                                            fields={stateDetails}
                                            showEditStateModal={showEditStateModal}
                                            closeEditStateModal={this._closeEditStateModal}
                                            getAllStates={this._getAllStates.bind(this, 1)}
                                        />
                                    }
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
    }))(StateList);

export { StateList, stateTableInfos };
