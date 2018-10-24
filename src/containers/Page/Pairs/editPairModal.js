import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, notification } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class EditPairModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditPairModal: this.props.showEditPairModal,
            loader: false,
            fields: this.props.fields,
            errMessage: '',
            errMsg: false,
            errType: 'Success',
        }
        this.validator = new SimpleReactValidator();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps !== this.props) {
            this.setState({
                showEditPairModal: nextProps.showEditPairModal,
                fields: nextProps.fields
            })
        }
    }

    _closeEditPairModal = () => {
        this.setState({ showEditPairModal: false })
        this.props.closeEditModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetEditForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        fields['maker_fee'] = '';
        fields['taker_fee'] = '';
        this.setState({ fields });
    }

    _editPair = () => {
        const { token, getAllPairs } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                id: fields["value"],
                name: fields["name"],
                coin_id1: fields["coin_id1"],
                coin_id2: fields["coin_id2"],
                maker_fee: fields['maker_fee'],
                taker_fee: fields['taker_fee']
            };

            ApiUtils.updatePair(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this._closeEditPairModal();
                    getAllPairs();
                    this._resetEditForm();
                    this.setState({ errType: 'success', errMsg: true, errMessage: res.message })
                })
                .catch(() => {
                    this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
                    this._resetEditForm();
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { loader, showEditPairModal, fields, errType, errMsg, } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <Modal
                title="Edit Pair"
                visible={showEditPairModal}
                onOk={this._editPair}
                onCancel={this._closeEditPairModal}
                confirmLoading={loader}
                okText="Update"
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Pair Name:</span>
                    <Input placeholder="Pair Name" value={fields["name"]} disabled />
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Maker Fee:</span>
                    <Input addonAfter={'%'} placeholder="Maker Fee" onChange={this._handleChange.bind(this, "maker_fee")} value={fields["maker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('maker fee', fields["maker_fee"], 'required|decimal', 'text-danger')}
                    </span>
                </div>

                <div style={{ "marginBottom": "15px" }}>
                    <span>Taker Fee:</span>
                    <Input addonAfter={'%'} placeholder="Maker Fee" onChange={this._handleChange.bind(this, "taker_fee")} value={fields["taker_fee"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('taker fee', fields["taker_fee"], 'required|decimal', 'text-danger')}
                    </span>
                </div>

                {loader && <Spin indicator={loaderIcon} />}
            </Modal>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(EditPairModal);
