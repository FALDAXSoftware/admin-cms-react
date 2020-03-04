import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';

class PageCounterComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            page:this.props.page||0,
            limit:this.props.limit||0,
            dataCount:this.props.dataCount ||0
         }
    }

    componentWillReceiveProps(nextProps){
        if(this.state.page!=nextProps.page ||this.state.dataCount!=nextProps.dataCount||this.state.limit!=nextProps.limit){
            this.setState({page:nextProps.page,dataCount:nextProps.dataCount,limit:nextProps.limit})
        }
    }
    render() { 
        let {page,limit,dataCount}=this.state;
        return (
           <div className="clearfix">
               <span className="float-left">
                    <Tooltip title="Sync Data"><Icon  className="cursor-pointer" type="sync" onClick={this.props.syncCallBack}/></Tooltip>
               </span>
              {dataCount!=0 &&<span className="float-right">
                   {(parseFloat(page)-1)*parseFloat(limit)+1}-{(parseFloat(page)*parseFloat(limit))>parseFloat(dataCount)?dataCount:(parseFloat(page)*parseFloat(limit))}&nbsp;of&nbsp;{dataCount}
        </span>}
           </div>
        );
    }
}
 
export {PageCounterComponent} ;