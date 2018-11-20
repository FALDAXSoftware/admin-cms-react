import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { Link } from 'react-router-dom';
import { BUCKET_URL } from '../../../helpers/globals';

class ViewUserModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showViewUserModal: this.props.showViewUserModal,
        }
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
        if (nextProps.showViewUserModal !== prevState.showViewUserModal) {
            return {
                showViewUserModal: nextProps.showViewUserModal
            }
        }
        return null;
    }

    _closeViewUserModal = () => {
        this.setState({ showViewUserModal: false })
        this.props.closeViewUserModal();
    }

    render() {
        const { userDetails } = this.props;
        const { showViewUserModal } = this.state;

        return (
            <Modal
                title="View User"
                visible={showViewUserModal}
                onCancel={this._closeViewUserModal}
                footer={[
                    <Button onClick={this._closeViewUserModal}>OK</Button>,
                ]}
            >
                <img alt="user" style={{ width: '40px', height: '40px' }}
                    src={BUCKET_URL + userDetails.profile_pic} />
                <br />

                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.first_name ? userDetails.first_name : 'NA'}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.last_name ? userDetails.last_name : 'NA'}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.email ? userDetails.email : 'NA'}
                </p>

                <span> <b>Street Address 1:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.street_address ? userDetails.street_address : 'NA'}
                </p>

                <span> <b>Street Address 2:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.street_address_2 ? userDetails.street_address_2 : 'NA'}
                </p>

                <span> <b>City:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.city_town ? userDetails.city_town : 'NA'}
                </p>

                <span> <b>Country:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.country ? userDetails.country : 'NA'}
                </p>

                <span> <b>Date Of Birth:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.dob ? userDetails.dob : 'NA'}
                </p>

                {/* <span> <b>Phone Number:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.phone_number}
                </p> */}

                <Link to={`/dashboard/users/history/${userDetails.value}`}>
                    View Login History
                </Link><br />

                <Link to={`/dashboard/users/sell-orders/${userDetails.value}`}>
                    View Sell Orders
                </Link><br />

                <Link to={`/dashboard/users/buy-orders/${userDetails.value}`}>
                    View Buy Orders
                </Link><br />

                <Link to={`/dashboard/users/trade-history/${userDetails.value}`}>
                    View Trade History
                </Link><br />
            </Modal>
        );
    }
}

export default ViewUserModal;
