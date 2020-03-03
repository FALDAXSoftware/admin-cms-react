import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link, withRouter } from 'react-router-dom';
import { Layout } from 'antd';
import options from './options';
import Scrollbars from '../../components/utility/customScrollBar.js';
import Menu from '../../components/uielements/menu';
import IntlMessages from '../../components/utility/intlMessages';
import SidebarWrapper from './sidebar.style';
import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;

const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }


  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }

  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }

  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  getMenuItem = ({ singleOption, submenuStyle, submenuColor }) => {
    const { key, label, leftIcon, children } = singleOption;
    const url = stripTrailingSlash(this.props.url);
    // const {pathname}=this.props.location;
    // const urlReg=new RegExp(url+"/"+key,'ig')
    if (children) {
      return (
        <SubMenu
          key={key}
          title={
            <span className="isoMenuHolder" style={submenuColor}>
              <i className={leftIcon} />
              <span className="nav-text">
                <IntlMessages id={label} />
              </span>
            </span>
          }
        >
          {children.map(child => {
            const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `${url}/${child.key}`;
            return (
              <Menu.Item style={submenuStyle} key={child.key}>
                <Link style={submenuColor} to={linkTo}>
                  <IntlMessages id={child.label} />
                </Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      );
    }
    let buildKey=key?(url+"/"+key):url;
    return (
      <Menu.Item key={buildKey}>
        <Link to={buildKey}>
          <span className="isoMenuHolder" style={submenuColor}>
            <i className={leftIcon} />
            <span className="nav-text">
              <IntlMessages id={label} />
            </span>
          </span>
        </Link>
      </Menu.Item>
    );
  };
  isModulePermited = (permissions) => {
    if (this.props.user && this.props.user.roleAllowedData) {
      for (let index = 0; index < this.props.user.roleAllowedData.length; index++) {
        const role = this.props.user.roleAllowedData[index];
        for (let index = 0; index < permissions.length; index++) {
          const permission = permissions[index];
          if (role.module_name == permission) {
            return true
          }
        }
      }
      return false
    } else {
      return false
    }
  }
  // this.props.user.roleAllowedData
  render() {
    const { app, toggleOpenDrawer, customizedTheme, height, roles, location } = this.props;

    let that = this;
    let rolesArray = [];
    for (let key in roles.roles) {
      rolesArray.push({ module: key, value: roles.roles[key] });
    }

    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';

    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };

    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };

    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuStyle = {
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: customizedTheme.textColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };

    let rolesModuleArray = [];
    rolesArray.map(role => {
      if (role.value == true) {
        rolesModuleArray.push(role.module)
      }
    });

    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="265"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars style={{ height: height - 70 }}>
            <Menu
              onClick={this.handleClick}
              theme="dark"
              className="isoDashboardMenu"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={[location.pathname]}
              onOpenChange={this.onOpenChange}
            >
              {
                options.map(singleOption => {
                  if (singleOption.permssions) {
                    if (this.isModulePermited(singleOption.permssions)) {
                      return (
                        that.getMenuItem({ submenuStyle, submenuColor, singleOption })
                      )
                    }
                  } else {
                    return (
                      that.getMenuItem({ submenuStyle, submenuColor, singleOption })
                    )
                  }
                }
                )
              }
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    user: state.Auth.get("user"),
    app: state.App.toJS(),
    customizedTheme: state.ThemeSwitcher.toJS().sidebarTheme,
    height: state.App.toJS().height,
    roles: state.Auth.get('roles'),
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(withRouter(Sidebar));
