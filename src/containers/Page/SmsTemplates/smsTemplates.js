import React, { Component } from "react";
import { Tabs, notification } from "antd";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { withRouter } from "react-router";
// import { BackButton } from "../../Shared/backBttton";
// import { TABLE_SCROLL_HEIGHT } from "../../../helpers/globals";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import { smstemplateTableinfos } from "../../Tables/antTables/smstemplateconfig";

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class SmsTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTemplates: [],
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false,
    };
    self = this;
    SmsTemplates.editSmsTemplate = SmsTemplates.editSmsTemplate.bind(this);
  }

  static editSmsTemplate(value) {
    self.props.history.push(
      "/dashboard/sms-templates/edit-sms-template/" + value
    );
  }

  static viewSmsTemplate(value) {
    self.props.history.push({
      pathname: "/dashboard/sms-templates/edit-sms-template/" + value,
      state: { isReadOnly: true },
    });
  }

  componentDidMount = () => {
    this._getAllTemplates();
  };

  openNotificationWithIconError = (type) => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage,
    });
    this.setState({ errMsg: false });
  };

  _getAllTemplates = () => {
    const { token } = this.props;
    const {} = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllSMSTemplates(token)
      .then((response) => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allTemplates: res.data });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({ errMsg: true, errMessage: res.message });
        }
        _this.setState({ loader: false });
      })
      .catch((err) => {
        _this.setState({
          errType: "error",
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          loader: false,
        });
      });
  };

  render() {
    const { allTemplates, errType, errMsg, loader } = this.state;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <BreadcrumbComponent {...this.props}></BreadcrumbComponent>
        <Tabs className="isoTableDisplayTab full-width">
          <TabPane
            tab={smstemplateTableinfos[0].title}
            key={smstemplateTableinfos[0].value}
          >
            <TableDemoStyle className="isoLayoutContent">
              <div>
                <TableWrapper
                  {...this.state}
                  rowKey="id"
                  columns={smstemplateTableinfos[0].columns}
                  pagination={false}
                  dataSource={allTemplates}
                  className="isoCustomizedTable"
                  // scroll={TABLE_SCROLL_HEIGHT}
                  bordered
                />
              </div>
            </TableDemoStyle>
          </TabPane>
        </Tabs>
        {loader && <FaldaxLoader />}
      </LayoutWrapper>
    );
  }
}

export default withRouter(
  connect(
    (state) => ({
      token: state.Auth.get("token"),
    }),
    { logout }
  )(SmsTemplates)
);

export { SmsTemplates, smstemplateTableinfos };
