import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select, Form, Tooltip, Icon } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { DateTimeCell , TransactionIdHashCell} from '../../../../components/tables/helperCells';
import { isAllowed } from '../../../../helpers/accessControl';
var self;
const {RangePicker}=DatePicker;
const {Option}=Select;
const columns=[
    {
        title:"",
        key:"actions",
        align:"left",
        ellipsis: true,
        width:45,
        render:(data)=><>{isAllowed("get_all_transactions") &&<Tooltip title="View"><Icon type="info-circle" onClick={()=>self.viewTransactionHistory(data["transaction_id"])}></Icon></Tooltip>}</>
    },
    {
        title:<IntlMessages id="walletDetailsTable.title.coin_code"/>,
        key:55,
        dataIndex:"coin_code",
        align:"left",
        ellipsis: true,
        width:100,
        render:data=><span>{data.toUpperCase()}</span>
    },
    {
        title:<IntlMessages id="walletDetailsTable.title.created_on"/>,
        key:"created_at",
        dataIndex:"created_at",
        sorter: true,
        align:"left",
        ellipsis: true,
        width:150,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    // {
    //     title:<IntlMessages id="walletDetailsTable.title.amount"/>,
    //     key:"amount",
    //     // sorter: true,
    //     align:"left",
    //     ellipsis: true,
    //     width:150,
    //     render:data=><span>{data?parseFloat(data["amount"]).toFixed(8)+" "+data["coin"]:"-"}</span>
    // },
    {
        title:<IntlMessages id="walletDetailsTable.title.faldax_fee"/>,
        key:"faldax_fee",
        // sorter: true,
        align:"left",
        ellipsis: true,
        width:150,
        render:data=><span>{data["faldax_fee"]?(parseFloat(data["faldax_fee"]).toFixed(8)+" "+data["coin"]):"-"}</span>
    },
    // {
    //     title:<IntlMessages id="walletDetailsTable.title.residual_amount"/>,
    //     key:6,
    //     width:150,
    //     align:"left",
    //     ellipsis: true,
    //     dataIndex:"residual_amount",
    //     render:data=><span>{data?data:"-"}</span>
    // },
    {
        title:<IntlMessages id="walletDetailsTable.title.source_address"/>,
        dataIndex:"source_address",
        key:4,
        align:"left",
        ellipsis: true,
        width:300,
    },
    {
        title:<IntlMessages id="walletDetailsTable.title.destination_address"/>,
        dataIndex:"destination_address",
        key:5,
        align:"left",
        ellipsis: true,
        width:300,
    },
    {
        title:<IntlMessages id="walletDetailsTable.title.transaction_id"/>,
        key:6,
        width:500,
        align:"left",
        ellipsis: true,
        render:data=>TransactionIdHashCell(data["coin_code"],data["transaction_id"],)
       
    },
    
]

class WalletDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,walletValue:[],limit:PAGESIZE,page:1,sortOrder:"descend",sorterCol:"created_at",count:0,searchData:"",coin_code:"",rangeDate:"",assetsList:[]}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
    }

    viewTransactionHistory=(transaction_hash)=>{
        this.props.history.push({pathname:'/dashboard/transaction-history',state:{"transaction_hash":transaction_hash}})
    }

    componentDidMount(){
        this.setState({coin_code:this.props.match.params.coin,assetsList:JSON.parse(this.props.location.state?this.props.location.state.assets:"[]")})
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
            { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
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
            const {page,sortOrder,sorterCol,limit,searchData,rangeDate,coin_code}=this.state;
            let start_date=rangeDate?moment(rangeDate[0]).toISOString():"",end_date=rangeDate?moment(rangeDate[1]).toISOString():"";
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(coin_code,page,limit,sorterCol,sortOrder,searchData,start_date,end_date)).json();
            let [{status,walletValue,err,message,tradeCount},logout]=[res,this.props.logout];
            if(status==200){
                this.setState({walletValue,count:tradeCount});
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
        const [{loader,walletValue,count,limit,page,searchData,rangeDate,coin_code,assetsList},pageSizeOptions] =[this.state,PAGE_SIZE_OPTIONS];
        return (
            <>
                   <TableDemoStyle className="isoLayoutContent">
                        <Form onSubmit={(e)=>{e.preventDefault();this.getWalletData();}}> 
                            <Row justify="start" type="flex">
                                <Col className="table-column" xs={12} md={7}>
                                    <Input placeholder="Search" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                                </Col>
                                <Col className="table-column" xs={12} md={7}>
                                    <RangePicker format="YYYY-MM-DD" value={rangeDate}  onChange={(date)=>this.setState({rangeDate:date})}/>
                                </Col>
                                <Col className="table-column" xs={12} md={4}>
                                    <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                        <Option value="">All</Option>
                                        {assetsList.map((ele)=><Option key={ele} value={ele.value}>{ele.name}</Option>)}
                                    </Select>
                                </Col>
                                <Col className="table-column" xs={12} md={3}>
                                    <Button type="primary" icon="search" className="filter-btn btn-full-width" htmlType="submit">Search</Button>
                                </Col>
                                <Col className="table-column" xs={12} md={3}>
                                    <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={()=>{this.setState({rangeDate:"",searchData:"",coin_code:this.props.match.params.coin},()=>this.getWalletData())}}>Reset</Button>
                                </Col>
                            </Row>
                        </Form>
                        <TableWrapper
                            rowKey="created_at"
                            {...this.state}
                            tableLayout="fixed"
                            columns={columns}
                            pagination={false}
                            dataSource={walletValue}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
                            scroll={TABLE_SCROLL_HEIGHT}
                            bordered
                        />
                        <Pagination
                            className="ant-users-pagination"
                            onChange={this.handlePagination}
                            pageSize={limit}
                            current={page}
                            total={count}
                            showSizeChanger
                            onShowSizeChange={this.changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
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
    }),{ ...authAction})(WalletDetailsComponent))
 
