import React, { Component } from 'react';
import { connect } from 'react-redux';
import ApiUtils from '../../../helpers/apiUtills';
import { Modal, Input, Icon, Spin, Checkbox } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const CheckboxGroup = Checkbox.Group;

class AddRoleModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAddRoleModal: this.props.showAddRoleModal,
            loader: false,
            fields: {}
        }
        this.validator = new SimpleReactValidator();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.showAddRoleModal !== this.props.showAddRoleModal) {
            this.setState({ showAddRoleModal: nextProps.showAddRoleModal })
        }
    }

    _closeAddRoleModal = () => {
        this.setState({ showAddRoleModal: false })
        this.props.closeAddModal();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _resetAddForm = () => {
        const { fields } = this.state;

        fields['name'] = '';
        this.setState({ fields });
    }

    _addRole = () => {
        const { token, getAllRoles } = this.props;
        let { fields } = this.state;

        if (this.validator.allValid()) {
            let formData = {
                name: fields["name"],
            };

            ApiUtils.addCoin(token, formData)
                .then((res) => res.json())
                .then(() => {
                    this._closeAddRoleModal();
                    getAllRoles();
                    this._resetAddForm();
                })
                .catch(error => {
                    console.error(error);
                    this._resetAddForm();
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
        const { loader, showAddRoleModal, fields } = this.state;
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
            <Modal
                title="Add Role"
                visible={showAddRoleModal}
                onOk={this._addRole}
                onCancel={this._closeAddRoleModal}
                confirmLoading={loader}
                okText="Add"
            >
                <div style={{ "marginBottom": "15px" }}>
                    <span>Name:</span>
                    <Input placeholder="Name" onChange={this._handleChange.bind(this, "name")} value={fields["name"]} />
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
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(AddRoleModal);
