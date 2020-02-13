import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, notification, Select, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const Option = Select.Option;

class EditCountryModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditCountryModal: this.props.showEditCountryModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success',
            selectedLegality: this.props.fields['legality'],
            isDisabled: false,
            code: this.props.fields['color'],
            color: { color: this.props.fields['color'] }
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditCountryModal: nextProps.showEditCountryModal,
                fields: nextProps.fields,
                selectedLegality: nextProps.fields['legality'],
                color: { color: nextProps.fields['color'] },
                code: nextProps.fields['color'],
            })
        }
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['color'] = '';
        this.setState({ fields, selectedLegality: '', color: [] });
    }

    _changeColor = (value) => {
        this.setState({ color: value, code: value.color })
    }

    _closeEditCountryModal = () => {
        this.setState({ showEditCountryModal: false })
        this.props.closeEditCountryModal();
        this._resetForm();
    }

    _editCountry = () => {
        const { token, getAllCountry } = this.props;
        const { fields, selectedLegality, color } = this.state;

        if (this.validator.allValid()) {
            this.setState({ loader: true, isDisabled: true });

            let formData = {
                id: fields['value'],
                name: fields['name'],
                is_active: fields['is_active'],
                legality: selectedLegality,
                color: color.color,
            };

            ApiUtils.editCountry(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    if (res.status == 200) {
                        this.setState({
                            errMsg: true, errMessage: res.message, loader: false,
                            errType: 'Success', isDisabled: false
                        });
                        this._closeEditCountryModal();
                        getAllCountry();
                        this._resetForm();
                    } else if (res.status == 403) {
                        this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                            this.props.logout();
                        });
                    } else {
                        this.setState({ errMsg: true, errMessage: res.message });
                    }
                })
                .catch(() => {
                    this.setState({
                        errMsg: true, errMessage: 'Unable to complete the requested action.',
                        loader: false, errType: 'error', isDisabled: false
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeLegality = (legal) => {
        let fields = this.state.fields;
        const colorCodes = [
            { key: '1', colorCode: '#00a9fa' },
            { key: '2', colorCode: '#f6776e' },
            { key: '3', colorCode: '#00a9fb' },
            { key: '4', colorCode: '#FCD26E' }
        ]

        let temp = colorCodes.filter(function (val) {
            return legal == val.key
        })

        fields['color'] = temp[0].colorCode;
        this.setState({
            fields, selectedLegality: legal,
            code: temp[0].colorCode, color: { color: temp[0].colorCode }
        })
    }

    render() {
        const { loader, showEditCountryModal, fields, errMsg, errType, isDisabled,
            selectedLegality, code, color
        } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        const legailityValues = [
            { key: 1, value: 'Legal' },
            { key: 2, value: 'Illegal' },
            { key: 3, value: 'Neutral' },
            { key: 4, value: 'Partial Services Available' }
        ];

        return (
            <div>
                <Modal
                    title="Edit Country"
                    visible={showEditCountryModal}
                    onCancel={this._closeEditCountryModal}
                    confirmLoading={loader}
                    footer={[
                        <Button onClick={this._closeEditCountryModal}>Cancel</Button>,
                        <Button disabled={isDisabled} onClick={this._editCountry}>Update</Button>,
                    ]}
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Country Legality:</span><br />
                        <Select
                            getPopupContainer={trigger => trigger.parentNode}
                            style={{ width: 200 }}
                            placeholder="Select Legality"
                            onChange={this._changeLegality}
                            defaultValue={selectedLegality}
                        >
                            {legailityValues.map((country) => {
                                return (
                                    <Option key={country.key} value={country.key}>{country.value}</Option>
                                )
                            }
                            )}
                        </Select>
                    </div>

                    <div style={{ "marginBottom": "15px", display: 'flex' }}>
                        <span>Color Code:</span>
                        <ColorPicker className="color-picker" style={{ marginLeft: '10px' }} defaultColor={code} color={code} onChange={this._changeColor} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('color', fields["color"], 'required|max:7', 'text-danger')}
                        </span>
                    </div>
                    <div style={{ background: color.color, width: 100, height: 50, color: 'white' }}>
                        {color.color}
                    </div>
                    {loader && <FaldaxLoader />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }), { logout })(EditCountryModal);
