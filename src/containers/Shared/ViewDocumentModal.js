import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { BUCKET_URL } from "../../helpers/globals";

class ViewDocumentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            document: "",
            documentType: ""
        };
    }
    componentWillReceiveProps(newProps) {
        if (newProps.document !== this.state.public_note) {
            var extension = newProps.document
                .split('.');
            this.setState({ document: newProps.document, documentType: newProps.documentType, type: extension[extension.length - 1] });
        }
        if (newProps.visible !== this.state.visible) {

            this.setState({ visible: newProps.visible })
        }
    }
    onCancel = () => {
        this.setState({ visible: false });
        this.props.setVisible(false)
    }
    onRejectRequestSubmit = () => {
        this.props.callback(this.state.private_note, this.state.public_note)
    }

    onChange = ({ target }) => {
        if (target.name == "public_note") {
            this.setState({ public_note: target.value })
        } else {
            this.setState({ private_note: target.value })
        }
    }

    render() {
        return (
            <Modal
                title="Notes"
                visible={this.state.visible}
                onCancel={this.onCancel}
                key={this.state.private_note}
                footer={[
                    <Button onClick={this.onCancel}>close</Button>,
                ]}
            >
                {this.state.document &&
                    this.state.document != null ? (
                        <div>
                            <span>
                                <b>{this.state.documentType} Document:</b>{" "}
                            </span>
                            <br />
                            <br />
                            <a
                                href={BUCKET_URL + this.state.document}
                                target="_blank"
                            >
                                {this.state.type == "pdf" &&
                                    <a
                                        href={BUCKET_URL + this.state.document}
                                        target="_blank"
                                    >
                                        View {this.state.documentType} Document
                                    </a>
                                }

                                {
                                    this.state.type !== "pdf" &&
                                    <img
                                        style={{ maxWidth: "50%" }}
                                        alt=""
                                        src={BUCKET_URL + this.state.document}
                                    />
                                }
                            </a>
                        </div>
                    ) : (
                        ""
                    )}

            </Modal>
        );
    }
}

export default ViewDocumentModal;