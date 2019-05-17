import React, { Component } from 'react';
import { Button, Tabs, notification } from 'antd';
import { accountClassTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddAccountClassModal from './addAccountClassModal';
import EditAccountClassModal from './editAccountClass';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class AccountClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAccountClasses: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddClassModal: false,
            showEditAccountClassModal: false,
            showDeleteAccountClassModal: false,
        }
        self = this;
        AccountClass.editAccountClass = AccountClass.editAccountClass.bind(this);
        AccountClass.deleteAccountClass = AccountClass.deleteAccountClass.bind(this);
    }

    static editAccountClass(value, class_name) {
        let accountClassDetails = {
            value, class_name
        }
        self.setState({ accountClassDetails, showEditAccountClassModal: true });
    }

    static deleteAccountClass(value, class_name) {
        const { token } = this.props;

        let formData = {
            id: value,
            class_name: class_name
        };

        self.setState({ loader: true })
        ApiUtils.editCoin(token, formData)
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 200) {
                    self.setState({
                        errMsg: true, errMessage: res.message, errType: 'Success', loader: false
                    })
                    self._getAllAccountClasses();
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error', loader: false }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({
                        errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                    });
                }
            })
            .catch(() => {
                self.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    componentDidMount = () => {
        this._getAllAccountClasses();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllAccountClasses = () => {
        const { token } = this.props;
        const { } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllAccountClasses(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allAccountClasses: res.allClasses });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _showAddAccClassModal = () => {
        this.setState({ showAddClassModal: true });
    }

    _closeAddClassModal = () => {
        this.setState({ showAddClassModal: false });
    }

    _closeEditClassModal = () => {
        this.setState({ showEditAccountClassModal: false });
    }

    _changeRow = (emp) => {
        this.props.history.push('/dashboard/employee/' + emp.id)
    }

    render() {
        const { allAccountClasses, errType, errMsg, loader, showAddClassModal, accountClassDetails,
            showEditAccountClassModal, showDeleteAccountClassModal
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {accountClassTableinfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddAccClassModal}>Add</Button>
                                    <AddAccountClassModal
                                        showAddClassModal={showAddClassModal}
                                        closeAddModal={this._closeAddClassModal}
                                        getAllAccountClass={this._getAllAccountClasses.bind(this, 0)}
                                    />
                                    <EditAccountClassModal
                                        fields={accountClassDetails}
                                        showEditAccountClassModal={showEditAccountClassModal}
                                        closeEditClassModal={this._closeEditClassModal}
                                        getAllAccountClass={this._getAllAccountClasses.bind(this, 1)}
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allAccountClasses}
                                        className="isoCustomizedTable"
                                        onChange={this._handleEmployeeChange}
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
    }), { logout })(AccountClass);

export { AccountClass, accountClassTableinfos };
