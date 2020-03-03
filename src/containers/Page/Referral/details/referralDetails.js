import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input, Button, Select, Tooltip } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT, EXPORT_LIMIT_SIZE } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
// import { BackButton } from '../../../Shared/backBttton';
import { DateTimeCell } from '../../../../components/tables/helperCells';
import { BreadcrumbComponent } from '../../../Shared/breadcrumb';
import { PageCounterComponent } from '../../../Shared/pageCounter';
import { ExportToCSVComponent } from '../../../Shared/exportToCsv';
import { exportReferralDetails } from '../../../../helpers/exportToCsv/headers';
var self;
const {Option}=Select;
const columns=[
    {
        title:<IntlMessages id="ReferralDetailsTable.title.tx_date"/>,
        key:4,
        ellipsis:true,
        dataIndex:"updated_at",
        width:150,
        render:(date)=>DateTimeCell(date)
    },
    {
        title:<IntlMessages id="ReferralDetailsTable.title.amount"/>,
        key:5,
        ellipsis:true,
        dataIndex:"amount",
        width:150,
    },
    {
        title:<IntlMessages id="ReferralDetailsTable.title.email"/>,
        key:1,
        ellipsis:true,
        dataIndex:"email",
        width:250,
        render:data=><span><Tooltip title={data} autoAdjustOverflow={true}><p className="text-ellipsis">{data}</p></Tooltip></span>
    },
    {
        title:<IntlMessages id="ReferralDetailsTable.title.txid"/>,
        key:0,
        ellipsis:true,
        dataIndex:"txid",
        width:150,
        render:data=><a onClick={()=>self.props.history.push({pathname:"/dashboard/trade-history",state:{"orderId":data+""}})}>{data}</a>
    },   
]
class ReferralDetailsComponent extends Component {
    constructor(props){
        super(props)
        this.state={openCsvModal:false,csvData:[],loader:false,data:[],count:0,searchData:"",coin_code:"",assetsList:[],page:1,limit:PAGESIZE,userId:""}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
    }

    componentDidMount(){
        this.setState({coin_code:this.props.match.params.coin_code,userId:this.props.match.params.id,assetsList:this.props.location.state.assets})
        this.getReferralDetails();
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
              this.getReferralDetails();
            }
          );
    };

    changePaginationSize = (current, pageSize) => {
        this.setState({ page: current, limit: pageSize }, () => {
            this.getReferralDetails();
        });
    };

    handlePagination = page => {
        this.setState({ page }, () => {
         this.getReferralDetails();
        });
    };

    getReferralDetails=async (isExportToCsv=false)=>{
        try{
            await this.loader.show()
            const {coin_code,searchData,userId,page,limit}=this.state;
            let res=await (await (isExportToCsv?ApiUtils.getUserReferData(this.props.token,"",userId,1,EXPORT_LIMIT_SIZE,""):ApiUtils.getUserReferData(this.props.token,coin_code,userId,page,limit,searchData,))).json();
            let [{status,data,err,count},logout]=[res,this.props.logout];
            if(status==200){
                if(isExportToCsv)
                this.setState({csvData:data})
                else
                this.setState({data,count:count});
            }else if(status==400 || status==403){
                this.openNotificationWithIcon("Error",err)
                logout();
            }else{
                this.openNotificationWithIcon("Error",err)
            }
        }catch(error){
            this.openNotificationWithIcon("Error", "Unable to complete the requested action.");
        }finally{
            this.loader.hide();
        }
    }
    render() { 
        const [{loader,csvData,openCsvModal,data,count,limit,page,searchData,coin_code,assetsList},pageSizeOptions] =[this.state,PAGE_SIZE_OPTIONS];
        return (
                <LayoutWrapper>
                     <ExportToCSVComponent
              isOpenCSVModal={openCsvModal}
              onClose={() => {
                this.setState({ openCsvModal: false });
              }}
              filename="referral_details.csv"
              data={csvData}
              header={exportReferralDetails}
            />
                    {/* <BackButton {...this.props}></BackButton> */}
                    <BreadcrumbComponent {...this.props}/>
                    <TableDemoStyle className="isoLayoutContent">
                    <PageCounterComponent page={page} limit={limit} dataCount={count} syncCallBack={()=>{this.setState({searchData:"",coin_code:this.props.match.params.coin_code},()=>this.getReferralDetails())}}/>
                        <Row justify="start" type="flex" className="table-filter-row">
                            <Col xs={24} md={8}>
                                <Input placeholder="Search email" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                            </Col>
                            <Col xs={24} md={7}>
                                <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                    {assetsList.map((ele)=><Option key={ele} value={ele}>{ele}</Option>)}
                                </Select> 
                            </Col>
                            <Col xs={24} md={3}>
                                <Button type="primary" icon="search" className="filter-btn btn-full-width" onClick={()=>this.getReferralDetails()}>Search</Button>
                            </Col>
                            <Col xs={24} md={3}>
                                <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={()=>{this.setState({searchData:"",coin_code:this.props.match.params.coin_code},()=>this.getReferralDetails())}}>Reset</Button>
                            </Col>
                            <Col xs={24} md={3}>
                                <Button type="primary"
                                icon="export"
                                className="filter-btn full-width"
                                onClick={() => {
                                    this.setState({ openCsvModal: true }, () =>
                                    this.getReferralDetails(true)
                                    );
                                }}
                                >
                                Export
                                </Button>
                            </Col>
                        </Row>
                        <TableWrapper
                            rowKey="updated_at"
                            {...this.state}
                            columns={columns}
                            pagination={false}
                            dataSource={data}
                            className="table-tb-margin"
                            onChange={this.handleTableChange}
                            bordered
                            scroll={TABLE_SCROLL_HEIGHT}
                        />
                        <Pagination
                            className="ant-users-pagination"
                            onChange={this.handlePagination}
                            pageSize={limit}
                            current={page}
                            total={parseInt(count)}
                            showSizeChanger
                            onShowSizeChange={this.changePaginationSize}
                            pageSizeOptions={pageSizeOptions}
                      />
                    {loader && <Loader/>}
                   </TableDemoStyle>
                </LayoutWrapper>
              );
    }
}

export default withRouter(connect(
    state => ({
      token: state.Auth.get("token")
    }),{ ...authAction})(ReferralDetailsComponent))
 
