import React, { Component } from 'react';
import { BUCKET_URL } from '../../../helpers/globals';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

class PersonalDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userDetails: []
        }
    }

    componentDidMount = () => {
        const { token, user_id } = this.props;
        let _this = this;

        ApiUtils.getUserDetails(token, user_id)
            .then((response) => response.json())
            .then(function (res) {
                _this.setState({ userDetails: res.data[0] });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        const { userDetails } = this.state;

        return (
            <div className="parent-div">
                <Row>
                    <Col span={24}>
                        <div className="left-div">
                            <img alt="user" src={BUCKET_URL + userDetails.profile_pic} />
                        </div>
                    </Col>

                    <Col span={24}>
                        <div className="right-div">
                            <span> <b>Name:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.first_name ? userDetails.last_name ? userDetails.first_name + ' ' + userDetails.last_name : userDetails.first_name : ''}
                            </p>

                            <span> <b>Email:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.email ? userDetails.email : ''}
                            </p>

                            <span><b>Address: </b></span>
                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.street_address ? userDetails.street_address_2 ? userDetails.street_address + ',' + userDetails.street_address_2 : userDetails.street_address : ''}
                            </p>

                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.city_town ? userDetails.city_town : 'NA'}
                            </p>

                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.country ? userDetails.country : 'NA'}
                            </p>

                            <span> <b>Date Of Birth:</b> </span>
                            <p style={{ "marginBottom": "10px" }}>
                                {userDetails.dob ? userDetails.dob : 'NA'}
                            </p>
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

