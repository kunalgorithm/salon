import React from "react";

import Profile from "./Profile";
import { Row, Col } from "antd";
import Users from "./Users";
import Posts from "./CreateSalon";

export default function Dashboard() {
  return (
    <div>
      <Row>
        <Col span={16}>
          <Posts />
        </Col>
        <Col span={8}>
          <Row>
            <Profile />
          </Row>
        </Col>
      </Row>
      <style jsx>{`
        display: block;
        width: 100%;
      `}</style>
    </div>
  );
}
