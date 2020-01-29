import React, { Component } from 'react'
import IdleTimer from 'react-idle-timer'
import {connect} from "react-redux"
import actions from "./../../redux/auth/actions"
import { SYSTEM_IDLE_TIME, THROTTLING } from '../../helpers/globals';
import { notification } from 'antd';
class IdleTimerComponent extends Component {
  constructor(props) {
    super(props)
    this.idleTimer = null
    // this.onAction = this._onAction.bind(this)
    // this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)
  }
 
  render() {
    return (
      <div>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
        //   onActive={this.onActive}
          onIdle={this.onIdle}
        //   onAction={this.onAction}
          throttle={THROTTLING}
          timeout={SYSTEM_IDLE_TIME}/>
        {/* your app here */}
      </div>
    )
  }
 
//   _onAction(e) {
//     console.log('user did something', e)
//   }
 
//   _onActive(e) {
//     console.log('user is active', e)
//     console.log('time remaining', this.idleTimer.getRemainingTime())
//   }

    showSessionExpiredToast(){
        notification["error"]({
            message:"Error",
            description:"Your session has expired due to inactivity, please login again to continue"
        });
    }
    
    _onIdle(e) {
        this.showSessionExpiredToast();
        this.props.logout();
    }
}

export default connect(undefined,{...actions})(IdleTimerComponent);