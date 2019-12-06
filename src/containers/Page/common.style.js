import styled from "styled-components";
import { Col } from "antd";

const ColWithPadding = styled(Col)`
  padding: 0px 10px !important;
  margin-bottom: 15px;
  &:first-child {
    padding-left: 0px !important;
  }
  @media only screen and (device-width: 575px),
    only screen and (max-width: 575px) {
    & {
      padding: 0px !important;
    }
  }
`;

export const ColWithMarginBottom=styled(Col)`
  margin-bottom:15px;
  padding:0 5px;
`;

export const ExecutionUl = styled.ul`
  max-height: 350px;
  overflow: auto;
  > li {
    display: flex;
    width: 100%;
    margin: 0px 0px 5px;
    > span.ex_head {
        width: 20%;
        display: flex;
    }
    > span.ex_data {
        word-break: break-all;
        white-space: pre-line;
        width: 80%;
        display: flex;
    }
  }
`;

export default ColWithPadding;
