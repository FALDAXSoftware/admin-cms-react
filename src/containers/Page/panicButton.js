import React, { Component } from 'react';
import { notification, Button, Modal, Switch, Input } from 'antd';
import ApiUtils from '../../helpers/apiUtills';
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import { connect } from 'react-redux';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../redux/auth/actions';

const { logout } = authAction;

class PanicButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            notifyMsg: '',
            notify: false,
            errType: '',
            loader: false,
            isPanic: false,
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getPanicBtnDetails()
    }

    _getPanicBtnDetails = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getPanicBtnDetails(token)
            .then((response) => response.json())
            .then(function (res) {
                console.log(res.status.value, (res.status.value == 'true'))
                if (res.status == 200) {
                    _this.setState({ isPanic: (res.status.value == 'true') ? true : false });
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

    _panicButton = () => {
        const { token, user } = this.props;
        const { fields } = this.state;
        let _this = this;

        const formData = {
            otp: fields["otp"],
            is_panic: true
        }

        _this.setState({ isPanic: true });
        ApiUtils.panicBtn(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                console.log('res', res)
                _this.setState({
                    notify: true, errType: 'Success', isPanic: false,
                    message: res.message
                });
                _this._closeConfirmModal();
            })
            .catch(() => {
                _this.setState({
                    notify: true, message: 'Something went wrong!!',
                    errType: 'error', isPanic: false
                });
                _this._closeConfirmModal();
            });
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.message
        });
        this.setState({ notify: false });
    };

    _closeConfirmModal = () => {
        this.setState({ panicConfirmModal: false })
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

    _showConfirmPanicModal = () => {
        this.setState({ panicConfirmModal: true })
    }

    render() {
        const { notify, errType, isPanic, panicConfirmModal, fields } = this.state;

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }
        console.log(isPanic)

        return (
            <LayoutWrapper>
                <div className="isoLayoutContent">
                    <span>Panic Button: </span>
                    <Switch checked={isPanic} checkedChildren="ON" unCheckedChildren="OFF" size="large" onChange={this._showConfirmPanicModal} />
                    {/* <Button type="primary" onClick={this._showConfirmPanicModal} disabled={isPanic}>Panic Button</Button> */}
                    <Modal
                        title="Confirm Panic"
                        onCancel={this._closeConfirmModal}
                        visible={panicConfirmModal}
                        footer={null}
                    >
                        {this.props.user.is_twofactor ?
                            <div>
                                <span>Enter your two-factor code here:</span>
                                <div style={{ marginTop: "20px" }}>
                                    <Input style={{ width: "200px" }} value={fields["otp"]}
                                        onChange={this._onChangeFields.bind(this, "otp")} />
                                </div>
                                <span className="field-error">
                                    {this.validator.message('OTP', fields['otp'], 'required|numeric')}
                                </span>
                                <Button type="primary" style={{ marginTop: "20px", marginBottom: "20px" }}
                                    onClick={this._panicButton}>Enable</Button>
                            </div>
                            : <div>
                                <span>Enable two factor authentication to Enable Panic Button.</span><br />
                                <Button type="primary" onClick={() => { this.props.history.push('/dashboard/edit-profile') }}>Enable Now</Button>
                            </div>}
                    </Modal>
                </div>
            </LayoutWrapper>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }), { logout })(PanicButton);

export { PanicButton }
