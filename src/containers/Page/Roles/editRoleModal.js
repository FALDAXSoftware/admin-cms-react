import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, notification, Icon, Spin, Checkbox } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const CheckboxGroup = Checkbox.Group;

class EditRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditRoleModal: this.props.showEditRoleModal,
            loader: false,
            fields: this.props.fields,
            errMsg: false,
            errMessage: '',
            errType: 'Success'
        }
        this.validator = new SimpleReactValidator();
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps !== prevState) {
            return {
                showEditRoleModal: nextProps.showEditRoleModal,
                fields: nextProps.fields,
            }
        }
        return null;
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

        fields['name'] = '';
        this.setState({ fields });
    }

    _closeEditRoleModal = () => {
        this.setState({ showEditRoleModal: false })
        this.props.closeEditRoleModal();
    }

    _editCoin = () => {
        const { token, getAllRoles } = this.props;
        const { fields } = this.state;


        if (this.validator.allValid()) {
            this.setState({ loader: true });

            let formData = {
                id: fields["value"],
                name: fields["name"],
            };

            ApiUtils.editCoin(token, formData)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ errMsg: true, errMessage: res.message, loader: false, errType: 'Success' });
                    this._closeEditRoleModal();
                    getAllRoles();
                    this._resetForm();
                })
                .catch(error => {
                    console.error(error);
                    this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    _onChangeRole = (val) => {
        console.log('_onChangeRole', val);
        if (val == 'All') {
            console.log('>>>if', val);
        } else {
            console.log('>>>else', val);
        }
    }

    render() {
        const { loader, showEditRoleModal, fields, errMsg, errType } = this.state;
        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        const options = [
            { label: 'ALL', value: 'All' },
            { label: 'Coins Module', value: 'Coins' },
            { label: 'Users Modules', value: 'Users' },
            { label: 'Country Module', value: 'Country' },
            { label: 'Roles Module', value: 'Roles' },
            { label: 'Static Pages Module', value: 'Static Pages' },
            { label: 'Announcement Modules', value: 'Announcement' },
        ];

        return (
            <div>
                <Modal
                    title="Edit Role"
                    visible={showEditRoleModal}
                    onOk={this._editRole}
                    onCancel={this._closeEditRoleModal}
                    confirmLoading={loader}
                    okText="Edit"
                >
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Role Name:</span>
                        <Input placeholder="First Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('name', fields["name"], 'required', 'text-danger')}
                        </span>
                    </div>

                    <div>
                        <span>Roles:</span>
                        <CheckboxGroup options={options} onChange={this._onChangeRole} />
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
    }))(EditRoleModal);
