import React, { Component } from "react";
import {
  Input,
  Tabs,
  Pagination,
  Icon,
  Button,
  Modal,
  notification
} from "antd";
import { assetTableInfos } from "../../Tables/antTables";
import ApiUtils from "../../../helpers/apiUtills";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import TableWrapper from "../../Tables/antTables/antTable.style";
import { connect } from "react-redux";
import ViewCoinModal from "./viewCoinModal";
import AddCoinModal from "./addCoinModal";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import { PAGE_SIZE_OPTIONS, PAGESIZE } from "../../../helpers/globals";
import { isAllowed } from '../../../helpers/accessControl';
import AssetsMetabase from "./assetsMetabase";

const Search = Input.Search;
const TabPane = Tabs.TabPane;
const { logout } = authAction;
var self;

class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCoins: [],
      allCoinCount: 0,
      showAddCoinModal: false,
      showViewCoinModal: false,
      showDeleteCoinModal: false,
      searchCoin: "",
      limit: PAGESIZE,
      coinDetails: [],
      deleteCoinId: "",
      errMessage: "",
      errMsg: false,
      errType: "Success",
      page: 1,
      loader: false
    };
    self = this;
    Assets.view = Assets.view.bind(this);
    Assets.edit = Assets.edit.bind(this);
    Assets.deleteCoin = Assets.deleteCoin.bind(this);
    Assets.changeStatus = Assets.changeStatus.bind(this);
    Assets.assetWallet = Assets.assetWallet.bind(this);
  }

  static view(
    value,
    coin_name,
    coin_code,
    min_limit,
    max_limit,
    wallet_address,
    created_at,
    is_active,
    isERC,
    coin_icon,
    warm_wallet_address,
    hot_send_wallet_address,
    hot_receive_wallet_address,
    custody_wallet_address
  ) {
    let coinDetails = {
      value,
      coin_name,
      coin_code,
      min_limit,
      max_limit,
      wallet_address,
      created_at,
      is_active,
      isERC,
      coin_icon,
      warm_wallet_address,
      hot_send_wallet_address,
      hot_receive_wallet_address,
      custody_wallet_address
    };
    self.setState({ coinDetails, showViewCoinModal: true });
  }

  static edit(value) {
    self.props.history.push("/dashboard/assets/edit-asset/" + value);
  }

  static changeStatus(
    value,
    coin_name,
    coin_code,
    min_limit,
    max_limit,
    wallet_address,
    created_at,
    is_active
  ) {
    const { token } = this.props;

    let formData = {
      coin_id: value,
      is_active: !is_active
    };

    self.setState({ loader: true });
    let message = is_active
      ? "Asset has been inactivated successfully."
      : "Asset has been activated successfully.";
    ApiUtils.editCoin(token, formData)
      .then(res => res.json())
      .then(res => {
        if (res.status == 200) {
          self.setState({
            page: 1,
            errMsg: true,
            errMessage: message,
            errType: "Success",
            loader: false
          });
          self._getAllCoins();
        } else if (res.status == 403) {
          self.setState(
            {
              errMsg: true,
              errMessage: res.err,
              errType: "error",
              loader: false
            },
            () => {
              self.props.logout();
            }
          );
        } else {
          self.setState({
            errMsg: true,
            errMessage: "Something went wrong!!",
            errType: "error",
            loader: false
          });
        }
      })
      .catch(() => {
        self.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  }

  static deleteCoin(value) {
    self.setState({ showDeleteCoinModal: true, deleteCoinId: value });
  }

  static assetWallet(value, coin_name, coin_code) {
    self.props.history.push("/dashboard/assets/wallet/" + coin_code);
  }

  componentDidMount = () => {
    this._getAllCoins();
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _getAllCoins = () => {
    const { token } = this.props;
    const { limit, searchCoin, page, sorterCol, sortOrder } = this.state;
    let _this = this;

    _this.setState({ loader: true });
    ApiUtils.getAllCoins(page, limit, token, searchCoin, sorterCol, sortOrder)
      .then(response => response.json())
      .then(function (res) {
        if (res.status == 200) {
          _this.setState({ allCoins: res.data, allCoinCount: res.CoinsCount });
        } else if (res.status == 403) {
          _this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              _this.props.logout();
            }
          );
        } else {
          _this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
        }
        _this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          errMsg: true,
          errMessage: "Something went wrong!!",
          errType: "error",
          loader: false
        });
      });
  };

  _searchCoin = val => {
    this.setState({ searchCoin: val, page: 1 }, () => {
      this._getAllCoins();
    });
  };

  _handleCoinPagination = page => {
    this.setState({ page }, () => {
      this._getAllCoins();
    });
  };

  _showAddCoinModal = () => {
    this.setState({ showAddCoinModal: true });
  };

  _closeViewCoinModal = () => {
    this.setState({ showViewCoinModal: false });
  };

  _closeAddCoinModal = () => {
    this.setState({ showAddCoinModal: false });
  };

  _deleteCoin = () => {
    const { token } = this.props;
    const { deleteCoinId } = this.state;
    let _this = this;

    this.setState({ loader: true });
    ApiUtils.deleteCoin(deleteCoinId, token)
      .then(response => response.json())
      .then(function (res) {
        if (res) {
          if (res.status == 200) {
            _this.setState(
              {
                deleteCoinId: "",
                showDeleteCoinModal: false,
                errMessage: res.message,
                errMsg: true
              },
              () => {
                _this._getAllCoins();
              }
            );
          } else if (res.status == 403) {
            _this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                _this.props.logout();
              }
            );
          } else {
            _this.setState({
              errMsg: true,
              errMessage: res.message,
              errType: "error"
            });
          }
        } else {
          _this.setState({ deleteCoinId: "", showDeleteCoinModal: false });
        }
        this.setState({ loader: false });
      })
      .catch(() => {
        _this.setState({
          deleteCoinId: "",
          showDeleteCoinModal: false,
          loader: false
        });
      });
  };

  _closeDeleteCoinModal = () => {
    this.setState({ showDeleteCoinModal: false });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      { sorterCol: sorter.columnKey, sortOrder: sorter.order, page: 1 },
      () => {
        this._getAllCoins();
      }
    );
  };

  _changeRow = e => {
    e.preventDefault();
  };

  _changePaginationSize = (current, pageSize) => {
    this.setState({ page: current, limit: pageSize }, () => {
      this._getAllCoins();
    });
  };

  render() {
    const {
      allCoins,
      allCoinCount,
      showAddCoinModal,
      coinDetails,
      errType,
      loader,
      showViewCoinModal,
      showDeleteCoinModal,
      errMsg,
      page,
      limit
    } = this.state;
    let pageSizeOptions = PAGE_SIZE_OPTIONS;

    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <LayoutWrapper>
        <Tabs className="isoTableDisplayTab full-width">
          {assetTableInfos.map(tableInfo => (
            <TabPane tab={tableInfo.title} key={tableInfo.value}>
              <TableDemoStyle className="isoLayoutContent">
                {isAllowed("create_coins") && (
                  <Button
                    type="primary"
                    style={{ marginBottom: "15px", float: "left" }}
                    onClick={this._showAddCoinModal}
                  >
                    <Icon type="plus" />
                    Add Asset
                  </Button>
                )}
                <AddCoinModal
                  showAddCoinModal={showAddCoinModal}
                  closeAddModal={this._closeAddCoinModal}
                  getAllCoins={this._getAllCoins.bind(this, 1)}
                />
                <Search
                  placeholder="Search assets"
                  onSearch={value => this._searchCoin(value)}
                  style={{
                    marginBottom: "15px",
                    float: "right",
                    width: "250px"
                  }}
                  enterButton
                />

                {loader && <FaldaxLoader />}
                <div className="float-clear">
                  <ViewCoinModal
                    coinDetails={coinDetails}
                    showViewCoinModal={showViewCoinModal}
                    closeViewCoinModal={this._closeViewCoinModal}
                  />
                  {showDeleteCoinModal && (
                    <Modal
                      title="Delete Asset"
                      visible={showDeleteCoinModal}
                      onCancel={this._closeDeleteCoinModal}
                      footer={[
                        <Button onClick={this._closeDeleteCoinModal}>
                          No
                        </Button>,
                        <Button onClick={this._deleteCoin}>Yes</Button>
                      ]}
                    >
                      Are you sure you want to delete this asset ?
                    </Modal>
                  )}
                  <TableWrapper
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: () => {
                          this._changeRow.bind(this);
                        }
                      };
                    }}
                    {...this.state}
                    columns={tableInfo.columns}
                    pagination={false}
                    dataSource={allCoins}
                    onChange={this.handleTableChange}
                    className="isoCustomizedTable"
                  />
                  {allCoinCount > 0 ? (
                    <Pagination
                      style={{ marginTop: "15px" }}
                      className="ant-users-pagination"
                      onChange={this._handleCoinPagination.bind(this)}
                      pageSize={limit}
                      current={page}
                      total={allCoinCount}
                      showSizeChanger
                      onShowSizeChange={this._changePaginationSize}
                      pageSizeOptions={pageSizeOptions}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </TableDemoStyle>
            </TabPane>
          ))}
          {isAllowed("metabase_asset_report") && (
            <TabPane tab="Metabase-Assets Management" key="metabase">
              <TableDemoStyle>
                <AssetsMetabase></AssetsMetabase>
              </TableDemoStyle>
            </TabPane>
          )}
        </Tabs>
      </LayoutWrapper>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(Assets);

export { Assets, assetTableInfos };
