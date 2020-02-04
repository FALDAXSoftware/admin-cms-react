import React, { Component } from 'react';
import ApiUtils from '../../../../helpers/apiUtills';
import authAction from "../../../../redux/auth/actions";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import Loader from "../../faldaxLoader"
import { notification, Pagination, Row,Col,Input,DatePicker, Button, Select, Tooltip } from 'antd';
import IntlMessages from '../../../../components/utility/intlMessages';
import TableDemoStyle from '../../../Tables/antTables/demo.style';
import { PAGE_SIZE_OPTIONS, PAGESIZE, TABLE_SCROLL_HEIGHT } from '../../../../helpers/globals';
import TableWrapper from "../../../Tables/antTables/antTable.style";
import LayoutWrapper from '../../../../components/utility/layoutWrapper';
import { BackButton } from '../../../Shared/backBttton';
import { DateTimeCell } from '../../../../components/tables/helperCells';
import { BreadcrumbComponent } from '../../../Shared/breadcrumb';
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
        this.state={loader:false,data:[],count:0,searchData:"",coin_code:"",assetsList:[],page:1,limit:PAGESIZE,userId:""}
        this.loader={show:()=>this.setState({loader:true}),hide:()=>this.setState({loader:false})};
        self=this;
    }

    componentDidMount(){
        this.setState({coin_code:this.props.match.params.coin_code,userId:this.props.match.params.id,assetsList:this.props.location.state.assets})
        this.getReferralDetails();
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

    getReferralDetails=async ()=>{
        try{
            await this.loader.show()
            const {coin_code,searchData,userId,page,limit}=this.state;
            let res=await (await ApiUtils.getUserReferData(this.props.token,coin_code,userId,page,limit,searchData,)).json();
            let [{status,data,err,count},logout]=[res,this.props.logout];
            if(status==200){
                this.setState({data,count:count});
            }else if(status==400 || status==403){
                this.openNotificationWithIcon("Error",err)
                logout();
            }else{
                this.openNotificationWithIcon("Error",err)
            }
        }catch(error){
            console.error("error",error);
        }finally{
            this.loader.hide();
        }
    }
    render() { 
        const [{loader,data,count,limit,page,searchData,coin_code,assetsList},pageSizeOptions] =[this.state,PAGE_SIZE_OPTIONS];
        return (
                <LayoutWrapper>
                    {/* <BackButton {...this.props}></BackButton> */}
                    <BreadcrumbComponent {...this.props}/>
                
                   <TableDemoStyle className="isoLayoutContent">
                        <Row justify="start" type="flex">
                            <Col className="table-column" xs={12} md={7}>
                                <Input placeholder="Search email" value={searchData} onChange={value => this.setState({searchData:value.target.value})}/>
                            </Col>
                            <Col className="table-column" xs={12} md={4}>
                                <Select className="full-width" value={coin_code} onChange={value => this.setState({coin_code:value})}>
                                    {assetsList.map((ele)=><Option key={ele} value={ele}>{ele}</Option>)}
                                </Select> 
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="search" className="filter-btn btn-full-width" onClick={()=>this.getReferralDetails()}>Search</Button>
                            </Col>
                            <Col className="table-column" xs={12} md={3}>
                                <Button type="primary" icon="reload" className="filter-btn btn-full-width" onClick={()=>{this.setState({searchData:"",coin_code:this.props.match.params.coin_code},()=>this.getReferralDetails())}}>Reset</Button>
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
 
