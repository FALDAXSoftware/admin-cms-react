import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Row,Col,Input, Icon, Tooltip,Button, Modal, Form } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from './../../../../helpers/accessControl';

var self

const columns=[
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.action"/>,
        key:9,
        width:200,
        // fixed: 'left',
        render:object=>(
        <>
            {isAllowed("send_coin_admin") && <Tooltip className="cursor-pointer" title="Send"><Icon type="export" onClick={()=>WalletFaldaxDashboard.openSendModal(object)}></Icon></Tooltip>}
            {isAllowed("admin_faldax_wallet_details") && <Tooltip className="btn-icon" title="View"><Icon onClick={()=>WalletFaldaxDashboard.navigateToView(object["coin_code"])} type="info-circle"></Icon></Tooltip>}
        </>
        )
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.coin"/>,
        key:1,
        width:100,
        render:object=><span><img className="small-icon-img" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"]+" ("+object["coin_name"]+ ")"}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.total"/>,
        key:5,
        dataIndex:"total",
        width:100,
        render:data=><span>{data?(parseFloat(data)* 0.000000001).toFixed(8):"-"}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_forfeit"/>,
        key:2,
        dataIndex:"total_earned_from_forfeit",
        width:100,
        render:data=><span>{data?(parseFloat(data)* 0.000000001).toFixed(8):"-"}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_jst"/>,
        key:3,
        dataIndex:"total_earned_from_jst",
        width:100,
        render:data=><span>{data?(parseFloat(data)* 0.000000001).toFixed(8):"-"}</span>

    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.total_earned_from_wallets"/>,
        key:4,
        dataIndex:"total_earned_from_wallets",
        width:100,
        render:data=><span>{data?parseFloat(data).toFixed(8):"-"}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.send_address"/>,
        key:7,
        // dataIndex:"send_address",
        width:100,
        render:data=><span>{data["send_address"]?data["send_address"]: <Button size="small" type="dashed" onClick={()=>self.props.history.push(`./assets/wallet/${data["coin_code"]}`)}>Create</Button>}</span>
    },
    {
        title:<IntlMessages id="walletFaldaxDashboardTable.title.receive_address"/>,
        key:8,
        dataIndex:"receive_address",
        width:100,
        
    },
    
]

class WalletFaldaxDashboard extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,walletValue:[],searchData:"",sendModal:false,walletDetails:{}, fields: {}}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
        this.validator = new SimpleReactValidator({
            gtzero: {
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true
            }
        });
    }

    componentDidMount(){
        this.getWalletData();
    }

    static openSendModal = (values) => {
        self.setState({ sendModal: true, walletDetails: values });
    }

    static navigateToView=(coin_code)=>{
        let {walletValue}=self.state;
        let assets=[]
        walletValue.map((ele)=>{
            assets.push({name:ele.coin,value:ele.coin_code})
            return ele;
        })
        self.props.history.push({pathname:`./wallet/faldax/${coin_code}`,state:{assets:JSON.stringify(assets)}})
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
            const {searchData}=this.state;
            let res=await (await ApiUtils.getAllWallets(this.props.token,searchData)).json();
            let [{status,data,err,message},logout]=[res,this.props.logout];
            if(status==200){
                this.setState({walletValue:data});
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

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

   sendWalletBal = async () => {
        const { token } = this.props;
        const { fields, walletDetails } = this.state;
        let formData = {
            amount: fields['amount'],
            destination_address: fields['dest_address'],
            coin_code: walletDetails.coin_code
        };
        if (this.validator.allValid()) {
            try{
                this.loader.show();
                let res=await (await ApiUtils.sendWalletBalance(token, formData)).json();
                let [{data,status,err,message},logout]=[res,this.props];
                if (status == 200) {
                    this.setState({ allWallets: data });
                } else if (status == 403) {
                    this.openNotificationWithIcon("Error",message)
                    logout();
                } else {
                    this.openNotificationWithIcon("Error",message)
                }
                this.closeSendModal();
            }catch(err) {
                console.log(err)       
            }finally{
                this.loader.hide();
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    closeSendModal = () => {
        this.validator = new SimpleReactValidator({
            gtzero: {  // name the rule
                message: 'value must be greater than zero',
                rule: (val, params, validator) => {
                    if (val > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                required: true  // optional
            }
        });
        this.setState({ sendModal: false, fields: {}, walletDetails: [] });
    }

    render() { 
        const {loader,walletValue,walletDetails,searchData,sendModal,fields} =this.state;
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
                        rowKey="id"
                        {...this.state}
                        columns={columns}
                        pagination={false}
                        dataSource={walletValue}
                        className="isoCustomizedTable table-tb-margin"
                        // scroll={{ x: 1500, y: 400 }}
                    />
                   <Modal
                            title="Send"
                            visible={sendModal}
                            onOk={this.closeSendModal}
                            onCancel={this.closeSendModal}
                            footer={[
                                <Button type="primary" onClick={this.sendWalletBal}>Send {walletDetails.coin}</Button>
                            ]}
                        >
                            <Form onSubmit={this._sendWalletBal}>
                                <div style={{ "marginBottom": "15px" }}>
                                    <span>Destination Address:</span>
                                    <Input placeholder="Destination Address" onChange={this._handleChange.bind(this, "dest_address")} value={fields["dest_address"]} />
                                    <span style={{ "color": "red" }}>
                                        {this.validator.message('destination address', fields["dest_address"], 'required', 'text-danger-validation')}
                                    </span>
                                </div>
                                <div style={{ "marginBottom": "15px" }}>
                                    <span>Amount:</span>
                                    <Input placeholder="Amount" onChange={this._handleChange.bind(this, "amount")} value={fields["amount"]} />
                                    <span style={{ "color": "red" }}>
                                        {this.validator.message('amount', fields["amount"], 'required|numeric|gtzero', 'text-danger')}
                                    </span>
                                </div>
                                <div>
                                    <span style={{ float: 'right' }}>
                                        <b>Total Payout : {fields['amount']} {walletDetails.coin}</b>
                                    </span>
                                </div>
                            </Form>
                        </Modal>
                {loader && <Loader/>}
                </TableDemoStyle>
        </>);
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(WalletFaldaxDashboard))
 
