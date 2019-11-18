import React, { Component } from "react";
import { Tabs } from "antd";
import { Link } from "react-router-dom";


class ViewCampaign extends Component {
  render() {
    const { location } = this.props;
    let path = location.pathname.split("/");
    let user_id = path[path.length - 1];

    return (
      <div>
        <div
          style={{ display: "inline-block", width: "100%", marginLeft: "20px" }}
        >
          <Link to="/dashboard/campaign">
            <i
              style={{ margin: "15px" }}
              class="fa fa-arrow-left"
              aria-hidden="true"
            ></i>
            <a
              onClick={() => {
                this.props.history.push("/dashboard/campaign");
              }}
            >
              Back
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

export default ViewCampaign;
