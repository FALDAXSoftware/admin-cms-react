import React,{useState,useEffect} from 'react';
import { Modal, Checkbox, Button,Row,Col, Tooltip, Icon, Spin } from 'antd';
import { CSVLink } from "react-csv";
import { Select } from 'antd';
const { Option } = Select;
const ExportToCSVComponent=(props)=>{
    let [columns,setColumns]=useState([])
    let [isOpen,setIsOpen]=useState(props.isOpenCSVModal);
let [csvData,setCSVData]=useState(props.data);
let [csvHeader,setCSVHeader]=useState(props.header);
let [csvSearchHeader,setSearchCSVHeader]=useState(props.header);

const closeModel=()=>{
    setIsOpen(false);
}
useEffect(() => {
    setCSVData(props.data);
    setIsOpen(props.isOpenCSVModal);
  }, [props]);

const onCheckedChange=(e,index)=>{
    let data=csvHeader.slice();
    if(index!=-1){
        data[index]["checked"]=e.target.checked;
    }
    setCSVHeader(data);
    setSearchCSVHeader(data);
}

const checkAll=()=>{
  let data=csvHeader.map((ele)=>{
        ele["checked"]=true;
        return ele;
    })
    setCSVHeader(data)
    setSearchCSVHeader(data);
}

const unCheckAll=()=>{
    let data=csvHeader.map((ele)=>{
          ele["checked"]=false;
          return ele;
      })
      setCSVHeader(data);
      setSearchCSVHeader(data);
  }

const searchField=(e)=>{
    console.log(e);
}

return (
  <>
    <Modal
      title="Export To CSV"
      visible={isOpen}
      style={{ top: 5 }}
      onCancel={() => closeModel()}
      footer={[ <CSVLink filename={props.filename} data={csvData} headers={csvHeader.filter((ele)=>ele.checked)}>
      <Button className="filter-btn btn-full-width" type="primary"><Icon type="export"></Icon>Export</Button>
  </CSVLink>]}
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
          <Row>
          <Col>
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
          </Col>
          </Row>
        </Row>
      <div className="csvContainer">
        <Row>
          {csvHeader.map((data, index) => (
             <Col span={12} key={index}>
              <Checkbox
               checked={data.checked}
               value={data.checked}
               onChange={e => {
                   onCheckedChange(e,index);
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
}

export {ExportToCSVComponent}

