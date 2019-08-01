import React from 'react';
import CountCard from '../Widgets/card/count-widget';

function CardView(props) {
    return (
        <CountCard
            headcolor={'#1f2431'}
            title={props.cardTitle}
            number={props.countNumber}
            text={props.cardText}
            icon={props.icon}
            fontColor="#ffffff"
            bgcolor={'#fff'}
            style={{ boxShadow: "0px 3px 4px 0px rgba(45, 52, 70,0.5);" }}
        />
    )
};

export default CardView; 