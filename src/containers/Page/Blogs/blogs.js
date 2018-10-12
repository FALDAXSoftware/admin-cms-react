import React, { Component } from 'react';
import { Button, Tabs, notification, Icon, Spin, Modal } from 'antd';
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
const loaderIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
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
            allAdmins: []
        }
        self = this;
        Blogs.viewBlog = Blogs.viewBlog.bind(this);
        Blogs.editBlog = Blogs.editBlog.bind(this);
        Blogs.deleteBlog = Blogs.deleteBlog.bind(this);
    }

    static editBlog(value, title, admin_id, tags, created_at, description) {
        let blogDetails = {
            value, title, admin_id, tags, created_at, description
        }
        let tagsArray = tags.split(",");
        self.setState({ showEditBlogModal: true, blogDetails, tags: tagsArray });
    }

    static viewBlog(value, title, admin_id, tags, created_at, description) {
        let blogDetails = {
            value, title, admin_id, tags, created_at, description
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
        let _this = this;

        ApiUtils.getAllBlogs(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allBlogs: res.data, allAdmins: res.allAdmins });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
            })
            .catch(() => {
                _this.setState({ errType: 'error', errMsg: true, errMessage: 'Something went wrong' });
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
                        deleteBlogId: '', errType: 'success', errMsg: true, errMessage: res.message
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

    render() {
        const { allBlogs, errType, errMsg, loader, showAddBlogModal, blogDetails, allAdmins,
            showEditBlogModal, showDeleteBlogModal, showViewBlogModal, tags } = this.state;

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
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allBlogs}
                                        className="isoCustomizedTable"
                                    />
                                    <EditBlogModal
                                        allAdmins={allAdmins}
                                        fields={blogDetails}
                                        showEditBlogModal={showEditBlogModal}
                                        closeEditBlogModal={this._closeEditBlogModal}
                                        getAllBlogs={this._getAllBlogs.bind(this)}
                                        tags={tags}
                                    />
                                    <ViewBlogModal
                                        fields={blogDetails}
                                        showViewBlogModal={showViewBlogModal}
                                        closeViewBlogModal={this._closeViewBlogModal}
                                    />
                                    {showDeleteBlogModal &&
                                        <Modal
                                            title="Delete Blog"
                                            visible={showDeleteBlogModal}
                                            onCancel={this._closeDeleteBlogModal}
                                            onOk={this._deleteBlog}
                                        >
                                            Are you sure you want to delete this blog ?
                                    </Modal>
                                    }
                                    {loader && <Spin indicator={loaderIcon} />}
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

