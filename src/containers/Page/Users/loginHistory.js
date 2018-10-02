import React, { Component } from 'react';

class LoginHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let id = this.props;
        console.log('>>>>', this.props);

        return (
            <div>
                History :
            </div>

        )
    }
}

export default LoginHistory;
