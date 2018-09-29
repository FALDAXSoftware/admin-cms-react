import React, { Component } from 'react';
import { Tabs, Button, Modal, notification } from 'antd';
import { emailTemplatesInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddTemplateModal from './addEmailTempModal';
import EditTemplateModal from './editTemplateModal';
import ViewEmailTempModal from './viewEmailTempModal';

const TabPane = Tabs.TabPane;

class EmailTemplates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allTemplates: [],
            showAddTempModal: false,
            showEditTempModal: false,
            showDeleteTempModal: false,
            showViewTempModal: false,
            templateDetails: [],
            deleteEmailId: '',
            notifyMsg: '',
            errType: 'success'
        }
        EmailTemplates.view = EmailTemplates.view.bind(this);
        EmailTemplates.edit = EmailTemplates.edit.bind(this);
        EmailTemplates.delete = EmailTemplates.delete.bind(this);
        EmailTemplates.announce = EmailTemplates.announce.bind(this);
    }

    static view(value, name, title, content, is_active) {
        let templateDetails = {
            value, name, title, content, is_active
        }
        this.setState({ templateDetails, showViewTempModal: true })
    }

    static edit(value, name, title, content, is_active) {
        let templateDetails = {
            value, name, title, content, is_active
        }
        this.setState({ templateDetails, showEditTempModal: true })
    }

    static delete(value) {
        this.setState({ showDeleteTempModal: true, deleteEmailId: value })
    }

    static announce(value) {
        const { token } = this.props;
        let _this = this;

        let formData = {
            id: value
        }

        ApiUtils.announceUser(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ notifyMsg: res.message, notify: true });
                } else {
                    _this.setState({ notify: true, notifyMsg: 'Something went wrong!' });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    componentDidMount = () => {
        this._getEmailTemplates();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _getEmailTemplates = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getEmailTemplates(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allTemplates: res.data });
                } else {
                    _this.setState({ notify: true, notifyMsg: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _deleteTemplate = () => {
        const { token } = this.props;
        const { deleteEmailId } = this.state;
        let _this = this;

        ApiUtils.deleteTemplate(token, deleteEmailId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        showDeleteTempModal: false, deleteEmailId: '',
                        notifyMsg: 'Template removed successfully', notify: true
                    });
                    _this._getEmailTemplates(0);
                } else {
                    _this.setState({ notifyMsg: 'Something went wrong!', notify: true });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _showAddTemplateModal = () => {
        this.setState({ showAddTempModal: true });
    }

    _closeAddTempModal = () => {
        this.setState({ showAddTempModal: false });
    }

    _closeEditTempModal = () => {
        this.setState({ showEditTempModal: false });
    }

    _closeDeleteTempModal = () => {
        this.setState({ showDeleteTempModal: false });
    }

    _closeViewTempModal = () => {
        this.setState({ showViewTempModal: false });
    }

    render() {
        const { allTemplates, showAddTempModal, templateDetails, showViewTempModal,
            showEditTempModal, showDeleteTempModal, notify, errType
        } = this.state;

        if (notify) {
            this.openNotificationWithIconError(errType);
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {emailTemplatesInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddTemplateModal}>Add Template</Button>
                                    <AddTemplateModal
                                        showAddTempModal={showAddTempModal}
                                        closeAddModal={this._closeAddTempModal}
                                        getEmailTemplates={this._getEmailTemplates.bind(this, 0)}
                                    />
                                </div>
                                <ViewEmailTempModal
                                    templateDetails={templateDetails}
                                    showViewTempModal={showViewTempModal}
                                    closeViewModal={this._closeViewTempModal}
                                />
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allTemplates}
                                    className="isoCustomizedTable"
                                />
                                <EditTemplateModal
                                    templateDetails={templateDetails}
                                    showEditTempModal={showEditTempModal}
                                    closeEditModal={this._closeEditTempModal}
                                    getEmailTemplates={this._getEmailTemplates.bind(this, 0)}
                                />
                                {
                                    showDeleteTempModal &&
                                    <Modal
                                        title="Delete Template"
                                        visible={showDeleteTempModal}
                                        onCancel={this._closeDeleteTempModal}
                                        onOk={this._deleteTemplate}
                                    >
                                        Are you sure you want to delete this template ?
                                    </Modal>
                                }
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
        user: state.Auth.get('user'),
        token: state.Auth.get('token')
    }))(EmailTemplates);

export { EmailTemplates }
