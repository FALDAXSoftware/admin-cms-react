import { Table, Input, InputNumber, Popconfirm, Form, notification } from 'antd';
import React from 'react';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import Loader from '../faldaxLoader';
import ApiUtils from '../../../helpers/apiUtills';
import {connect} from 'react-redux'
import { PrecisionCell } from '../../../components/tables/helperCells';
import authAction from "../../../redux/auth/actions"
import { isAllowed } from '../../../helpers/accessControl';
import { TwoFactorModal, TwoFactorEnableModal } from '../../Shared/2faModal';

const data = [];
const EditableContext = React.createContext();
const regEx=/^[0-9]*$/
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
                {
                    pattern:regEx,
                    message:`Allow only number`
                }
              ],
              initialValue: PrecisionCell(record[dataIndex]),
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' ,loader:false,show2FAEnableModal:false,show2FAModal:false,form:undefined,key:undefined};
    this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})}
    this.columns = [
      {
        title: 'Name',
        key:"name",
        width: '55%',
        editable: false,
        render:(ele)=>{
          switch (ele.slug.toLowerCase()) {
            case "btc_static_fees":
              return <><span><b>{ele.name}</b></span><br/><span>This are the Static Fees in the Satoshis. This values are used for the estimate of the amount to send from Hot Receive to Warm Wallet</span></>
            case "eth_static_fees":
                return <><span><b>{ele.name}</b></span><br/><span>This are the Static Fees in Wei. This value are used for the estimate of the amount to be send from Hot Receive to Warm Wallet</span></>
            case "ltc_static_fees":
                return <><span><b>{ele.name}</b></span><br/><span>This are the Static Fees in Litoshi. This value are used for the estimate of the amount to be send from Hot Receive to Warm Wallet</span></>
            case "xrp_static_fees":
                return <><span><b>{ele.name}</b></span><br/><span>This are the Static Fees in Lowest Form of Ripple. This value are used for the estimate of the amount to be send from Hot Receive to Warm Wallet</span></>
            case "susu_static_fees":
                return <><span><b>{ele.name}</b></span><br/><span>This are the Static Fees in SUSU coin.</span></>
            case "xrp_limit_wallet_transfer":
                return <><span><b>{ele.name}</b></span><br/><span>This are the threshold value in Ripple(XRP). This value are for the transfer of Residual Funds from Hot Receive to Warm Wallet OR Hot Send to Warm Wallet</span></>
            case "ltc_limit_wallet_transfer":
                return <><span><b>{ele.name}</b></span><br/><span>This are the threshold value in Litecoin(LTC). This value are for the transfer of Residual Funds from Hot Receive to Warm Wallet OR Hot Send to Warm Wallet</span></>
            case "eth_limit_wallet_transfer":
                return <><span><b>{ele.name}</b></span><br/><span>This are the threshold value in Ethereum(ETH). This value are for the transfer of Residual Funds from Hot Receive to Warm Wallet OR Hot Send to Warm Wallet</span></>
            case "btc_limit_wallet_transfer":
                return <><span><b>{ele.name}</b></span><br/><span>This are the threshold value in Bitcoin(BTC). This value are for the transfer of Residual Funds from Hot Receive to Warm Wallet OR Hot Send to Warm Wallet</span></>
            default:
                return <span><b>{ele.name}</b></span>
          }
        }
      },
      {
        title: 'Value',
        dataIndex: 'value',
        width: '15%',
        editable: true,
      },
      {
        title: 'Notes',
        dataIndex: 'formula',
        width: '20%',
        editable: false,
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.onSubmit(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a disabled={(editingKey !== '' || !isAllowed("update_asset_fees_limits"))} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  errorNotification = (message) => {
    notification["error"]({
      message:"Error",
      description:message||"Some thing went to wrong. Please try again after some time."
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  async updateAssetLimit(slug,value,otp){
    try{
        let {token}=this.props;
        let body={
            "slug":slug,
            "value":parseFloat(value),
            "otp":otp
        }
        this.loader.show();
        let res= await (await ApiUtils.editAssetFeesAndLimits(token,body)).json();
        if(res.status==200){
            await this.getAssetFeesAndLimits();
        }else if(res.status==400 || res.status==403 || res.status==401){
            this.errorNotification(res.err);
            this.props.logout();
        }else{
            this.errorNotification(res.message);
        }
    }catch(error){
        this.errorNotification('Unable to complete the requested action.');
    }finally{
        this.loader.hide();
    }
  }
  onSubmit=(form,key)=>{
    let {user}=this.props;
    if(user.is_twofactor){
      this.setState({show2FAModal:true,form:form,key:key})
    }else{
      this.setState({show2FAEnableModal:true})
    }
  }

  save(form, key,otp) {
    form.validateFields(async(error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
          });
        this.setState({ data: newData, editingKey: '' ,show2FAModal:false});
        await this.updateAssetLimit(item.slug,row.value,otp);
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' ,show2FAModal:false});
      }
    });
  }

  getAssetSatoshiFormula(coin){
    switch (coin.toLowerCase()) {
      case "btc_static_fees":
        return <span>{`Asset Value = Value / 10,00,00,000`}</span>
      case "tbtc_static_fees":
          return <span>{`Asset Value = Value / 10,00,00,000`}</span>
      case "eth_static_fees":
          return <span>{`Asset Value = Value / 10,00,00,00,00,00,00,00,000`}</span>
      case "teth_static_fees":
          return <span>{`Asset Value = Value / 10,00,00,00,00,00,00,00,000`}</span>
      case "ltc_static_fees":
          return <span>{`Asset Value = Value / 10,00,00,000`}</span>
      case "tltc_static_fees":
          return <span>{`Asset Value = Value / 10,00,00,000`}</span>
      case "xrp_static_fees":
          return <span>{`Asset Value = Value / 10,00,000`}</span>
      case "txrp_static_fees":
          return <span>{`Asset Value = Value / 10,00,000`}</span>
      case "susu_static_fees":
          return <span>{`Asset Value = Value`}</span>
        break;
      default:
          return <span>-</span>
    }
  }

   componentDidMount(){
       this.getAssetFeesAndLimits();
      
  }
  async getAssetFeesAndLimits(){
    this.loader.show();
    let {token}=this.props;
    try{
      let res=await(await ApiUtils.getAssetFeesAndLimits(token)).json();
      let {status,data}=res;
      data=data.map((ele,index)=>{
          ele["key"]=index;
          ele["value"]=PrecisionCell(ele.value)
          ele["formula"]=this.getAssetSatoshiFormula(ele.slug);
          return ele;
      })
      if(status===200){
          this.setState({data});
      }else if(status==400 || status==403 || status==401){
          this.errorNotification(res.err);
          this.props.logout();
      }else{
          this.errorNotification(res.message)
      }
    }catch(error){
      this.errorNotification("Unable to complete the requested action.")
    }finally{
      this.loader.hide();
    }
  }
  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const {loader,show2FAModal,show2FAEnableModal,form,key}=this.state;
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
    <>
     {show2FAModal && <TwoFactorModal callback={(otp)=>this.save(form,key,otp)} title="Update Assets Fees" onClose={()=>this.setState({show2FAEnableModal:false,show2FAModal:false})}/>}
     {show2FAEnableModal && <TwoFactorEnableModal title="Update Assets Fees" onClose={()=>this.setState({show2FAEnableModal:false,show2FAModal:false})}/>}
    <TableDemoStyle className="isoLayoutContent">
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
      </EditableContext.Provider>
    </TableDemoStyle>
    {loader && <Loader/>}
    </>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
const mapStateToProps = state => ({ token: state.Auth.get("token"),user:state.Auth.get("user")})
export default connect(mapStateToProps,{...authAction})(EditableFormTable);