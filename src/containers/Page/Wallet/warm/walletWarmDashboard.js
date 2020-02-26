import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Tooltip, Icon, Row, Input, Button, Col, Form,Modal} from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import SimpleReactValidator from 'simple-react-validator';
import { isAllowed } from '../../../../helpers/accessControl';
import { ConvertSatoshiToAssetCell,PrecisionCell } from '../../../../components/tables/helperCells';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';
import { exportWallet } from '../../../../helpers/exportToCsv/headers';

var self;
const columns=[
    {
        title:<IntlMessages id="walletWarmDashboardTable.title.action"/>,
       align:"left",
        key:3,
        width:100,
        render:object=>(<>
                {isAllowed("warm_wallet_send") && <Tooltip className="cursor-pointer" title="Send"><Icon type="export" onClick={()=>WalletWarmDashboard.openSendModal(object)}></Icon></Tooltip>}
                {isAllowed("admin_warm_wallet_details") && <Tooltip className="btn-icon" title="View"><Icon onClick={()=>WalletWarmDashboard.navigateToView(object["coin_code"])} type="info-circle"></Icon></Tooltip>}
            </>)
    },

    {
        title:<IntlMessages id="walletWarmDashboardTable.title.asset"/>,
       align:"left",
        key:4,
        width:100,
        render:object=><span><img className="small-icon-img" src={`https://s3.us-east-2.amazonaws.com/production-static-asset/${object["coin_icon"]}`}></img>&nbsp;&nbsp;{object["coin"]+" ("+object["coin_name"]+ ")"}</span>
    },
    {
        title:<IntlMessages id="walletWarmDashboardTable.title.balance"/>,
        align:"left",
        key:1,
        width:100,
        render:data=>ConvertSatoshiToAssetCell(data["coin"],data["balance"])
    },
    {
        title:<IntlMessages id="walletWarmDashboardTable.title.address"/>,
       align:"left",
        key:2,
        dataIndex:"address",
        width:100,
    },
]

