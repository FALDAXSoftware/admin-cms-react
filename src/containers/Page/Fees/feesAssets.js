import { Table, Input, InputNumber, Popconfirm, Form, notification } from 'antd';
import React from 'react';
import TableDemoStyle from '../../Tables/antTables/demo.style';
import Loader from '../faldaxLoader';
import ApiUtils from '../../../helpers/apiUtills';
import {connect} from 'react-redux'
import { PrecisionCell } from '../../../components/tables/helperCells';
import authAction from "../../../redux/auth/actions"

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
    this.state = { data, editingKey: '' ,loader:false};
    this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})}
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '60%',
        editable: false,
      },
      {
        title: 'Fees',
        dataIndex: 'value',
        width: '20%',
        editable: true,
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
                    onClick={() => this.save(form, record.key)}
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
            <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </a>
          );
        },
      },
    ];
  }

  successNotification = (message) => {
    notification["success"]({
      message:"Success",
      description:message||"Record fetch successfully"
    });
  };

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

  async updateAssetLimit(slug,value){
    try{
        let {token}=this.props;
        let body={
            "slug":slug,
            "value":parseFloat(value)
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
        console.log("error",error);
    }finally{
        this.loader.hide();
    }
  }

  save(form, key) {
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
        this.setState({ data: newData, editingKey: '' });
        await this.updateAssetLimit(item.slug,row.value);
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
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
      console.log(error)
    }finally{
      this.loader.hide();
    }
  }
  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const {loader}=this.state;
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
const mapStateToProps = state => ({ token: state.Auth.get("token")})
export default connect(mapStateToProps,{...authAction})(EditableFormTable);