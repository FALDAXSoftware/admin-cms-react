import React, { Component } from 'react';
import { Tabs, Button, Modal, notification } from 'antd';
import { AnnounceInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddAnnounceModal from './addAnnounceModal';
import EditAnnounceModal from './editAnnounceModal';
import ViewAnnounceEmail from './viewAnnounceModal';

const TabPane = Tabs.TabPane;
var self;

class Announce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAnnounces: [],
            showAddEmailModal: false,
            showEditAnnounceModal: false,
            showDeleteAnnounceModal: false,
            showViewAnnounceModal: false,
            emailDetails: [],
            deleteEmailId: '',
            notifyMsg: '',
            errType: 'success'
        }
        self = this;
        Announce.view = Announce.view.bind(this);
        Announce.edit = Announce.edit.bind(this);
        Announce.delete = Announce.delete.bind(this);
        Announce.announce = Announce.announce.bind(this);
    }

    static view(value, name, title, content, is_active) {
        let emailDetails = {
            value, name, title, content, is_active
        }
        self.setState({ emailDetails, showViewAnnounceModal: true })
    }

    static edit(value, name, title, content, is_active) {
        let emailDetails = {
            value, name, title, content, is_active
        }
        self.setState({ emailDetails, showEditAnnounceModal: true })
    }

    static delete(value) {
        self.setState({ showDeleteAnnounceModal: true, deleteEmailId: value })
    }

    static announce(value) {
        const { token } = this.props;
        this.setState({ loader: true })

        let formData = {
            id: value
        }

        ApiUtils.announceUser(token, formData)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    self.setState({ notifyMsg: res.message, notify: true, loader: false });
                } else {
                    self.setState({ notify: true, notifyMsg: 'Something went wrong!', loader: false });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    componentDidMount = () => {
        this._getAnnounceEmails();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _getAnnounceEmails = () => {
        const { token } = this.props;
        let _this = this;

        ApiUtils.getEmailTemplates(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allAnnounces: res.data });
                } else {
                    _this.setState({ notify: true, notifyMsg: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _deleteAnnounce = () => {
        const { token } = this.props;
        const { deleteEmailId } = this.state;
        let _this = this;

        ApiUtils.deleteTemplate(token, deleteEmailId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        showDeleteAnnounceModal: false, deleteEmailId: '',
                        notifyMsg: res.message, notify: true
                    });
                    _this._getAnnounceEmails(0);
                } else {
                    _this.setState({ notifyMsg: 'Something went wrong!', notify: true });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    _showAddAnnounceModal = () => {
        this.setState({ showAddEmailModal: true });
    }

    _closeAddAnnounceModal = () => {
        this.setState({ showAddEmailModal: false });
    }

    _closeEditAnnounceModal = () => {
        this.setState({ showEditAnnounceModal: false });
    }

    _closeDeleteAnnounceModal = () => {
        this.setState({ showDeleteAnnounceModal: false });
    }

    _closeViewAnnounceModal = () => {
        this.setState({ showViewAnnounceModal: false });
    }

    render() {
        const { allAnnounces, showAddEmailModal, emailDetails, showViewAnnounceModal,
            showEditAnnounceModal, showDeleteAnnounceModal, notify, errType
        } = this.state;

        if (notify) {
            this.openNotificationWithIconError(errType);
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {AnnounceInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddAnnounceModal}>Add Announcement</Button>
                                    <AddAnnounceModal
                                        showAddEmailModal={showAddEmailModal}
                                        closeAddModal={this._closeAddAnnounceModal}
                                        getAnnouncements={this._getAnnounceEmails.bind(this, 0)}
                                    />
                                </div>
                                <ViewAnnounceEmail
                                    emailDetails={emailDetails}
                                    showViewAnnounceModal={showViewAnnounceModal}
                                    closeViewModal={this._closeViewAnnounceModal}
                                />
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allAnnounces}
                                    className="isoCustomizedTable"
                                />
                                <EditAnnounceModal
                                    emailDetails={emailDetails}
                                    showEditAnnounceModal={showEditAnnounceModal}
                                    closeEditModal={this._closeEditAnnounceModal}
                                    getAnnouncements={this._getAnnounceEmails.bind(this, 0)}
                                />
                                {
                                    showDeleteAnnounceModal &&
                                    <Modal
                                        title="Delete Announcement"
                                        visible={showDeleteAnnounceModal}
                                        footer={[
                                            <Button onClick={this._closeDeleteAnnounceModal}>No</Button>,
                                            <Button onClick={this._deleteAnnounce}>Yes</Button>,
                                        ]}
                                    >
                                        Are you sure you want to delete this announcement ?
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
    }))(Announce);

export { Announce }
