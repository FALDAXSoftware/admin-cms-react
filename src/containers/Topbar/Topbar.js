import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Icon } from 'antd';
import appActions from '../../redux/app/actions';
import TopbarUser from './topbarUser';
import TopbarWrapper from './topbar.style';

const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends Component {
  render() {
    const { toggleCollapsed, customizedTheme, locale } = this.props;
    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 70
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen mg-left-30'
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggleCollapsed}
            />
          </div>
          {this.props.selectedTabInfo &&<div><p className="toolbar-header-text"><span className="header-title"><Icon type="user"/>&nbsp;&nbsp;{this.props.selectedTabInfo.full_name}</span>
          <br/><span className="sub-header-title"><Icon type="mail"/>&nbsp;&nbsp;{this.props.selectedTabInfo.email}</span>
          </p></div>}
          <ul className="isoRight">
            <li
              onClick={() => this.setState({ selectedItem: 'user' })}
              className="isoUser"
            >
              <TopbarUser locale={locale} />
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  state => ({
    ...state.App.toJS(),
    locale: state.LanguageSwitcher.toJS().language.locale,
    customizedTheme: state.ThemeSwitcher.toJS().topbarTheme,
    selectedTabInfo:state.SelectedTabInfo.get('userData')?(window.location.pathname.search(/\/dashboard\/users\//gi)!=-1?state.SelectedTabInfo.get('userData'):false):false
  }),
  { toggleCollapsed }
)(Topbar);
