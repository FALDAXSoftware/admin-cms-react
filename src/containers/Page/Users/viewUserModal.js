import React, { Component } from 'react';
import { Modal } from 'antd';

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
                onOk={this._closeViewUserModal}
            >
                <img alt="user" style={{ width: '20%', height: '30%' }} src={userDetails.image} />
                <br />

                <span> <b>First Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.first_name}
                </p>

                <span> <b>Last Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.last_name}
                </p>

                <span> <b>Email:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.email}
                </p>

                <span> <b>Street Address:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.street_address}
                </p>

                <span> <b>City:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.city_town}
                </p>

                <span> <b>Country:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.country}
                </p>

                <span> <b>Date Of Birth:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.dob}
                </p>

                <span> <b>Phone Number:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.phone_number}
                </p>
            </Modal>
        );
    }
}

export default ViewUserModal;