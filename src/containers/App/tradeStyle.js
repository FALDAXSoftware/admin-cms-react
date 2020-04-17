import styled from "styled-components";
import { Row, Tabs, Table } from "antd";

export const TradeRow = styled(Row)`
  width: 100%;
  display: inline-flex !important;
  & .ant-tabs-tab-active.ant-tabs-tab {
    border-bottom: 3px solid;
  }
  & .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
    display: none !important;
  }
  & .ant-tabs-nav {
    display: flex;
    width: 100%;
    justify-content: space-around;
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      > .ant-tabs-tab {
        margin: 0;
      }
    }
  }
`;
export const InnerTabs = styled(Tabs)`
  & .ant-tabs-content {
    margin: 20px 0 0 0;
  }
  & .ant-tabs-bar.ant-tabs-top-bar {
    width: 30%;

    text-align: left;
    & .ant-tabs-nav {
      > div {
        & .ant-tabs-tab-active.ant-tabs-tab {
          border: 0;
          background: #1890ff;
          color: #fff;
        }
        & .ant-tabs-tab {
          width: 50%;
          text-align: center;
          border: 1px solid #cad0e6;
          padding: 6px 10px;
        }
      }
    }
  }
  & .action-btn {
    text-align: left;
    margin: 24px 0 0 0;
    & input {
      background: #1890ff;
      border: 1px solid #1890ff;
      color: #fff;
      padding: 5px 20px;
      border-radius: 4px;
      width: 20% !important;
    }
  }
`;
export const InputRow = styled(Row)`
  > .ant-col {
    > label {
      width: 100%;
      display: block;
      font-weight: bold;
      margin: 0 0 5px 0;
    }
  }
`;
export const TradeHeadRow = styled(Row)`
  margin: 0 0 10px 0;
  & label {
    font-weight: bold;
    color: #1890ff;
    text-transform: uppercase;
  }
  > .ant-col.text-right {
    text-align: right;
  }
`;
export const TradeTable = styled(Table)`
  & .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 5px 16px;
  }
  & .ant-table-tbody > tr:nth-child(even) > td {
    background-color: #f1f3f6 !important;
  }
`;
