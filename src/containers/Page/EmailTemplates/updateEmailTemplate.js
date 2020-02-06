import React, { Component } from "react";
import { connect } from "react-redux";
import ApiUtils from "../../../helpers/apiUtills";
import { Input, notification, Button, Form, Row, Col, Tabs } from "antd";
import SimpleReactValidator from "simple-react-validator";
import FaldaxLoader from "../faldaxLoader";
import authAction from "../../../redux/auth/actions";
import CKEditor from "ckeditor4-react";
import { BreadcrumbComponent } from "../../Shared/breadcrumb";
import TableDemoStyle from "../../Tables/antTables/demo.style";
import LayoutWrapper from "../../../components/utility/layoutWrapper";

const { logout } = authAction;
const TabPane = Tabs.TabPane;

class UpdateEmailTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      errMsg: false,
      errMessage: "",
      errType: "Success",
      showError: false,
      isReadOnly: false,
      localizeTemplate: {},
      template_id:""
    };
    this.validator = new SimpleReactValidator();
  }

  componentDidMount = () => {
    if (this.props.location.state && this.props.location.state.isReadOnly) {
      this.setState({ isReadOnly: this.props.location.state.isReadOnly });
    }
    this.setState({template_id:this.props.match.params.id},()=>{
        this._getTemplateDetails();
    })
  };

  _getTemplateDetails = async() => {
    const {  token } = this.props,{template_id}=this.state;
    this.setState({ loader: true });
    try{
        let res=await(await ApiUtils.getTemplateDetails(token, template_id)).json();
        if (res.status == 200) {
          this.setState({
            localizeTemplate: res.template.all_content,
          });
        } else if (res.status == 403) {
          this.setState(
            { errMsg: true, errMessage: res.err, errType: "error" },
            () => {
              this.props.logout();
            }
          );
        } else {
          this.setState({
            errMsg: true,
            errMessage: res.message,
            errType: "error"
          });
        }
    }catch(error){
        console.log("UpdateEmailTemplate Error =>",error);
        this.setState({
            errMsg: true,
            errMessage: "Something went wrong!!",
            errType: "error",
            loader: false
          });
    }finally{
        this.setState({loader:false})
    }
    
  };

  openNotificationWithIconError = type => {
    notification[type]({
      message: this.state.errType,
      description: this.state.errMessage
    });
    this.setState({ errMsg: false });
  };

  _resetForm = () => {
    const { localizeTemplate } = this.state;

    this.setState({
        localizeTemplate,
      showError: false
    });
  };

  onSubjectChange=(lang,e)=>{
    let {localizeTemplate}=this.state;
    localizeTemplate[lang]["subject"]=e.target.value;
    this.setState({localizeTemplate});
  }

  onEditorChange = (lang,evt) => {
    let {localizeTemplate}=this.state;
    localizeTemplate[lang]["content"]=evt.editor.getData();
    this.setState({localizeTemplate});
  };

  _updateTemplate = e => {
    e.preventDefault();
    const { token } = this.props;
    const { localizeTemplate,template_id } = this.state;
    if (this.validator.allValid()) {
      this.setState({ loader: true });

      let formData = {
        id: template_id,
        all_content: localizeTemplate
      };

      ApiUtils.updateEmailTemplate(token, formData)
        .then(res => res.json())
        .then(res => {
          if (res.status != 200) {
            this.setState({
              errMsg: true,
              errMessage: res.err,
              loader: false,
              errType: "Error",
              showError: false
            });
          } else if (res.status == 403) {
            this.setState(
              { errMsg: true, errMessage: res.err, errType: "error" },
              () => {
                this.props.logout();
              }
            );
          } else {
            this.setState({
              errMsg: true,
              errMessage: res.message,
              loader: false,
              errType: "Success",
              showError: false
            });
            this.props.history.push("/dashboard/email-templates");
          }
          this._resetForm();
        })
        .catch(() => {
          this.setState({
            errMsg: true,
            errMessage: "Something went wrong!!",
            loader: false,
            errType: "error",
            showError: false
          });
        });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    const {
      loader,
      localizeTemplate,
      errMsg,
      errType,
      showError,
      isReadOnly
    } = this.state;
    if (errMsg) {
      this.openNotificationWithIconError(errType.toLowerCase());
    }

    return (
      <>
        <LayoutWrapper className="full-width">
          <BreadcrumbComponent {...this.props}></BreadcrumbComponent>
          <div className="email-container full-width">
              <Tabs className="isoTableDisplayTab full-width">
            {Object.keys(localizeTemplate).map(ele => (
                <TabPane tab={localizeTemplate[ele]["language"].toUpperCase()} key={ele}>
                  <Form onSubmit={this._updateTemplate} className="full-width">
                    <Row gutter={[16, 16]}>
                      <Col>
                        <strong>Subject:</strong>
                        <br />
                        <Input
                          placeholder="Subject"
                          value={localizeTemplate[ele]["subject"]}
                          onChange={(e)=>this.onSubjectChange(ele,e)}
                          disabled={isReadOnly}
                        />
                        {this.validator.message('Subject',`${localizeTemplate[ele]["subject"]}`, 'required|max:60', 'text-danger')}
                      </Col>
                    </Row>
                    

                    <Row gutter={[16, 16]}>
                      <Col>
                        <strong>Template Note:</strong>
                        <p
                          dangerouslySetInnerHTML={{ __html: localizeTemplate[ele]["note"] }}
                        ></p>
                      </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Col>
                        <strong>Email Content:</strong>
                        <CKEditor
                          data={localizeTemplate[ele]["content"]}
                          onChange={(e)=>this.onEditorChange(ele,e)}
                          config={{
                            allowedContent: true,
                            fullPage: true,
                            toolbarGroups: [
                              {
                                name: "clipboard",
                                groups: ["clipboard", "undo"]
                              },
                              {
                                name: "editing",
                                groups: ["find", "selection", "spellchecker"]
                              },
                              { name: "links" },
                              { name: "forms" },
                              { name: "tools" },
                              {
                                name: "document",
                                groups: ["mode", "document", "doctools"]
                              },
                              { name: "others" },
                              "/",
                              {
                                name: "basicstyles",
                                groups: ["basicstyles", "cleanup"]
                              },
                              {
                                name: "paragraph",
                                groups: [
                                  "list",
                                  "indent",
                                  "blocks",
                                  "align",
                                  "bidi"
                                ]
                              },
                              { name: "styles" },
                              { name: "colors" },
                              { name: "about" }
                            ]
                          }}
                        />
                        {showError && (
                          <span style={{ color: "red" }}>
                            {"The content field is required."}
                          </span>
                        )}
                      </Col>
                    </Row>
                    {!isReadOnly && (
                      <Row>
                        <Col>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="user-btn"
                            style={{ marginLeft: "0px" }}
                          >
                            Update
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Form>
                </TabPane>
            ))}
            </Tabs>
          </div>
        </LayoutWrapper>
        {loader && <FaldaxLoader />}
      </>
    );
  }
}

export default connect(
  state => ({
    token: state.Auth.get("token")
  }),
  { logout }
)(UpdateEmailTemplate);
