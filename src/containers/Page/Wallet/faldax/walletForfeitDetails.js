import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { DateTimeCell} from '../../../../components/tables/helperCells';

const {RangePicker}=DatePicker;
const {Option}=Select;
const columns=[
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.created_at"/>,
        key:1,
        dataIndex:"created_at",
        sorter: true,
        width:100,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.deleted_at"/>,
        key:1,
        dataIndex:"deleted_at",
        sorter: true,
        width:100,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.full_name"/>,
        key:2,
        sorter: true,
        dataIndex:"full_name",
        width:100,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.email"/>,
        key:1,
        dataIndex:"email",
        sorter: true,
        width:100,
        
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.balance"/>,
        key:2,
        sorter: true,
        dataIndex:"balance",
        width:100,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.placed_balance"/>,
        key:2,
        sorter: true,
        dataIndex:"placed_balance",
        width:100,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.send_address"/>,
        dataIndex:"send_address",
        key:3,
        sorter: true,
        width:100,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.receive_address"/>,
        dataIndex:"receive_address",
        key:4,
        sorter: true,
        width:100,
    },
]

class WalletForfeitDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,walletValue:[],limit:PAGESIZE,page:1,sortOrder:"descend",sorterCol:"created_at",count:0,searchData:"",coin_code:"",rangeDate:"",assetsList:[]}
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
            const {page,sortOrder,sorterCol,limit,searchData,rangeDate,coin_code}=this.state;
            let start_date=rangeDate?moment(rangeDate[0]).toISOString():"",end_date=rangeDate?moment(rangeDate[1]).toISOString():"";
            let res=await (await ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(coin_code,page,limit,sorterCol,sortOrder,searchData,start_date,end_date,4)).json();
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
                        <Row justify="end" type="flex">
                            <Col className="table-column" xs={12} md={7}>
                                <Input placeholder="Search" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                            </Col>
                            <Col className="table-column" xs={12} md={7}>
                                <RangePicker format="YYYY-MM-DD" value={rangeDate}  onChange={(date)=>this.setState({rangeDate:date})}/>
                            </Col>
                            <Col className="table-column" xs={12} md={4}>
                                <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                    <Option value="">All</Option>
                                    {assetsList.map((ele)=><Option value={ele.value}>{ele.name}</Option>)}
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
                            {...this.state}
                            columns={columns}
                            pagination={false}
                            dataSource={walletValue}
                            className="isoCustomizedTable table-tb-margin"
                            onChange={this.handleTableChange}
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
    }),{ ...authAction})(WalletForfeitDetailsComponent))
 
