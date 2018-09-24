import React, { Component } from 'react';
import { } from 'antd';
import { dataList } from "../Tables/antTables";
import LayoutWrapper from "../../components/utility/layoutWrapper.js";
import ApiUtils from '../../helpers/apiUtills';
import clone from "clone";

const tableDataList = clone(dataList);
tableDataList.size = 5;

class Referral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allReferral: [],
            allReferralCount: 0,
        }
    }

    componentDidMount() {
        //  this._getAllReferral();
    }

    _getAllReferral = () => {
        const { isLoggedIn } = this.props;

        ApiUtils.getAllCount(isLoggedIn)
            .then((response) => response.json())
            .then(function (res) {
                if (res.status === "SUCCESS") {
                    const { allReferral, allReferralCount } = res.data;
                    this.setState({ allReferral, allReferralCount });
                } else {
                    this.setState({ errMsg: true, message: res.message });
                }
            })
            .catch(err => {
                console.log('error occured', err);
            });
    }

    render() {
        const { } = this.state;

        return (
            <LayoutWrapper>
                <span>Affiliate Program & Referrals </span>
            </LayoutWrapper>
        );
    }
}

export default Referral;
