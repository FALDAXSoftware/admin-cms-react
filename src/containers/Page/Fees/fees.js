import React, { Component } from 'react';
import { Tabs, notification, Input, Button } from 'antd';
import { FeesInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import EditFeesModal from "./editFeesModal";
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Fees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allFeesData: [],
            showEditFeesModal: false,
            feesDetails: [],
            errMessage: '',
            errMsg: false,
            errType: '',
            loader: false,
            fields: {},
            prevFees: ''
        }
        this.validator = new SimpleReactValidator({
            className: 'text-danger',
            custom_between: {
                message: 'The :attribute must be between 1 to 100 %.',
                rule: function (val, params, validator) {
                    if (isNaN(val)) {
                        return false;
                    } else if (parseFloat(val) >= parseFloat(params[0]) && parseFloat(val) <= parseFloat(params[1])) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
        self = this;
        Fees.editFees = Fees.editFees.bind(this);
    }

    static editFees(value, trade_volume, maker_fee, taker_fee) {
        let feesDetails = {
            value, trade_volume, maker_fee, taker_fee
        }
        self.setState({ feesDetails, showEditFeesModal: true });
    }

    componentDidMount = () => {
        this._getAllFeesData();
        this._getContactDetails();
    }

    _getContactDetails = () => {
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getContactDetails()
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    if (res.status == 200) {
                        let fields = _this.state.fields;
                        fields['default_send_coin_fee'] = res.data.default_send_coin_fee;
                        _this.setState({ fields, prevFees: res.data.default_send_coin_fee });
                    } else if (res.status == 403) {
                        self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            self.props.logout();
                        });
                    } else {
                        self.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    }
                    self.setState({ loader: false });
                }
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
    }

    _getAllFeesData = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getFeesData(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allFeesData: res.data });
                } else if (res.status == 403) {
                    self.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        self.props.logout();
                    });
                } else {
                    self.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!', errType: 'error', loader: false
                });
            });
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

    _updateSendFee = () => {
        const { token } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                send_coin_fee: fields['default_send_coin_fee'],
            }

            ApiUtils.updateSendCoinFee(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                        }, () => {
                            _this._getContactDetails();
                        })
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'error' });
                    }
                })
                .catch(() => {
                    _this.setState({ loader: false });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _closeEditFeesModal = () => {
        this.setState({ showEditFeesModal: false });
    }

    _cancelSendFee = () => {
        let fields = this.state.fields;
        fields['default_send_coin_fee'] = this.state.prevFees;
        this.setState({ fields });
    }

    render() {
        const { allFeesData, errMsg, errType, loader, feesDetails, showEditFeesModal, fields } = this.state;

        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {FeesInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                {loader && <FaldaxLoader />}
                                {showEditFeesModal && <EditFeesModal
                                    fields={feesDetails}
                                    getAllFees={this._getAllFeesData}
                                    showEditFeesModal={showEditFeesModal}
                                    closeEditFeesModal={this._closeEditFeesModal}
                                />
                                }
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allFeesData}
                                    className="isoCustomizedTable"
                                />
                            </TabPane>
                        ))}
                        <TabPane tab="Withdrawal Fee" key="2">
                            <div style={{ "marginTop": "10px", "marginLeft": "200px" }}>
                                <span>
                                    <b>Withdrawal Fee</b>
                                </span>
                                <Input addonAfter={'%'} placeholder="Withdrawal Fee" style={{ "marginTop": "15px", "marginBottom": "15px", "width": "60%", "display": "inherit" }}
                                    onChange={this._onChangeFields.bind(this, "default_send_coin_fee")} value={fields["default_send_coin_fee"]} />
                                <span className="field-error">
                                    {this.validator.message('withdrawal fee', fields['default_send_coin_fee'], 'required|custom_between:0,100')}
                                </span>
                                <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._updateSendFee}> Update </Button>
                                <Button type="primary" className="cancel-btn" onClick={this._cancelSendFee}> Cancel </Button>
                            </div>
                            {loader && <FaldaxLoader />}
                        </TabPane>
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
    }), { logout })(Fees);

export { Fees }
