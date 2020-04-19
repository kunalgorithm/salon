import React from "react";

import Profile from "./Profile";
import { Row, Col } from "antd";
import Users from "./Users";
import CreateSalon from "./CreateSalon";

export default function Dashboard() {
  return (
    <div>
      <Row>
        <Col span={14}>
          <CreateSalon />
        </Col>
      </Row>
      <style jsx>{`
        display: block;
        width: 100%;
      `}</style>
    </div>
  );
}
