import React, { Component } from 'react';
import { Tabs, notification, Input, Button, Icon } from 'antd';
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import { connect } from 'react-redux';
import FaldaxLoader from '../faldaxLoader';
import SimpleReactValidator from 'simple-react-validator';
import authAction from '../../../redux/auth/actions';

const TabPane = Tabs.TabPane;
const { logout } = authAction;
const TextArea = Input.TextArea;

class SimplexToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: '',
            errMsg: false,
            errType: '',
            loader: false,
            fields: {},
            prevToken: '',
            enableInput: true
        }
        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this._getSimplexAccessToken();
    }

    _getSimplexAccessToken = () => {
        let _this = this;
        const { token } = this.props;

        _this.setState({ loader: true });
        ApiUtils.getSimplexToken(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    if (res.status == 200) {
                        let fields = _this.state.fields;
                        fields['access_token'] = res.data;
                        _this.setState({ fields, prevToken: res.data });
                    } else if (res.status == 403) {
                        _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            _this.props.logout();
                        });
                    } else {
                        _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                    }
                    _this.setState({ loader: false });
                }
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

    _updateAccessToken = () => {
        const { token } = this.props;
        let fields = this.state.fields;
        let _this = this;

        if (_this.validator.allValid()) {
            _this.setState({ loader: true });

            const formData = {
                access_token: fields['access_token'],
            }

            ApiUtils.updateSimplexToken(token, formData)
                .then((response) => response.json())
                .then(function (res) {
                    if (res.status == 200) {
                        _this.setState({
                            errMsg: true, errMessage: res.message, loader: false, errType: 'Success', enableInput: true
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

    _cancelAccessToken = () => {
        let fields = this.state.fields;
        fields['access_token'] = this.state.prevToken;
        this.setState({ fields, enableInput: true });
    }

    _showInputEditable = () => {
        this.setState((prevState) => {
            return {
                enableInput: !prevState.enableInput
            }
        })
    }

    render() {
        const { errMsg, errType, loader, fields, enableInput } = this.state;

        if (errMsg) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        <TabPane tab="Simplex Access Token" key="1">
                            <div style={{ "marginTop": "10px" }}>
                                <span>
                                    <b>Simplex Access Token</b>
                                </span>
                                <TextArea disabled={enableInput} placeholder="Simplex Access Token" style={{ width: "80%", "marginTop": "15px", "marginBottom": "15px" }}
                                    onChange={this._onChangeFields.bind(this, "access_token")} value={fields["access_token"]} />
                                <Icon type="edit" theme="twoTone" onClick={this._showInputEditable} />
                                <span className="field-error">
                                    {this.validator.message('Simplex Access Token', fields['access_token'], 'required')}
                                </span>
                                <Button type="primary" style={{ "marginBottom": "15px" }} onClick={this._updateAccessToken}> Update </Button>
                                <Button type="primary" className="cancel-btn" onClick={this._cancelAccessToken}> Cancel </Button>
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
        token: state.Auth.get('token')
    }), { logout })(SimplexToken);

export { SimplexToken }
