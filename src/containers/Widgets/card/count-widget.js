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
        const { icon,data,bgcolor, title, headcolor } = this.props;
        return (
            <CardWrapper headcolor={headcolor} bgcolor={bgcolor}
                title={<div><i className={icon} />   {title}</div>} bordered={false}>
        
                {data && data.map((ele)=>(<div className="cursor-pointer">
                    <span className="count">{ele.count}</span>
                    <span className="isoLabel">{ele.name}</span>
                </div>))
                }
            </CardWrapper>
        );
    }
}
