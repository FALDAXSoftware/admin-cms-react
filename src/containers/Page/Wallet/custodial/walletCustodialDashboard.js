import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Icon, Tooltip, Row, Col, Input, Button} from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import { isAllowed } from '../../../../helpers/accessControl';
var self;

const columns=[
    {
        title:<IntlMessages id="walletWarmDashboardTable.title.action"/>,
        key:3,
        width:100,
        render:object=>(<>{isAllowed("admin_cold_wallet_details") && <Tooltip className="btn-icon" title="View"><Icon onClick={()=>WalletCustodialDashboard.navigateToView(object["coin_code"])} type="info-circle"></Icon></Tooltip>}</>)
    },
    {
        title:<IntlMessages id="walletWarmDashboardTable.title.asset"/>,
        key:2,
        width:100,
        render:object=><span><img className="small-icon-img" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"]+" ("+object["coin_name"]+ ")"}</span>
    },
    {
        title:<IntlMessages id="walletCustodialDashboardTable.title.balance"/>,
        key:0,
        dataIndex:"balance",
        width:100,
        render:data=><span>{parseFloat(data).toFixed(8)}</span>
    },
    {
        title:<IntlMessages id="walletCustodialDashboardTable.title.address"/>,
        key:2,
        dataIndex:"address",
        width:100,
    },
]

class WalletCustodialDashboard extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,data:[],searchData:""}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
    }

    componentDidMount(){
        this.getWalletData();
    }

    static navigateToView=(coin_code)=>{
        let {data}=self.state;
        let assets=[]
        data.map((ele)=>{
            assets.push({name:ele.coin,value:ele.coin_code})
            return ele;
        })
        self.props.history.push({pathname:`./wallet/custodial/${coin_code}`,state:{assets:JSON.stringify(assets)}})
    }

    openNotificationWithIcon = (type="Error",message="Something went to wrong") => {
        notification[(type).toLowerCase()]({
          message:type,
          description:message
        });
    }

    getWalletData=async ()=>{
        try{
            await this.loader.show()
            let {searchData}=this.state;
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWalletColdDashboard(searchData)).json();
            let [{status,data,err},logout]=[res,this.props.logout];
            if(status==200){
                this.setState({data});
            }else if(status==400 || status==403){
                this.openNotificationWithIcon("Error",err)
                logout();
            }else{
                this.openNotificationWithIcon("Error",err)
            }
        }catch(error){
            console.log("error",error);
        }finally{
            this.loader.hide();
        }
    }
    render() { 
        const [{loader,data,searchData}] =[this.state];
        return (
            <>
                   <TableDemoStyle className="isoLayoutContent">
                        <Row justify="end" type="flex">
                            <Col className="table-column" xs={12} md={7}>
                                <Input placeholder="Search Asset" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="search" className="filter-btn btn-full-width" onClick={()=>this.getWalletData()}>Search</Button>
                            </Col>
                        </Row>
                        <TableWrapper
                            {...this.state}
                            columns={columns}
                            pagination={false}
                            dataSource={data}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
                        />
                    {loader && <Loader/>}
                   </TableDemoStyle>
                   </>
              );
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(WalletCustodialDashboard))
 
