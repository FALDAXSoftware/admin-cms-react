import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Select } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
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
            selectedLegality: ''
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditCountryModal: nextProps.showEditCountryModal,
                fields: nextProps.fields,
                selectedLegality: nextProps.fields['legality']
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
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetForm = () => {
        const { fields } = this.state;

        fields['color'] = '';
        this.setState({ fields });
    }

    _closeEditCountryModal = () => {
        this.setState({ showEditCountryModal: false })
        this.props.closeEditCountryModal();
    }

    _editCountry = () => {
        const { token, getAllCountry } = this.props;
        const { fields, selectedLegality } = this.state;


        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields['value'],
                name: fields['name'],
                is_active: fields['is_active'],
                legality: selectedLegality,
                color: fields["color"],
            };

            ApiUtils.editCountry(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                    });
                    this._closeEditCountryModal();
                    getAllCountry();
                    this._resetForm();
                })
                .catch(() => {
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _changeLegality = (legal) => {
        let fields = this.state.fields;
        const colorCodes = [
            { key: '1', colorCode: '#62d0c5' },
            { key: '2', colorCode: '#f6776e' },
            { key: '3', colorCode: '#b6cbfa' },
            { key: '4', colorCode: '#b6cbfa' }
        ]

        let temp = colorCodes.filter(function (val) {
            return legal == val.key
        })

        fields['color'] = temp[0].colorCode;
        this.setState({ fields, selectedLegality: legal })
    }

    render() {
        const { loader, showEditCountryModal, fields, errMsg, errType, selectedLegality } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        const legailityValues = [
            { key: 1, value: 'Legal' },
            { key: 2, value: 'Illegal' },
            { key: 3, value: 'Neutral' }
        ];

        return (
            <div>
                <Modal
                    title="Edit Country"
                    visible={showEditCountryModal}
                    onOk={this._editCountry}
                    onCancel={this._closeEditCountryModal}
                    confirmLoading={loader}
                    okText="Edit"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Country Legality:</span>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select Legality"
                            onChange={this._changeLegality}
                            defaultValue={fields['legality']}
                        >
                            {legailityValues.map((country) => {
                                return (
                                    <Option value={country.key}>{country.value}</Option>
                                )
                            }
                            )}
                        </Select>
                    </div>

                    <div style={{ "marginBottom": "15px" }}>
                        <span>Color Code:</span>
                        <Input placeholder="Color Code" onChange={this._handleChange.bind(this, "color")} value={fields["color"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('color', fields["color"], 'required', 'text-danger')}
                        </span>
                    </div>

                    {loader && <Spin indicator={loaderIcon} />}
                </Modal>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditCountryModal);
