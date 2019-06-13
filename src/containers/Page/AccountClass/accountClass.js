import React, { Component } from 'react';
import { Button, Tabs, notification, Modal, Input } from 'antd';
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
import SimpleReactValidator from 'simple-react-validator';

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class AccountClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
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
        this.validator = new SimpleReactValidator();
    }

    static editAccountClass(value, class_name) {
        let accountClassDetails = {
            value, class_name
        }
        self.setState({ accountClassDetails, showEditAccountClassModal: true });
    }

    static deleteAccountClass(value, class_name) {
        self.setState({ showDeleteAccountClassModal: true, deleteClassId: value });
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

    _closeDeleteClassModal = () => {
        this.setState({ showDeleteAccountClassModal: false });
        this.validator = new SimpleReactValidator();
    }

    _deleteAccountClass = () => {
        const { token, user } = this.props;
        const { deleteClassId, fields } = this.state;
        let _this = this;

        const formData = {
            admin_id: user.id,
            otp: fields["otp"],
            class_id: deleteClassId
        }

        if (this.validator.allValid()) {
            this.setState({ loader: true })
            ApiUtils.deleteAccountClass(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res) {
                        if (res.status == 200) {
                            _this.setState({
                                deleteClassId: '', showDeleteAccountClassModal: false, errMessage: res.message, errMsg: true
                            }, () => {
                                _this._getAllAccountClasses();
                            });
                        } else if (res.status == 403) {
                            _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                                _this.props.logout();
                            });
                        } else {
                            _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                        }
                    } else {
                        _this.setState({ deleteClassId: '', showDeleteAccountClassModal: false });
                    }
                    this.setState({ loader: false })
                }).catch(() => {
                    _this.setState({ deleteClassId: '', showDeleteCoinModal: false, loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _onChangeFields(field, e) {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    render() {
        const { allAccountClasses, errType, errMsg, loader, showAddClassModal, accountClassDetails,
            showEditAccountClassModal, showDeleteAccountClassModal, fields
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
                                    {showAddClassModal &&
                                        <AddAccountClassModal
                                            showAddClassModal={showAddClassModal}
                                            closeAddModal={this._closeAddClassModal}
                                            getAllAccountClass={this._getAllAccountClasses.bind(this, 0)}
                                        />}
                                    {showEditAccountClassModal &&
                                        <EditAccountClassModal
                                            fields={accountClassDetails}
                                            showEditAccountClassModal={showEditAccountClassModal}
                                            closeEditClassModal={this._closeEditClassModal}
                                            getAllAccountClass={this._getAllAccountClasses.bind(this, 1)}
                                        />}
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
                                    {
                                        showDeleteAccountClassModal &&
                                        <Modal
                                            title="Delete Account Class"
                                            visible={showDeleteAccountClassModal}
                                            onCancel={this._closeDeleteClassModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteClassModal}>Cancel</Button>,
                                                this.props.is_twofactor ? <Button onClick={this._deleteAccountClass}>Yes</Button> : '',
                                            ]}
                                        >
                                            {this.props.user.is_twofactor ?
                                                <div>
                                                    <span>Enter your two-factor code here:</span>
                                                    <div style={{ marginTop: "20px" }}>
                                                        <Input style={{ width: "200px" }} value={fields["otp"]}
                                                            onChange={this._onChangeFields.bind(this, "otp")} />
                                                    </div>
                                                    <span className="field-error">
                                                        {this.validator.message('OTP', fields['otp'], 'required')}
                                                    </span>
                                                    <Button type="primary" style={{ marginTop: "20px", marginBottom: "20px" }}
                                                        onClick={this._deleteAccountClass}>Delete Account Class</Button>
                                                </div>
                                                : <div>
                                                    <span>Enable two factor authentication to remove the account class.</span><br />
                                                    <Button type="primary" onClick={() => { this.props.history.push('/dashboard/edit-profile') }}>Enable Now</Button>
                                                </div>}
                                        </Modal>
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
        token: state.Auth.get('token'),
        user: state.Auth.get('user')
    }), { logout })(AccountClass);

export { AccountClass, accountClassTableinfos };
