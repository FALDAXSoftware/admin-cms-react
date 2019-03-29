import React, { Component } from 'react';
import { Button, Tabs, notification, Modal } from 'antd';
import { employeeTableinfos } from "../../Tables/antTables";
import ApiUtils from '../../../helpers/apiUtills';
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from '../../Tables/antTables/demo.style';
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from 'react-redux';
import AddEmployeeModal from './addEmployeeModal';
import EditEmployeeModal from './editEmployeeModal';
import FaldaxLoader from '../faldaxLoader';

const TabPane = Tabs.TabPane;
var self;

class Employees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allEmployee: [],
            errMessage: '',
            errMsg: false,
            errType: 'Success',
            loader: false,
            showAddEmpModal: false,
            showEditEmpModal: false,
            showDeleteEmpModal: false,
            empDetails: [],
            deleteEmpId: ''
        }
        self = this;
        Employees.employeeStatus = Employees.employeeStatus.bind(this);
        Employees.editEmployee = Employees.editEmployee.bind(this);
        Employees.deleteEmployee = Employees.deleteEmployee.bind(this);
    }

    static employeeStatus(value, first_name, last_name, email, phone_number, address, role, is_active) {
        const { token } = self.props;

        let message = is_active ? 'Employee has been inactivated successfully.' : 'Employee has been activated successfully.'
        let formData = {
            id: value,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            roles: role,
            is_active: !is_active
        };

        self.setState({ loader: true })
        ApiUtils.editEmployee(token, formData)
            .then((res) => res.json())
            .then((res) => {
                this.setState({ errMsg: true, errMessage: message, loader: false, errType: 'Success' });
                this._getAllEmployees();
            })
            .catch(error => {
                this.setState({ errMsg: true, errMessage: 'Something went wrong!!', loader: false, errType: 'error' });
            });
    }

    static editEmployee(value, first_name, last_name, email, phone_number, address, role, is_active) {
        let empDetails = {
            value, first_name, last_name, email, phone_number, address, role, is_active
        }
        self.setState({ showEditEmpModal: true, empDetails });
    }

    static deleteEmployee(value) {
        self.setState({ showDeleteEmpModal: true, deleteEmpId: value });
    }

    componentDidMount = () => {
        this._getAllEmployees();
    }

    openNotificationWithIconError = (type) => {
        notification[type]({
            message: this.state.errType,
            description: this.state.errMessage
        });
        this.setState({ errMsg: false });
    };

    _getAllEmployees = () => {
        const { token } = this.props;
        let _this = this;

        _this.setState({ loader: true });
        ApiUtils.getAllEmployee(token)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({ allEmployee: res.data });
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message });
                }
                _this.setState({ loader: false });
            })
            .catch(err => {
                _this.setState({
                    errType: 'error', errMsg: true, errMessage: 'Something went wrong',
                    loader: false
                });
            });
    }

    _deleteEmployee = () => {
        const { token } = this.props;
        const { deleteEmpId } = this.state;
        let _this = this;

        _this.setState({ loader: true })
        ApiUtils.deleteEmployee(token, deleteEmpId)
            .then((response) => response.json())
            .then(function (res) {
                if (res) {
                    _this.setState({
                        deleteEmpId: '', errMsg: true, errMessage: res.message, errType: 'Success'
                    });
                    _this._closeDeleteEmpModal();
                    _this._getAllEmployees();
                } else {
                    _this.setState({ errMsg: true, errMessage: res.message, errType: 'error' });
                }
                _this.setState({ loader: false })
            })
            .catch(() => {
                _this.setState({
                    errType: 'error', errMsg: true,
                    errMessage: 'Something went wrong', loader: false
                });
            });
    }

    _showAddEmpModal = () => {
        this.setState({ showAddEmpModal: true });
    }

    _closeAddEmpModal = () => {
        this.setState({ showAddEmpModal: false });
    }

    _closeEditEmpModal = () => {
        this.setState({ showEditEmpModal: false });
    }

    _closeDeleteEmpModal = () => {
        this.setState({ showDeleteEmpModal: false });
    }

    _changeRow = (emp) => {
        this.props.history.push('/dashboard/employee/' + emp.id)
    }

    render() {
        const { allEmployee, errType, errMsg, loader, showAddEmpModal,
            showEditEmpModal, empDetails, showDeleteEmpModal } = this.state;

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
                                    <Button type="primary" style={{ "marginBottom": "15px", "float": "left" }} onClick={this._showAddEmpModal}>Add Employee</Button>
                                    <AddEmployeeModal
                                        showAddEmpModal={showAddEmpModal}
                                        closeAddModal={this._closeAddEmpModal}
                                        getAllEmployee={this._getAllEmployees.bind(this, 0)}
                                    />
                                </div>
                                {loader && <FaldaxLoader />}
                                <div>
                                    <TableWrapper
                                        // onRow={(record, rowIndex) => {
                                        //     return {
                                        //         onClick: (event) => { this._changeRow(record) },
                                        //     };
                                        // }}
                                        {...this.state}
                                        columns={tableInfo.columns}
                                        pagination={false}
                                        dataSource={allEmployee}
                                        className="isoCustomizedTable"
                                    />
                                    <EditEmployeeModal
                                        fields={empDetails}
                                        showEditEmpModal={showEditEmpModal}
                                        closeEditEmpModal={this._closeEditEmpModal}
                                        getAllEmployee={this._getAllEmployees.bind(this)}
                                    />
                                    {showDeleteEmpModal &&
                                        <Modal
                                            title="Delete Employee"
                                            onCancel={this._closeDeleteEmpModal}
                                            visible={showDeleteEmpModal}
                                            footer={[
                                                <Button onClick={this._closeDeleteEmpModal}>No</Button>,
                                                <Button onClick={this._deleteEmployee}>Yes</Button>,
                                            ]}
                                        >
                                            Are you sure you want to delete this employee ?
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
    }))(Employees);

export { Employees, employeeTableinfos };

