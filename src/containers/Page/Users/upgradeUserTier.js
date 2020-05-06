import React, { Component } from 'react';
import { Steps, Button, Modal, Divider, notification } from 'antd';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import ApiUtils from '../../../helpers/apiUtills';
import { connect } from 'react-redux';
import authAction from "../../../redux/auth/actions";
import FaldaxLoader from '../faldaxLoader';
const { logout } = authAction;
const { Step } = Steps;
class UpgradeUserTier extends Component {
    constructor(props) {
        super(props);
        this.state = {req1_ageCheck: false,req1_tradeCountCheck: false,req1_tradeTotalFiatCheck: false,req2_tradeWalletCheck: false,loader:false,accountTier:1,requested_tier:0,showUnlockTierModal:false,note:"",tier_unlock_warning:"",tierUpgradeRequirement1:{},tierUpgradeRequirement2:{},tierData1:{},tierData2:{}};
        this.loader={
            show:()=>this.setState({loader:true}),
            hide:()=>this.setState({loader:false}),
            
        }
    }
    
    componentDidMount(){
        this.init();
    }

    onUnlockTier=async(tier)=>{
        try{
            this.loader.show();
            let res= await(await ApiUtils.checkTierUpgradeStatus(this.props.token,this.props.user_id,tier)).json();
            let {data,status,message,err,getTierData}=res;
            if(status==200){
                let res2=await (await ApiUtils.tierUnlock(this.props.token,this.props.user_id,tier)).json();
                if(res2.status==200){
                    this.init();
                }
            }else if(status==202){
                this.setState({requested_tier:tier,showUnlockTierModal:true,tier_unlock_warning:message,tierUpgradeRequirement1:getTierData.minimum_activity_thresold,tierUpgradeRequirement2:getTierData.requirements_two,tierData1:data.requirement_1,tierData2:data.requirement_2,req1_ageCheck: data.req1_ageCheck,req1_tradeCountCheck: data.req1_tradeCountCheck,req1_tradeTotalFiatCheck: data.req1_tradeTotalFiatCheck,req2_tradeWalletCheck: data.req2_tradeWalletCheck,});
            }else if(res.status==403){
                this.openNotification("error","Error",res.message?res.message:res.err);
                this.props.logout();
            }else{
                this.openNotification("error","Error",res.message?res.message:res.err);
            }
        }catch(error){
            console.log(error);
            this.openNotification("error","Error",'Unable to complete the requested action.');
        }finally{
            this.loader.hide();
        }
    }

    openNotification = (type,message,description) => {
        notification[type]({
          message: message,
          description:description,
        });
        this.setState({ errMsg: false });
      };

    forceUnlock=async ()=>{
        try{
            this.loader.show();
            let res=await(await ApiUtils.tierUnlock(this.props.token,this.props.user_id,this.state.requested_tier)).json();
            if(res.status==200){
                this.setState({showUnlockTierModal:false    })
                this.openNotification("success","Success",res.message);
                this.loader.hide();
                this.init();
            }else if(res.status==403){
              this.loader.hide();
                this.openNotification("error","Error",res.message?res.message:res.err);
                this.props.logout();
            }else{
              this.loader.hide();
                this.openNotification("error","Error",res.message?res.message:res.err);
            }
        }catch(error){
            this.openNotification("error","Error",'Unable to complete the requested action.');
            this.loader.hide();
        }finally{
            // this.loader.hide();
        }
    }

    async init(){
        try {
          this.loader.show();
          let res = await (
            await ApiUtils.getUserTierValue(this.props.token, this.props.user_id)
          ).json();
          let { status, message, data, err } = res;
          if (status == 200) {
            this.setState({ accountTier:data.tier?(data.tier):(data.teir)});
          }else if(res.status==403){
            this.openNotification("error","Error",res.message?res.message:res.err);
            this.props.logout();
        }else{
            this.openNotification("error","Error",res.message?res.message:res.err);
        }
        } catch(error) {
            console.log(error);
            this.openNotification("error","Error",'Unable to complete the requested action.');
        } finally {
          this.loader.hide();
        }
    }

