import React, { Component } from 'react';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

class PersonalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeDetails: []
        }
    }

    componentDidMount = () => {
        const { token, emp_id } = this.props;
        let _this = this;

        ApiUtils.getEmployeeDetails(token, emp_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ employeeDetails: res.data[0] });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        const { employeeDetails } = this.state;

        return (
            <div className="parent-div">
                <Row>
                    <Col span={24}>
                        <div className="right-div">
                            <span> <b>Name:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {employeeDetails.first_name ? employeeDetails.last_name ? employeeDetails.first_name + ' ' + employeeDetails.last_name : employeeDetails.first_name : ''}
                            </p>

                            <span> <b>Email:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {employeeDetails.email ? employeeDetails.email : ''}
                            </p>

                            <span><b>Address: </b></span>
                            <p style={{ "marginBottom": "10px" }}>
                                {employeeDetails.address ? employeeDetails.address : ''}
                            </p>

                            <span><b>Phone Number: </b></span>
                            <p style={{ "marginBottom": "10px" }}>
                                {employeeDetails.phone_number ? employeeDetails.phone_number : ''}
                            </p>

                            {/* <span> <b>Date Of Birth:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {employeeDetails.dob ? employeeDetails.dob : 'NA'}
                            </p> */}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(
    state => ({
        token: state.Auth.get('token')
    }))(PersonalDetails);

