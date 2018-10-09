import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Select } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const Option = Select.Option;

class EditStateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditStateModal: this.props.showEditStateModal,
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
                showEditStateModal: nextProps.showEditStateModal,
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

    _closeEditStateModal = () => {
        this.setState({ showEditStateModal: false })
        this.props.closeEditStateModal();
    }

    _editState = () => {
        const { token, getAllStates } = this.props;
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

            ApiUtils.editState(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        errMsg: true, errMessage: res.message, loader: false, errType: 'Success'
                    });
                    this._closeEditStateModal();
                    getAllStates();
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
        const { loader, showEditStateModal, fields, errMsg, errType } = this.state;
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
                    title="Edit State"
                    visible={showEditStateModal}
                    onOk={this._editState}
                    onCancel={this._closeEditStateModal}
                    confirmLoading={loader}
                    okText="Edit"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>State Legality:</span>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Select Legality"
                            onChange={this._changeLegality}
                            defaultValue={fields['legality']}
                        >
                            {legailityValues.map((state) => {
                                return (
                                    <Option value={state.key}>{state.value}</Option>
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
    }))(EditStateModal);