class WalletWarmDashboard extends Component {
    constructor(props){
        super(props)
        this.timer=1000;//1.5 seconds
        this.timeCounter=undefined;
        this.state={openCsvModal:false,csvData:[],loader:false,data:[],searchData:"",availableBalance:"",sendModal:false,walletDetails:{}, fields: {},min_limit:0}
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

    onExport=()=>{
        this.setState({openCsvModal:true},()=>this.getWalletData(true));
    }

    componentDidMount(){
        this.getWalletData();
    }
    static openSendModal = async(values) => {
        await self.getAssetAvailableBalance(values.coin_code);
        self.setState({ sendModal: true, walletDetails: values });
    }

    getAssetAvailableBalance=async(asset)=>{
        try{
            this.setState({loader:true});
            let res=await (await ApiUtils.getAvailableWarmBalance(this.props.token,asset)).json();
            let {status,data,coinData,err,message}=res;
            if(status==200){
                this.setState({availableBalance:data,min_limit:coinData.min_limit})
            }else if(status==403){
                this.openNotificationWithIcon("Error",err);
                this.props.logout();
            }else{
                this.openNotificationWithIcon("Error",message);
            }
        }catch(error){
            console.log(error)
        }finally{
            this.setState({loader:false});
        }
    }

    static navigateToView=(coin_code)=>{
        let {data}=self.state;
        let assets=[]
        data.map((ele)=>{
            assets.push({name:ele.coin,value:ele.coin_code,icon:ele.coin_icon})
            return ele;
        })
        self.props.history.push({pathname:`./wallet/warm/${coin_code}`,state:{assets:JSON.stringify(assets)}})
    }
    
    openNotificationWithIcon = (type="Error",message="Unable to complete the requested action.") => {
        notification[(type).toLowerCase()]({
          message:type,
          description:message
        });
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
        this.setState({ sendModal: false, fields: {}, walletDetails: [],networkFee:0 });
    }
    getWalletData=async (isExportToCsv=false)=>{
        try{
            await this.loader.show()
            let {searchData}=this.state;
            let res=await ((isExportToCsv?await ApiUtils.walletDashboard(this.props.token).getWalletWarnDashboard(""):await ApiUtils.walletDashboard(this.props.token).getWalletWarnDashboard(searchData))).json();
            let [{status,data,err},logout]=[res,this.props.logout];
            if(status==200){
                if(isExportToCsv){
                    this.setState({csvData:data})
                }else{
                    this.setState({data});
                }
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
    sendWalletBal = async () => {
        const { token } = this.props;
        const { fields, walletDetails,networkFee } = this.state;
        let formData = {
            amount: fields['amount'],
            destination_address: fields['dest_address'],
            coin_code: walletDetails.coin_code,
        };
        if (this.validator.allValid()) {
            try{
                this.loader.show();
                let res=await (await ApiUtils.sendWarmWalletBalance(token, formData)).json();
                let [{data,status,err,message},{logout}]=[res,this.props];
                if (status == 200) {
                    this.setState({ allWallets: data },()=>{this.openNotificationWithIcon("Success",message);this.getWalletData();});
                } else if (status == 403) {
                    this.openNotificationWithIcon("Error",err)
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
    _handleChange = async(field, e) => {
        let {token}=this.props,
        {fields,walletDetails} = this.state;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    render() { 
        const [{loader,data,searchData,walletDetails,sendModal,availableBalance,fields,min_limit,openCsvModal,csvData}] =[this.state];
        return (
            <>
                   <TableDemoStyle className="isoLayoutContent">
                   <ExportToCSVComponent
                        isOpenCSVModal={openCsvModal}
                        onClose={() => {
                        this.setState({ openCsvModal: false });
                        }}
                        filename="under_review_customer_id_verification.csv"
                        data={csvData}
                        header={exportWallet}
                    />
                        <Form onSubmit={(e)=>{e.preventDefault();this.getWalletData();}}>
                            <Row justify="start" type="flex">
                                <Col className="table-column" xs={12} md={7}>
                                    <Input placeholder="Search Asset" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                                </Col>
                                <Col className="table-column" xs={12} md={3}>
                                    <Button type="primary" htmlType="submit" icon="search" className="filter-btn btn-full-width">Search</Button>
                                </Col>
                                <Col className="table-column" xs={12} md={3}>
                                    <Button type="primary" onClick={this.onExport} icon="export" className="filter-btn btn-full-width">Export</Button>
                                </Col>
                            </Row>
                        </Form>
                        <TableWrapper
                            rowKey="id"
                            {...this.state}
                            columns={columns}
                            pagination={false}
                            dataSource={data}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
                            bordered
                        />
                    {loader && <Loader/>}
                   </TableDemoStyle>
                   <Modal
                            title="Send"
                            visible={sendModal}
                            onOk={this.closeSendModal}
                            onCancel={this.closeSendModal}
                            footer={[
                                <Button  key="submit-a" type="primary" onClick={this.sendWalletBal}>Send {walletDetails.coin}</Button>
                            ]}
                        >
                            <span className="wallet-send-summery-title"><b>Total Balance  </b></span><span>{walletDetails.coin_code?ConvertSatoshiToAssetCell(walletDetails.coin_code,walletDetails.balance):0} {walletDetails.coin}</span><br/>
                            <span className="wallet-send-summery-title"><b>Available Balance </b></span><span>{PrecisionCell(availableBalance)=="-"?0:PrecisionCell(availableBalance)} {walletDetails.coin}</span>
                            <Form onSubmit={this._sendWalletBal}>
                                <div className="table-tb-margin">
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
                                        {this.validator.message('amount', fields["amount"], `required|numeric|gte:${min_limit==0?0:min_limit?parseFloat(min_limit).toFixed(8):0}|lte:${availableBalance}`, 'text-danger')}
                                    </span>
                                </div>
                                <div className="clearfix">
                                    <div className="float-left">
                                        <span className="wallet-send-summery-head"><b>Sending Amount</b></span><span>{fields["amount"]||0} {walletDetails.coin}</span><br/>
                                        <span className="wallet-send-summery-head"><b>Total Payload</b></span><span>{PrecisionCell(fields['amount'])=="-"?0:PrecisionCell(fields['amount'])} {walletDetails.coin}</span><br/>
                                    </div>
                                </div>
                            </Form>
                        </Modal>
                   </>
              );
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(WalletWarmDashboard))
 
