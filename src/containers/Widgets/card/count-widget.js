import React, { Component } from 'react';
import CardWrapper from './countStyle';

export default class extends Component {
    render() {
        const { icon, iconcolor, number, text, number2, text2, bgColor, title,
            headColor } = this.props;
        const iconStyle = {
            color: iconcolor
        };

        return (
            <CardWrapper headColor={headColor} bgColor={bgColor}
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
