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
                <img style={{ width: '20%', height: '30%' }} src={userDetails.image} />
                <br />

                <span> <b>User Name:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.name}
                </p>

                <span> <b>Price:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.price}
                </p>

                <span> <b>Description:</b> </span>
                <p style={{ "marginBottom": "15px" }}>
                    {userDetails.description}
                </p>
            </Modal>
        );
    }
}

export default ViewUserModal;