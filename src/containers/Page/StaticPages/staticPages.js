import React, { Component } from 'react';
import { Tabs, Button, Modal, notification } from 'antd';
import { staticPagesInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddPageModal from './addPageModal';
import EditPageModal from './editPageModal';
import ViewPageModal from './viewPageModal';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;
var self;

class StaticPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allStaticPages: [],
            showAddPageModal: false,
            showEditPageModal: false,
            showDeletePageModal: false,
            showViewPageModal: false,
            staticPagesDetails: [],
            deletePageId: '',
            notifyMsg: '',
            notify: false,
            errType: '',
            loader: false
        }
        self = this;
        StaticPages.view = StaticPages.view.bind(this);
        StaticPages.edit = StaticPages.edit.bind(this);
        StaticPages.delete = StaticPages.delete.bind(this);
    }

    static view(value, name, title, content, is_active) {
        let staticPagesDetails = {
            value, name, title, content, is_active
        }
        self.setState({ staticPagesDetails, showViewPageModal: true })
    }

    static edit(value, name, title, content, is_active) {
        let staticPagesDetails = {
            value, name, title, content, is_active
        }
        self.setState({ staticPagesDetails, showEditPageModal: true })
    }

    static delete(value) {
        self.setState({ showDeletePageModal: true, deletePageId: value })
    }

    componentDidMount = () => {
        this._getAllStaticPages();
    }

    _getAllStaticPages = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getStaticPages(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allStaticPages: res.data });
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errMsg: true, errMessage: 'Something went wrong!!',
                    errType: 'error', loader: false
                });
            });
    }

    openNotificationWithIcon = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.notifyMsg
        });
        this.setState({ notify: false });
    };

    _deletePage = () => {
        const { token } = this.props;
        const { deletePageId } = this.state;
        let _this = this;

        this.setState({ loader: true })
        ApiUtils.deleteStaticPage(token, deletePageId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        showDeletePageModal: false, deletePageId: '', errType: 'Success',
                        notify: true, notifyMsg: res.message
                    });
                    _this._getAllStaticPages(0);
                } else {
                    _this.setState({ errMsg: true, message: res.message });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                this.setState({
                    loader: false, errType: 'error',
                    notify: true, notifyMsg: 'Something went wrong!!'
                })
            });
    }

    _showAddPageModal = () => {
        this.setState({ showAddPageModal: true });
    }

    _closeAddPageModal = () => {
        this.setState({ showAddPageModal: false });
    }

    _closeEditPageModal = () => {
        this.setState({ showEditPageModal: false });
    }

    _closeDeletePageModal = () => {
        this.setState({ showDeletePageModal: false });
    }

    _closeViewPageModal = () => {
        this.setState({ showViewPageModal: false });
    }

    render() {
        const { allStaticPages, showAddPageModal, staticPagesDetails, notify, errType,
            showEditPageModal, showDeletePageModal, showViewPageModal, loader } = this.state;

        if (notify) {
            this.openNotificationWithIcon(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {staticPagesInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddPageModal}>Add Page</Button>
                                    <AddPageModal
                                        showAddPageModal={showAddPageModal}
                                        closeAddModal={this._closeAddPageModal}
                                        getAllStaticPages={this._getAllStaticPages.bind(this, 0)}
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <ViewPageModal
                                    staticPagesDetails={staticPagesDetails}
                                    showViewPageModal={showViewPageModal}
                                    closeViewModal={this._closeViewPageModal}
                                />
                                <TableWrapper
                                    {...this.state}
                                    columns={tableInfo.columns}
                                    pagination={false}
                                    dataSource={allStaticPages}
                                    className="isoCustomizedTable"
                                />
                                <EditPageModal
                                    staticPagesDetails={staticPagesDetails}
                                    showEditPageModal={showEditPageModal}
                                    closeEditModal={this._closeEditPageModal}
                                    getAllStaticPages={this._getAllStaticPages.bind(this, 0)}
                                />
                                {
                                    showDeletePageModal &&
                                    <Modal
                                        title="Delete Page"
                                        visible={showDeletePageModal}
                                        onCancel={this._closeDeletePageModal}
                                        footer={[
                                            <Button onClick={this._closeDeletePageModal}>No</Button>,
                                            <Button onClick={this._deletePage}>Yes</Button>,
                                        ]}
                                    >
                                        Are you sure you want to delete this page ?
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
    }))(StaticPages);

export { StaticPages }