    render() {
        const {req1_ageCheck,req1_tradeCountCheck,req1_tradeTotalFiatCheck,req2_tradeWalletCheck,accountTier,loader,tier_unlock_warning,tierUpgradeRequirement1,tierUpgradeRequirement2,tierData1,tierData2}=this.state;
        console.log(accountTier)
        return (
          <TableDemoStyle className="full-width isoLayoutContent">
            <Steps
              progressDot
              direction="vertical"
              current={accountTier}
              initial={1}
            >
              <Step
                status={accountTier >= 2 ? "finish" : accountTier == 1 ? "process" : "wait"}
                title="Tier 2"
                description={
                  accountTier >= 2 ? (
                    "Unlocked"
                  ) : (
                    <>
                    {accountTier==1 && <Button className="upgraded-btn" type="Primary" onClick={()=>this.onUnlockTier(2)}>
                      Unlock
                    </Button>}
                    </>
                  )
                }
              />
              <Step
                status={accountTier >= 3 ? "finish" : accountTier == 2 ? "process" : "wait"}
                title="Tier 3"
                description={
                  accountTier >= 3 ? (
                    "Unlocked"
                  ) : (
                    <>
                    {accountTier==2 &&  <Button className="upgrade-btn" type="Primary" onClick={()=>this.onUnlockTier(3)}>
                      Unlock
                    </Button>}
                    </>
                  )
                }
              />
              {/* <Step
                status={accountTier >= 4 ? "finish" : "wait"}
                title="Tier 4"
                description={
                  accountTier >= 4 ? (
                    "Unlocked"
                  ) : (
                    <Button className="upgrade-btn" type="Primary" onClick={()=>this.onUnlockTier(4)}>
                      Unlock
                    </Button>
                  )
                }
              /> */}
            </Steps>
            {loader &&<FaldaxLoader/>}
            <Modal
                width={700}
                title="Unlock Tier Info"
                visible={this.state.showUnlockTierModal}
        //   onOk={this.handleOk}
                onCancel={()=>this.setState({showUnlockTierModal:false})}
                footer={[
                    <Button type="primary" onClick={this.forceUnlock}>Force Unlock</Button>,
                    <Button  onClick={()=>this.setState({showUnlockTierModal:false})}>Cancel</Button>
                ]}
        >
          <p className="tier-unlock-warning">{tier_unlock_warning}</p>
          <table className="full-width tier-upgrade-info-tbl" border="1">
              <tr>
                  <th>Title</th>
                  <th>Requirement</th>
                  <th>User Data</th>
              </tr>
              <tr>
                  <td>Minimum Account Age (Days)</td>
                <td>{tierUpgradeRequirement1.Account_Age}</td>
                  <td className={req1_ageCheck?"color-green":"color-red"}>{tierData1.ageRemaining}</td>
              </tr>
              <tr>
                  <td>Minimum Number of Trades</td>
                  <td> {tierUpgradeRequirement1.Minimum_Total_Transactions}</td>
                  <td className={req1_tradeCountCheck?"color-green":"color-red"}>{tierData1.tradeCountRemaining?tierData1.tradeCountRemaining:0}</td>
              </tr>
              <tr>
                  <td>Minimum Total USD Value of Trades</td>
                  <td>$ {tierUpgradeRequirement1.Minimum_Total_Value_of_All_Transactions}</td>
                  <td className={req1_tradeTotalFiatCheck?"color-green":"color-red"}>$ {tierData1.tradeTotalFiatRemaining?tierData1.tradeTotalFiatRemaining:0}</td>
              </tr>
          </table>
          <Divider>Or</Divider>
          <table className="full-width tier-upgrade-info-tbl" border="1">
              <tr>
                  <th>Title</th>
                  <th>Requirement</th>
                  <th>User Data</th>
              </tr>
              <tr>
                  <td>Total Wallet USD Value</td>
            <td>$ {tierUpgradeRequirement2.Total_Wallet_Balance}</td>
            <td className={req2_tradeWalletCheck?"color-green":"color-red"}>$ {tierData2.userWalletFiatRemaining?tierData2.userWalletFiatRemaining:0}</td>
              </tr>
            </table>
        </Modal>
          </TableDemoStyle>
        );
    }
}

export default connect(
    state => ({
      token: state.Auth.get("token"),
      user: state.Auth.get("user")
    }),
    { logout}
  )(UpgradeUserTier);