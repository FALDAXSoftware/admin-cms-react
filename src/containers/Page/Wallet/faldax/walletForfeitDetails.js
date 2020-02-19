import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select, Form, Tooltip } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, S3BucketImageURL, EXPORT_LIMIT_SIZE } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import moment from "moment";
import { DateTimeCell} from '../../../../components/tables/helperCells';
import { PageCounterComponent } from '../../../Shared/pageCounter';
import { exportForfietFund } from '../../../../helpers/exportToCsv/headers';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';

const {RangePicker}=DatePicker;
const {Option}=Select;
const columns=[
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.coin_code"/>,
        align:"left",
        ellipsis: true,
        key:55,
        dataIndex:"coin_code",
        width:100,
        render:data=><span>{data.toUpperCase()}</span>
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.created_at"/>,
       align:"left",
        ellipsis: true,
        key:"created_at",
        dataIndex:"created_at",
        sorter: true,
        width:150,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.deleted_at"/>,
       align:"left",
        ellipsis: true,
        key:"deleted_at",
        dataIndex:"deleted_at",
        sorter: true,
        width:200,
        render:data=><span>{DateTimeCell(data)}</span>
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.full_name"/>,
        align:"left",
        ellipsis: true,
        key:2,
        dataIndex:"full_name",
        width:200,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.email"/>,
        align:"left",
        ellipsis: true,
        key:1,
        dataIndex:"email",
        width:250,
        
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.balance"/>,
        align:"left",
        key:2,
        ellipsis: true,
        dataIndex:"balance",
        width:200,
        render:(data)=><span>{parseFloat(data.split(" ")[0]).toFixed(8) +" "+data.split(" ")[1]}</span>
    },
    // {
    //     title:<IntlMessages id="walletForfeitDetailsTable.title.placed_balance"/>,
        //align:"left",
    //     key:2,
    //     sorter: true,
    //     dataIndex:"placed_balance",
    //     width:100,
    // },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.send_address"/>,
        align:"left",
        dataIndex:"send_address",
        key:3,
        width:300,
    },
    {
        title:<IntlMessages id="walletForfeitDetailsTable.title.receive_address"/>,
        align:"left",
        dataIndex:"receive_address",
        key:4,
        width:300,
    },
]

class WalletForfeitDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={loader:false,walletValue:[],limit:PAGESIZE,page:1,sortOrder:"descend",sorterCol:"created_at",count:0,searchData:"",coin_code:"",rangeDate:"",assetsList:[]}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
    }

    componentDidMount(){
        this.setState({openCsvModal:false,csvData:[],coin_code:this.props.match.params.coin,assetsList:JSON.parse(this.props.location.state?this.props.location.state.assets:"[]")})
        this.getWalletData();
    }
    onExport = () => {
        this.setState({ openCsvModal: true }, () => this.getWalletData(true));
      };

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

    getWalletData=async (isExportToCsv=false)=>{
        try{
            await this.loader.show()
            const {page,sortOrder,sorterCol,limit,searchData,rangeDate,coin_code}=this.state;
            let start_date=rangeDate?moment(rangeDate[0]).toISOString():"",end_date=rangeDate?moment(rangeDate[1]).toISOString():"";
            let res=await (await (isExportToCsv?ApiUtils.walletDashboard(this.props.token).getWalletDetailByName("",1,EXPORT_LIMIT_SIZE,"created_at","descend","","","",4):ApiUtils.walletDashboard(this.props.token).getWalletDetailByName(coin_code,page,limit,sorterCol,sortOrder,searchData,start_date,end_date,4))).json();
            let [{status,walletValue,err,message,tradeCount},logout]=[res,this.props.logout];
            if(status==200){
                if(isExportToCsv){
                    this.setState({csvData:walletValue})
                }else{
                    this.setState({walletValue,count:tradeCount});
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
    render() { 
        const [{loader,walletValue,count,limit,page,searchData,rangeDate,coin_code,assetsList,csvData,openCsvModal},pageSizeOptions] =[this.state,PAGE_SIZE_OPTIONS];
        return (
            <>
                    <ExportToCSVComponent
                        isOpenCSVModal={openCsvModal}
                        onClose={() => {
                            this.setState({ openCsvModal: false });
                        }}
                        filename="forfeit_wallet"
                        data={csvData}
                        header={exportForfietFund}
                    />
                   <TableDemoStyle className="isoLayoutContent">
                        <Form onSubmit={(e)=>{e.preventDefault();this.getWalletData();}}> 
                        <PageCounterComponent page={page} limit={limit} dataCount={count} syncCallBack={()=>{this.setState({rangeDate:"",searchData:"",coin_code:this.props.match.params.coin,transaction_type:undefined},()=>this.getWalletData())}}/>
                            <Row justify="start" type="flex" className="table-filter-row">
                                <Col xs={12} md={6}>
                                    <Input placeholder="Search" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                                </Col>
                                <Col xs={12} md={5}>
                                    <Tooltip title=" Account Deleted Start and End Date"><RangePicker format="YYYY-MM-DD" value={rangeDate}  onChange={(date)=>this.setState({rangeDate:date})}/></Tooltip>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                        <Option value="">All</Option>
                                        {assetsList.map((ele)=><Option key={ele.key} value={ele.value}><span><img className="small-icon-img" src={S3BucketImageURL+ele.icon}/>&nbsp;{ele.name}</span></Option>)}
                                    </Select>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Button type="primary" icon="search" className="filter-btn btn-full-width" htmlType="submit">Search</Button>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={()=>{this.setState({rangeDate:"",searchData:"",coin_code:this.props.match.params.coin},()=>this.getWalletData())}}>Reset</Button>
                                </Col>
                                <Col xs={12} md={3}>
                                    <Button type="primary" icon="export" onClick={this.onExport} className="filter-btn btn-full-width">Export</Button>
                                </Col>
                            </Row>
                        </Form>
                        <TableWrapper
                            rowKey="id"
                            {...this.state}
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
    }),{ ...authAction})(WalletForfeitDetailsComponent))
 
