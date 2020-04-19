import { Salon, Player } from "@prisma/client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Join from "./Join";

import { Row, Col } from "antd";
import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";

export default ({ data }: { data: { salon: Salon; me: Player } }) => {
  return (
    <div>
      <h2>Welcome to {data.salon.title}</h2>
      {!data.me ? (
        <Join />
      ) : (
        <div>
          <Row>
            <Col span={16} style={{ boxShadow: "1px 1px 13px 3px black" }}>
              <div>
                <UpCircleOutlined style={{ fontSize: "2em" }} rotate={45} />
              </div>
            </Col>
            <Col span={8}>
              <Row>
                <Profile />
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
