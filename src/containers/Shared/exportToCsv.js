import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Button, Row, Col, Tooltip, Icon } from "antd";
import { CSVLink } from "react-csv";
import clone from "clone";
// import { Select } from "antd";
import {
  DateTimeCell,
  PrecisionCell
} from "../../components/tables/helperCells";
// const { Option } = Select;
const ExportToCSVComponent = props => {
  // let [columns,setColumns]=useState([])
  let [isOpen, setIsOpen] = useState(props.isOpenCSVModal);
  let [csvData, setCSVData] = useState(props.data);
  let [csvHeader, setCSVHeader] = useState(clone(props.header));
  // let [csvSearchHeader,setSearchCSVHeader]=useState(props.header);

  const closeModel = () => {
    props.onClose();
  };

  useEffect(() => { 
    setCSVData(props.data);
    // setCSVHeader(props.header);
    setIsOpen(props.isOpenCSVModal);
  }, [props]);

  const onCheckedChange = (e, index) => {
    let data = csvHeader.slice();
    if (index != -1) {
      data[index]["checked"] = e.target.checked;
    }
    setCSVHeader(data);
    // setSearchCSVHeader(data);
  };

  const checkAll = () => {
    let data = csvHeader.map(ele => {
      ele["checked"] = true;
      return ele;
    });
    setCSVHeader(data);
    // setSearchCSVHeader(data);
  };

  const unCheckAll = () => {
    let data = csvHeader.map(ele => {
      ele["checked"] = false;
      return ele;
    });
    setCSVHeader(data);
    // setSearchCSVHeader(data);
  };

  const formatedData = () => {
    let data = csvData.map(ele => {
      if (ele["updated_at"]) {
        ele["updated_at"] = DateTimeCell(ele["updated_at"], "string");
      }
      if (ele["created_at"]) {
        ele["created_at"] = DateTimeCell(ele["created_at"], "string");
      }
      if (ele["transact_time"]) {
        ele["transact_time"] = DateTimeCell(ele["transact_time"], "string");
      }
      if (ele["deleted_at"]) {
        ele["deleted_at"] = DateTimeCell(ele["deleted_at"], "string");
      }
      if (ele["amount"]) {
        ele["amount"] = PrecisionCell(ele["amount"], "string");
      }
      if (ele["estimated_network_fees"]) {
        ele["estimated_network_fees"] = PrecisionCell(
          ele["estimated_network_fees"],
          "string"
        );
      }
      if (ele["actual_network_fees"]) {
        ele["actual_network_fees"] = PrecisionCell(
          ele["actual_network_fees"],
          "string"
        );
      }
      if (ele["actual_amount"]) {
        ele["actual_amount"] = PrecisionCell(ele["actual_amount"], "string");
      }
      if (ele["residual_amount"]) {
        ele["residual_amount"] = PrecisionCell(
          ele["residual_amount"],
          "string"
        );
      }
      if (ele["execution_report"]) {
        ele["execution_report"] = JSON.stringify(ele["execution_report"]);
      }
      if (ele["last_login_datetime"]) {
        ele["last_login_datetime"] = PrecisionCell(
          ele["last_login_datetime"],
          "string"
        );
      }
      if (ele["deleted_by"]) {
        ele["deleted_by"] = ele["deleted_by"] == 1 ? "User" : "Admin";
      }
      if (ele["id_type"]) {
        ele["id_type"] =
          ele["id_type"] == 1
            ? "Password"
            : ele["id_type"] == 2
            ? "Driving License"
            : ele["id_type"] == 3
            ? "Identity"
            : "Social Security Number";
      }
      if (ele["account_tier"]) {
        ele["account_tier"] = "Tier " + ele["account_tier"];
      }
      if (ele["collected_amount"]) {
        ele["collected_amount"] = JSON.stringify(ele["collected_amount"]);
      }
      return ele;
    });
    setCSVData(data);
  };

  return (
    <>
      <Modal
        title="Export To CSV"
        visible={isOpen}
        style={{ top: 5 }}
        onCancel={() => closeModel()}
        footer={[
          <CSVLink
            filename={props.filename}
            data={csvData}
            onClick={formatedData}
            headers={csvHeader.filter(ele => ele.checked)}
          >
            <Button className="filter-btn btn-full-width" type="primary">
              <Icon type="export"></Icon>Export
            </Button>
          </CSVLink>
        ]}
      >
        <Row className="table-filter-row">
          <Col md={12}>
            <Tooltip>
              <Button
                className="full-width"
                onClick={() => {
                  checkAll();
                }}
              >
                <Icon type="check-square" theme="filled" /> Check All
              </Button>
            </Tooltip>{" "}
          </Col>
          <Col md={12}>
            <Tooltip>
              <Button
                className="full-width"
                onClick={() => {
                  unCheckAll();
                }}
              >
                <Icon type="check-square" theme="filled" /> Uncheck All
              </Button>
            </Tooltip>{" "}
          </Col>
          {/* <Row> */}
          {/* <Col> */}
          {/* <Select
                mode="multiple"
                labelInValue
                // value={value}
                placeholder="Select Fields"
                filterOption={false}
                onSearch={searchField}
                showSearch
                // onChange={this.handleChange}
                style={{ width: '100%' }}
            >
                {csvSearchHeader.map((data) => {
                    return <>{data.checked && <Option key={data.label}>{data.label}</Option>}</>
                })
                }
            </Select> */}
          {/* </Col> */}
          {/* </Row> */}
        </Row>
        <div className="csvContainer">
          <Row>
            {csvHeader.map((data, index) => (
              <Col span={12} key={index}>
                <Checkbox
                  checked={data.checked}
                  value={data.checked}
                  onChange={e => {
                    onCheckedChange(e, index);
                  }}
                >
                  <span className="camel-case">{data.label}</span>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};

export { ExportToCSVComponent };
