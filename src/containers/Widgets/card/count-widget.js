import React, { Component } from 'react';
import CardWrapper from './countStyle';

export default class extends Component {
    render() {
        const { icon, number, text, number2, text2, bgColor, title, headcolor } = this.props;

        return (
            <CardWrapper headcolor={headcolor} bgcolor={bgColor}
                title={<div><i className={icon} />   {title}</div>} bordered={false}>
                <div>
                    <span className="count">{number}</span>
                    <span className="isoLabel">{text}</span>
                </div>
                <div>
                    <span className="count">{number2}</span>
                    <span className="isoLabel">{text2}</span>
                </div>
            </CardWrapper>
        );
    }
}
