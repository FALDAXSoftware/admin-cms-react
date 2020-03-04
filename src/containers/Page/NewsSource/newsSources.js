import React, { Component } from "react";
import { Tabs, notification } from "antd";
import { newsSourceTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper.js";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
// import { BackButton } from "../../Shared/backBttton";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";

const { logout } = authAction;
const TabPane = Tabs.TabPane;
var self;

class NewsSources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNewsSources: [],
      errMessage: "",
      errMsg: false,
      errType: "Success",
      loader: false
    };
    NewsSources.newsSourceStatus = NewsSources.newsSourceStatus.bind(this);
    self = this;
  }

  static newsSourceStatus(value, source_name, slug, is_active) {
    const { token } = this.props;
    let formData = {
      id: value,
      status: !is_active
    };

    self.setState({ loader: true },()=>{
      ApiUtils.updateNewsSource(token, formData)
        .then(response => response.json())
        .then(function(res) {
          if (res) {
            self._getAllNewsSources();
            self.setState({
              errMsg: true,
              errMessage: res.message,
              errType: "Success",
              loader: false
            });
          }
          self.setState({ loader: false });
        })
        .catch(err => {
          self.setState({
            errMsg: true,
            errMessage: "Unable to complete the requested action.",
            errType: "error",
            loader: false
          });
        });
    });
  }

  componentDidMount = () => {
    this._getAllNewsSources();
  };

  _getAllNewsSources = () => {
    const { token } = this.props;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllNewsSources(token)
      .then(response => response.json())
      .then(function(res) {
        if (res.status == 200) {
          _this.setState({ allNewsSources: res.data });
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
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Unable to complete the requested action.",
          errType: "error",
          loader: false
        });
      });
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  render() {
    const { allNewsSources, errType, errMsg, loader } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        {/* <BackButton {...this.props}/> */}
        <BreadcrumbComponent {...this.props} />
        <Tabs className="isoTableDisplayTab full-width">
            <TabPane tab={newsSourceTableInfos[0].title} key={newsSourceTableInfos[0].value}>
              <TableDemoStyle className="isoLayoutContent">
                <TableWrapper
                  rowKey="id"
                  {...this.state}
                  columns={newsSourceTableInfos[0].columns}
                  pagination={false}
                  dataSource={allNewsSources}
                  className="isoCustomizedTable"
                  bordered
                />
              </TableDemoStyle>
            </TabPane>
        </Tabs>
        {loader && <FaldaxLoader />}
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(NewsSources);

export { NewsSources, newsSourceTableInfos };
