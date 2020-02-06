import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import {  withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select, Form } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, S3BucketImageURL } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { DateTimeCell} from '../../../../components/tables/helperCells';
var self;

const {RangePicker}=DatePicker;
const {Option}=Select;
const columns=[
    {
        title:<IntlMessages id="walletJstDetailsTable.title.coin_code"/>,
        key:55,
        dataIndex:"coin_code",
        width:100,
        align:"left",
        ellipsis: true,
        render:data=><span>{data.toUpperCase()}</span>
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.transact_time"/>,
        key:1,
        dataIndex:"transact_time",
        sorter: true,
        width:150,
        align:"left",
        ellipsis: true,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.email"/>,
        key:2,
        dataIndex:"email",
        width:300,
        align:"left",
        ellipsis: true,
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.exec_id"/>,
        dataIndex:"exec_id",
        key:5,
        width:150,
        align:"left",
        ellipsis: true,
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.order_id"/>,
        key:5,
        width:150,
        align:"left",
        ellipsis: true,
        dataIndex:"order_id",
        render:data=><a onClick={()=>self.props.history.push({pathname:"/dashboard/trade-history",state:{"orderId":data+""}})}>{data}</a>
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.comission"/>,
        key:3,
        dataIndex:"comission",
        width:200,
        align:"left",
        ellipsis: true,
        render:(data)=><span>{parseFloat(data.split(" ")[0]).toFixed(8) +" "+data.split(" ")[1]}</span>
    },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.faldax_fees"/>,
        dataIndex:"faldax_fees",
        key:4,
        width:200,
        align:"left",
        ellipsis: true,
        render:(data)=><span>{parseFloat(data.split(" ")[0]).toFixed(8) +" "+data.split(" ")[1]}</span>
    },
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.fill_price"/>,
    //     key:6,
    //     width:100,
    //align:"left",
        // ellipsis: true,
    //     dataIndex:"fill_price"
    // },
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.limit_price"/>,
    //     key:7,
    //     sorter: true,
    //     width:100,
    //align:"left",
        // ellipsis: true,
    //     dataIndex:"limit_price"
    // },
    {
        title:<IntlMessages id="walletJstDetailsTable.title.network_fees"/>,
        key:8,
        width:200,
        align:"left",
        ellipsis: true,
        dataIndex:"network_fees",
        render:(data)=><span>{parseFloat(data.split(" ")[0]).toFixed(8) +" "+data.split(" ")[1]}</span>
    },
    
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.order_status"/>,
    //     key:10,
    //     sorter: true,
    //     width:100,
        //    align:"left",
        // ellipsis: true,
    //     dataIndex:"order_status",
    //     render:data=><span className={"status-"+data+""}>{data.charAt(0).toUpperCase() + data.slice(1)}</span>
    // },
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.quantity"/>,
    //     key:11,
    //     sorter: true,
    //     width:100,
    //align:"left",
        // ellipsis: true,
    //     dataIndex:"quantity"
    // },
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.settle_currency"/>,
    //     key:13,
    //     sorter: true,
    //     width:100,
        //align:"left",
        // ellipsis: true,
    //     dataIndex:"settle_currency"
    // },
    // {
    //     title:<IntlMessages id="walletJstDetailsTable.title.symbol"/>,
    //     key:14,
    //     sorter: true,
    //     width:100,
        //align:"left",
        // ellipsis: true,
    //     dataIndex:"symbol"
    // }

    
]

class WalletJstDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,walletValue:[],limit:PAGESIZE,page:1,sortOrder:"descend",sorterCol:"created_at",count:0,searchData:"",coin_code:"",rangeDate:"",assetsList:[]}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
    }

    componentDidMount(){
        this.setState({coin_code:this.props.match.params.coin,assetsList:JSON.parse(this.props.location.state?this.props.location.state.assets:"[]")})
        this.getWalletData();
    }

    openNotificationWithIcon = (type="Error",message="Unable to complete the requested action.") => {
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
            const {page,sortOrder,sorterCol,limit,searchData,rangeDate,coin_code}=this.state;
            let start_date=rangeDate?moment(rangeDate[0]).toISOString():"",end_date=rangeDate?moment(rangeDate[1]).toISOString():"";
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(coin_code,page,limit,sorterCol,sortOrder,searchData,start_date,end_date,3)).json();
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
                                    <Input placeholder="Search" value={searchData} onChange={(value) => { this.setState({searchData:value.target.value})}}/>
                                </Col>
                                <Col className="table-column" xs={12} md={7}>
                                    <RangePicker format="YYYY-MM-DD" value={rangeDate}  onChange={(date)=>this.setState({rangeDate:date})}/>
                                </Col>
                                <Col className="table-column" xs={12} md={4}>
                                    <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                        <Option value="">All</Option>
                                        {assetsList.map((ele)=><Option key={ele.key} value={ele.value}><span><img className="small-icon-img" src={S3BucketImageURL+ele.icon}/>&nbsp;{ele.name}</span></Option>)}
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
                            {...this.state}
                            rowKey="id"
                            columns={columns}
                            pagination={false}
                            dataSource={walletValue}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
                            scroll={TABLE_SCROLL_HEIGHT}
                            bordered
                            // expandedRowRender={data => <>{
                            //     <Row type="flex" justify="start">
                            //         {
                            //             Object.keys(data.execution_report).map(key=>(<><Col md={2}><b>{key}</b></Col><Col md={22}>{data.execution_report[key]}</Col></>))
                            //         }
                            //     </Row>
                            // }</>}
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
    }),{ ...authAction})(WalletJstDetailsComponent))
 
