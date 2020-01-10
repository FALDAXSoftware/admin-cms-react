import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import React from 'react';
const breadcrumbNameMap = {
    '/dashboard/wallet': ' Wallet Dashboard',
    '/dashboard/wallet/faldax/:coin': 'FALDAX Wallet',
    '/dashboard/wallet/warm/:coin': 'Warm Wallet',
    '/dashboard/wallet/custodial/:coin': 'Custodial Wallet',
    '/dashboard/users':" Users",
    '/dashboard/users/add-user':"Add User",
    '/dashboard/users/history/:id':"User Login History",
    '/dashboard/users/:id':"Details",
    '/dashboard/countries':" Countries",
    '/dashboard/countries/:id/states':"States",
    "/dashboard/roles":" Roles",
    "/dashboard/roles/access-grant/:id":"Permissions",
    "/dashboard/employee":" Employees",
    "/dashboard/employee/:id":"Details",
    "/dashboard/transaction-history":" Transaction History",
    "/dashboard/trade-history":" History",
    "/dashboard/withdraw-requests":" Withdrawal Request",
    "/dashboard/jobs":" Careers",
    "/dashboard/jobs/job-applications/:id":"Details",
    "/dashboard/kyc":" Customer ID Verification",
    "/dashboard/fees":" Fees",
    "/dashboard/panic-button":" Penic Button",
    "/dashboard/news":" News",
    "/dashboard/news-source":" News Source",
    "/dashboard/referral":" Affilite Program & Referral",
    "/dashboard/referral/:id":"Details",
    "/dashboard/account-class":" Account Class Management",
    "/dashboard/email-templates":" Email-Templates",
    "/dashboard/two-factor-requests":" 2FA Requests",
    "/dashboard/notifications":" Notifications",
    "/dashboard/key":" Encrypt Key",
    "/dashboard/terms-and-conditions":" Policy Documents",
    "/dashboard/campaign":" Campaign",
    "/dashboard/campaign/:id":"Details",
    "/dashboard/assets":" Assets",
    "/dashboard/assets/edit-asset/:id":"Details",
    "/dashboard/campaign/:campaignId":"Details",
    "/dashboard/campaign/:campaignId/offer-usage/:id":"Usage",
    "/dashboard/campaign/add-campaign":"Create Campaign",
    "/dashboard/campaign/update-campaign/:id":"Update Campaign"
  };


const getUrl=(url,params)=>{
    if(url.search(/:/gi)!=-1){
        let urlParams=url.split("/:")
        urlParams=urlParams.map((ele)=>{
            if(ele.search(/\//gi)==-1){
                ele=params[ele];
            }
            return ele;
        })
        url=urlParams.join("/")
    }
    return url
}  
const  BreadcrumbComponent=({match})=> {
    const pathSnippets = match.path.split('/').filter(i => i);
    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
          <>
          {breadcrumbNameMap[url] &&<Breadcrumb.Item key={breadcrumbNameMap[url]}>
            <Link className="breadcrumb-link" to={getUrl(url,match.params)}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>}</>
        );
      });
    return <Breadcrumb separator="/">{breadcrumbItems}</Breadcrumb>
}


export {BreadcrumbComponent}