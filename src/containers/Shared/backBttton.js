import React from 'react';
const BackButton=(props)=>(
    <div className="btn-back">
        <a onClick={() => {props.history.goBack()}}><i className="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;&nbsp;Back</a>
  </div>)
export {BackButton}