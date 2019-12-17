import styled from 'styled-components';
import { Card } from 'antd';
import WithDirection from '../../../settings/withDirection';
import React from 'react';

const Wrapper = styled(Card)`
background-color: ${props => props.bgcolor} !important;
border-radius: 10px !important;
overflow: hidden;
min-height: 200px;
color: white;
width: 100%;
box-shadow: 0px 3px 4px 0px rgba(45, 52, 70,0.5);

  & .ant-card-head{
    background-color: ${props => props.headcolor} !important;
    border-bottom: none !important;
  }

  & .ant-card-head-title{
    color: white;
    white-space: pre-line !important;
  }

  & .isoLabel {
    color: #2d3446;
  }

  & .count{
    padding: 5px;
    font-size: 20px;
    color:#2d3446;
    font-weight: bold;
    width: 50px;
    display: inline-block;
  }

  .isoContentWrapper {
    .isoStatNumber {
        padding: 5px;
        font-size: 20px;
        color:#2d3446;
        font-weight: bold;
    }   
  }
`;

const CardWrapper=(props)=>{
  return <Wrapper {...props}/>
}

export default WithDirection(CardWrapper);
