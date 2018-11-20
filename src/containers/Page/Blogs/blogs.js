import React, { Component } from 'react';
import { Button, Tabs, notification, Spin, Modal, Pagination } from 'antd';
import { blogsTableInfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddBlogModal from './addBlogModal';
import EditBlogModal from './editBlogModal';
import ViewBlogModal from './viewBlogModal';

const TabPane = Tabs.TabPane;
var self;

class Blogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allBlogs: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddBlogModal: false,
            showEditBlogModal: false,
            showDeleteBlogModal: false,
            showViewBlogModal: false,
            blogDetails: [],
            deleteBlogId: '',
            tags: [],
            allAdmins: [],
            page: 1,
            limit: 50,
            BlogCount: 0
        }
        self = this;
        Blogs.viewBlog = Blogs.viewBlog.bind(this);
        Blogs.editBlog = Blogs.editBlog.bind(this);
        Blogs.deleteBlog = Blogs.deleteBlog.bind(this);
    }

    static editBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image) {
        let blogDetails = {
            value, title, admin_name, tags, created_at, description, admin_id, cover_image
        }
        let tagsArray = tags.split(",");
        self.setState({ showEditBlogModal: true, blogDetails, tags: tagsArray });
    }

    static viewBlog(value, title, admin_name, tags, created_at, description, admin_id, cover_image) {
        let blogDetails = {
            value, title, admin_name, tags, created_at, description, admin_id, cover_image
        }
        self.setState({ showViewBlogModal: true, blogDetails });
    }

    static deleteBlog(value) {
        self.setState({ showDeleteBlogModal: true, deleteBlogId: value });
    }

    componentDidMount = () => {
        this._getAllBlogs();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllBlogs = () => {
        const { token } = this.props;
        const { page, limit } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllBlogs(page, limit, token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    const { data, allAdmins, BlogCount } = res;
                    _this.setState({ allBlogs: data, allAdmins, BlogCount });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _deleteBlog = () => {
        const { token } = this.props;
        const { deleteBlogId } = this.state;
        let _this = this;

        ApiUtils.deleteBlog(token, deleteBlogId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteBlogId: '', errType: 'Success', errMsg: true,
                        errMessage: res.message, page: 1
                    });
                    _this._closeDeleteBlogModal();
                    _this._getAllBlogs();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
            });
    }

    _showAddBlogModal = () => {
        this.setState({ showAddBlogModal: true });
    }

    _closeAddBlogModal = () => {
        this.setState({ showAddBlogModal: false });
    }

    _closeEditBlogModal = () => {
        this.setState({ showEditBlogModal: false });
    }

    _closeDeleteBlogModal = () => {
        this.setState({ showDeleteBlogModal: false });
    }

    _closeViewBlogModal = () => {
        this.setState({ showViewBlogModal: false });
    }

    _handleBlogPagination = (page) => {
        this.setState({ page }, () => {
            this._getAllBlogs();
        });
    }

    render() {
        const { allBlogs, errType, errMsg, loader, showAddBlogModal, blogDetails, allAdmins,
            showEditBlogModal, showDeleteBlogModal, showViewBlogModal, tags, page
            , BlogCount
        } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {blogsTableInfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddBlogModal}>Add Blog</Button>
                                    <AddBlogModal
                                        allAdmins={allAdmins}
                                        showAddBlogModal={showAddBlogModal}
                                        closeAddModal={this._closeAddBlogModal}
                                        getAllBlogs={this._getAllBlogs.bind(this, 0)}
                                    />
                                </div>
                                {loader && <span className="loader-class">
                                    <Spin />
                                </span>}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allBlogs}
                                        className="isoCustomizedTable"
                                    />
                                    {showEditBlogModal &&
                                        <EditBlogModal
                                            allAdmins={allAdmins}
                                            fields={blogDetails}
                                            showEditBlogModal={showEditBlogModal}
                                            closeEditBlogModal={this._closeEditBlogModal}
                                            getAllBlogs={this._getAllBlogs.bind(this)}
                                            tags={tags}
                                        />
                                    }
                                    <ViewBlogModal
                                        fields={blogDetails}
                                        showViewBlogModal={showViewBlogModal}
                                        closeViewBlogModal={this._closeViewBlogModal}
                                    />
                                    <Pagination
                                        style={{ marginTop: '15px' }}
                                        className="ant-users-pagination"
                                        onChange={this._handleBlogPagination.bind(this)}
                                        pageSize={50}
                                        current={page}
                                        total={BlogCount}
                                    />
                                    {showDeleteBlogModal &&
                                        <Modal
                                            title="Delete Blog"
                                            visible={showDeleteBlogModal}
                                            onCancel={this._closeDeleteBlogModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteBlogModal}>No</Button>,
                                                <Button onClick={this._deleteBlog}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this blog ?
                                    </Modal>
                                    }
                                </div>
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
        token: state.Auth.get('token')
    }))(Blogs);

export { Blogs, blogsTableInfos };

