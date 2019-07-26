import React, { Component } from 'react';
import styled from 'styled-components';

const PTag = styled.p`
    margin-bottom: 10px;
`

class DetailDiv extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { title, value } = this.props;

        return (
            <div>
                <PTag>
                    <span> <b>{title}:</b> </span>
                    {value}
                </PTag>
            </div>
        );
    }
}

export default DetailDiv;
