import React, { Component } from 'react';
import { Button, Tabs, notification } from 'antd';
import { accountClassTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddAccountClassModal from './addAccountClassModal';
import FaldaxLoader from '../faldaxLoader';
import authAction from '../../../redux/auth/actions';

const { logout } = authAction;
const TabPane = Tabs.TabPane;

class AccountClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allAccountClasses: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddClassModal: false,
        }
        self = this;
    }

    componentDidMount = () => {
        this._getAllAccountClasses();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllAccountClasses = () => {
        const { token } = this.props;
        const { searchEmp, sorterCol, sortOrder } = this.state;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllEmployee(token, sorterCol, sortOrder, searchEmp)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status == 200) {
                    _this.setState({ allAccountClasses: res.data.employees });
                } else if (res.status == 403) {
                    _this.setState({ errMsg: true, errMessage: res.err, errType: 'error' }, () => {
                        _this.props.logout();
                    });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _showAddAccClassModal = () => {
        this.setState({ showAddClassModal: true });
    }

    _closeAddClassModal = () => {
        this.setState({ showAddClassModal: false });
    }

    _changeRow = (emp) => {
        this.props.history.push('/dashboard/employee/' + emp.id)
    }

    render() {
        const { allAccountClasses, errType, errMsg, loader, showAddClassModal } = this.state;

        if (errMsg) {
            this.openNotificationWithIconError(errType.toLowerCase());
        }

        return (
            <LayoutWrapper>
                <TableDemoStyle className="isoLayoutContent">
                    <Tabs className="isoTableDisplayTab">
                        {employeeTableinfos.map(tableInfo => (
                            <TabPane tab={tableInfo.title} key={tableInfo.value}>
                                <div style={{ "display": "inline-block", "width": "100%" }}>
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddAccClassModal}>Add</Button>
                                    <AddAccountClassModal
                                        showAddClassModal={showAddClassModal}
                                        closeAddModal={this._closeAddClassModal}
                                        getAllAccountClass={this._getAllAccountClasses.bind(this, 0)}
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <TableWrapper
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allAccountClasses}
                                        className="isoCustomizedTable"
                                        onChange={this._handleEmployeeChange}
                                    />
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
    }), { logout })(Employees);

export { AccountClass, accountClassTableinfos };
