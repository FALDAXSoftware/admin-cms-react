import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Card } from 'antd';
import WithDirection from '../../../settings/withDirection';

const CardWrapper = styled(Card)`
background-color: ${props => props.bgColor} !important;
border-radius: 10px !important;
overflow: hidden;
color: white;

  & .ant-card-head{
    background-color: ${props => props.headColor} !important;
    border-bottom: none !important;
  }

  & .ant-card-head-title{
    color: white;
  }

  & .isoLabel {
    color: white;
  }

  & .count{
    padding: 5px;
    font-size: 20px;
    color: aliceblue;
    font-weight: bold;
    width: 50px;
    display: inline-block;
  }

  .isoContentWrapper {
    .isoStatNumber {
        padding: 5px;
        font-size: 20px;
        color: aliceblue;
        font-weight: bold;
    }   
  }
`;

export default WithDirection(CardWrapper);
