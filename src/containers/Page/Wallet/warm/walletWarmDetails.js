import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import { DateTimeCell, TransactionHashCellUser } from '../../../../components/tables/helperCells';

const {Option}=Select;
const columns=[
    // {
    //     title:<IntlMessages id="walletWarmDetailsTable.title.coin"/>,
    //     key:4,
    //     dataIndex:"coin",
    //     width:100,
    //     render:data=><span>{data.toUpperCase()}</span>
    // },
    {
        title:<IntlMessages id="walletWarmDetailsTable.title.created_on"/>,
        key:"createdTime",
        dataIndex:"createdTime",
        width:100,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletWarmDetailsTable.title.baseValue"/>,
        key:5,
        dataIndex:"baseValue",
        width:75,
        render:data=><span>{data?parseFloat(data)>=0?(parseFloat(data)*0.00000001).toFixed(8):((parseFloat(data) * -1)*0.00000001).toFixed(8):""}</span>
    },
    {
        title:<IntlMessages id="walletWarmDetailsTable.title.type"/>,
        key:1,
        dataIndex:"type",
        width:75,
        render:data=><span className={data=="send"?"error-danger":"color-green"}>{data.charAt(0).toUpperCase()+data.slice(1)}</span>
    },
    {
        title:<IntlMessages id="walletWarmDetailsTable.title.txid"/>,
        key:25,
        width:250,
        ellipsis:true,
        render:data=>TransactionHashCellUser(undefined,undefined,undefined,undefined,undefined,undefined,undefined,data["txid"],data["coin"])
    },
    // {
    //     title:<IntlMessages id="walletWarmDetailsTable.title.normalizedTxHash"/>,
    //     key:3,
    //     dataIndex:"normalizedTxHash",
    //     width:100,
    // },
   
]

class WalletWarmDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,transfers:[],count:0,searchData:"",coin_code:"",assetsList:[]}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
    }

    componentDidMount(){
        this.setState({coin_code:this.props.match.params.coin,assetsList:JSON.parse(this.props.location.state.assets)})
        this.getWalletData();
    }

    openNotificationWithIcon = (type="Error",message="Something went to wrong") => {
        notification[(type).toLowerCase()]({
          message:type,
          description:message
        });
    }

    handleTableChange = (pagination,filter,sorter) => {
        this.setState(
            { sorterCol: sorter.field, sortOrder: sorter.order, page: 1 },
            () => {
              this.getWalletData();
            }
          );
    };

    changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this.getWalletData();
        });
    };

    handlePagination = page => {
        this.setState({ page }, () => {
         this.getWalletData();
        });
    };

    getWalletData=async ()=>{
        try{
            await this.loader.show()
            const {coin_code,searchData}=this.state;
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWarmWalletDetail(coin_code,searchData)).json();
            let [{status,data,err,tradeCount},logout]=[res,this.props.logout];
            if(status==200){
                this.setState({transfers:data.transfers,count:tradeCount});
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
        const [{loader,transfers,count,limit,page,searchData,rangeDate,coin_code,assetsList},pageSizeOptions] =[this.state,PAGE_SIZE_OPTIONS];
        return (
            <>
                   <TableDemoStyle className="isoLayoutContent">
                        <Row justify="end" type="flex">
                            <Col className="table-column" xs={12} md={7}>
                                <Input placeholder="Search" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                            </Col>
                            <Col className="table-column" xs={12} md={4}>
                                <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                    {assetsList.map((ele)=><Option key={ele} value={ele.value}>{ele.name}</Option>)}
                                </Select>
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="search" className="filter-btn btn-full-width" onClick={()=>this.getWalletData()}>Search</Button>
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={()=>{this.setState({rangeDate:"",searchData:"",coin_code:this.props.match.params.coin},()=>this.getWalletData())}}>Reset</Button>
                            </Col>
                        </Row>
                        <TableWrapper
                            rowKey="id"
                            {...this.state}
                            columns={columns}
                            pagination={false}
                            dataSource={transfers}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
                            scroll={TABLE_SCROLL_HEIGHT}
                            bordered
                        />
                        {/* <Pagination
                            className="ant-users-pagination"
                            onChange={this.handlePagination}
                            pageSize={limit}
                            current={page}
                            total={count}
                            showSizeChanger
                            onShowSizeChange={this.changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
                      /> */}
                    {loader && <Loader/>}
                   </TableDemoStyle>
                   </>
              );
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(WalletWarmDetailsComponent))
 
