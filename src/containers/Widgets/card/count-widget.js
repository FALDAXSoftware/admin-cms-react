import React, { Component } from 'react';
import CardWrapper from './countStyle';
import { isAllowed } from '../../../helpers/accessControl';

export default class extends Component {
    redirectToDeleteAccountPage=(e,tabIndex)=>{

        switch(tabIndex){
            case 1:
                if(!isAllowed("get_users")){
                    return false;
                }else{
                    this.props.history.push({pathname:"./users",state:{"selectedTab":tabIndex.toString()}})
                }
            case 2:
                if(!isAllowed("get_inactive_users")){
                    return false;
                }else {
                    this.props.history.push({pathname:"./users",state:{"selectedTab":tabIndex.toString()}})
                }
            case 3:
                if(!isAllowed("get_deleted_users")){
                    return false
                }else{
                    this.props.history.push({pathname:"./users",state:{"selectedTab":tabIndex.toString()}})
                }
        }
        
    }
    render() {
        const { icon, number, text, number2,number3, text2, text3, bgcolor, title, headcolor } = this.props;
        return (
            <CardWrapper headcolor={headcolor} bgcolor={bgcolor}
                title={<div><i className={icon} />   {title}</div>} bordered={false}>
                <div className="cursor-pointer">
                    <span className="count">{number}</span>
                    <span className="isoLabel">{text}</span>
                </div>
                <div className="cursor-pointer">
                    <span className="count">{number2}</span>
                    <span className="isoLabel">{text2}</span>
                </div>
                <div className="cursor-pointer">
                    <span className="count">{number3}</span>
                    <span className="isoLabel">{text3}</span>
                </div>
            </CardWrapper>
        );
    }
}
