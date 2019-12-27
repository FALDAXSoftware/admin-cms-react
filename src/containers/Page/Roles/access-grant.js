import React, { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux";
import LayoutWrapper from "../../../components/utility/layoutWrapper"
import TableDemoStyle from "../../Tables/antTables/demo.style"
import { Tabs, Card, Row, Col, Checkbox, Button, notification, Tooltip, Icon, Divider, Select } from "antd"
import ApiUtils from "../../../helpers/apiUtills";
import FaldaxLoader from "../faldaxLoader";
import authAction from '../../../redux/auth/actions';
import { isAllowed } from "../../../helpers/accessControl";
import { BackButton } from "../../Shared/backBttton";
const { logout } = authAction;
const {Option}=Select;

const AccessGrant = (props) => {
    const [permissions, setPermissions] = useState([])
    const [role, setRole] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({
        errType: "",
        errMessage: "",
        showError: false
    })
    const token = useSelector(state => state.Auth.get('token'))
    const dispatch = useDispatch()
    const [selectedPermission,setSelectedPermission]=useState()

    const getRolePermissions = (roleId) => {
        setIsLoading(true)
        ApiUtils.getRolePermissions(token, roleId).then((response) => response.json()).then((res) => {
            window.roles=res.getPermissionData;
            if (res.status == 200) {
                let resPermissions = {}
                res.getPermissionData.map(element => {
                    if (!resPermissions[element.main_module]) {
                        resPermissions[element.main_module] = []
                    }
                    if (res.permission.indexOf(element.id) == -1) {
                        element["isChecked"] = false
                    } else {
                        element["isChecked"] = true
                    }
                    resPermissions[element.main_module].push(element)
                })
                setPermissions(resPermissions)
                setRole(res.roleValue)
            } else if (res.status == 403) {
                setError({
                    errType: "Error",
                    errMessage: res.err,
                    showError: true
                })
                dispatch(logout())
            }
            else {
                setError({
                    errType: "Error",
                    errMessage: res.err,
                    showError: true
                })
            }
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            setError({
                errType: "Error",
                errMessage: "Something went wrong!",
                showError: true
            })
        })
    }
    useEffect(() => {
        getRolePermissions(props.match.params.id)

    }, [props.match.params.id])

    useEffect(() => {
        if (error.showError) {
            notification[error.errType.toLowerCase()]({
                message: error.errType,
                description: error.errMessage
            });
            setError({
                errType: "",
                errMessage: "",
                showError: false
            })
        }
    }, [error])
    const onCheckedChange = (e, main_module, index) => {
        let p = { ...permissions }
        p[main_module][index]["isChecked"] = e.target.checked
        setPermissions(p)
    }
    const refs = Object.keys(permissions).reduce((acc, value) => {
      acc[value] = React.createRef();
      return acc;
    }, {});

    const handleClick = id =>{
      setSelectedPermission(id)
      refs[id].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    
    const savePermissions = () => {
        setIsLoading(true)
        let requestPermissions = []
        Object.keys(permissions).map((key, index) => {
            requestPermissions = requestPermissions.concat(permissions[key])
        })
        let updatePermissionsRequest = {
            permissions: requestPermissions,
            role_id: role.id
        }
        ApiUtils.updatePermissions(token, updatePermissionsRequest)
            .then((response) => response.json())
            .then(res => {
                if (res.status == 200) {
                    setError({
                        errType: "Success",
                        errMessage: res.message,
                        showError: true
                    })
                } else if (res.status == 403) {
                    setError({
                        errType: "Error",
                        errMessage: res.err,
                        showError: true
                    })
                    dispatch(logout())
                } else {
                    setError({
                        errType: "Error",
                        errMessage: res.err,
                        showError: true
                    })
                }
                setIsLoading(false)
            }).catch((err) => {
                setIsLoading(false)
                setError({
                    errType: "Error",
                    errMessage: "Something went wrong!",
                    showError: true
                })
            })


    }
    const checkAll = (moduleName = "") => {
        let p = { ...permissions }
        if (moduleName == "") {
            Object.keys(p).map((key, index) => {
                let feature = p[key]
                p[key].map((element, index) => {
                    feature[index]["isChecked"] = true
                })
                p[key] = feature
            })
        } else {
            let feature = p[moduleName]
            p[moduleName].map((element, index) => {
                feature[index]["isChecked"] = true
            })
            p[moduleName] = feature
        }
        setPermissions(p)
    }
    const uncheckAll = (moduleName = "") => {
        let p = { ...permissions }
        if (moduleName == "") {
            Object.keys(p).map((key, index) => {
                let feature = p[key]
                p[key].map((element, index) => {
                    feature[index]["isChecked"] = false
                })
                p[key] = feature
            })
        } else {
            let feature = p[moduleName]
            p[moduleName].map((element, index) => {
                feature[index]["isChecked"] = false
            })
            p[moduleName] = feature
        }
        setPermissions(p)
    }
    return (
      <LayoutWrapper>
        <TableDemoStyle className="isoLayoutContent">
          <BackButton {...props}></BackButton>
          <Divider>{role.name && <h3>Role - {role.name}</h3>}</Divider>
                <Row type="flex" justify="start" className="table-tb-margin table-filter-row">
                    <Col md={3}>
                    {isAllowed("update_role_permission") && (
                      <Button className="full-width"type="primary" onClick={savePermissions}>
                        Save
                      </Button>
                )}
                    </Col>
                    <Col md={3}>
                      <Tooltip>
                        <Button
                          onClick={() => {
                            checkAll();
                          }}
                        >
                          <Icon type="check-square" theme="filled" /> Check All
                        </Button>
                      </Tooltip>{" "}
                    </Col>
                    <Col md={3.5}>
                      <Tooltip>
                        <Button
                          onClick={() => {
                            uncheckAll();
                          }}
                        >
                          <Icon type="close-square" theme="filled" /> Uncheck All
                        </Button>
                      </Tooltip>
                    </Col>
                    <Col md={6}>
                      <Select className="full-width" value={selectedPermission} placeholder="Select Permission">
                      { Object.keys(permissions).map((key, index) => (
                        <Option key={index} onClick={() => handleClick(key)}>{key}</Option>))
                      }
                      </Select>
                    </Col>
                </Row>
              <div className="permission-scroll">
                <Row>
                  {Object.keys(permissions).map((key, index) => (
                   <div ref={refs[key]}> <Col key={index}>
                      <Card
                        title={key}
                        bordered={false}
                        style={{ width: "100%" }}
                        extra={
                          <div>
                            <Tooltip title="Check All">
                              <Button
                                type="dashed"
                                onClick={() => {
                                  checkAll(key);
                                }}
                              >
                                <Icon type="check-square" theme="filled" />
                              </Button>
                            </Tooltip>{" "}
                            <Tooltip title="Uncheck All">
                              <Button
                                type="dashed"
                                onClick={() => {
                                  uncheckAll(key);
                                }}
                              >
                                <Icon type="close-square" theme="filled" />
                              </Button>
                            </Tooltip>
                          </div>
                        }
                      >
                        <Row>
                          {permissions[key].map((per, index) => (
                            <Col span={6} key={index}>
                              <Checkbox
                                checked={per.isChecked}
                                onChange={e => {
                                  onCheckedChange(e, per.main_module, index);
                                }}
                              >
                                {per.display_name.charAt(0).toUpperCase() + per.display_name.slice(1)}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Card>
                    </Col></div>
                  ))}
                </Row>
              </div>
        </TableDemoStyle>
        {isLoading && <FaldaxLoader></FaldaxLoader>}
      </LayoutWrapper>
    );
}

export default AccessGrant