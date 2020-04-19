import { Salon, Player } from "@prisma/client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Join from "./Join";

import { Row, Col } from "antd";
import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export default ({ data }: { data: { salon: Salon; me: Player } }) => {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [rotate, setRotate] = useState(0);
  const speed = 3;
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") setPosition({
      x: position.x + speed,
      y: position.y,
    });
    else if (event.key === "ArrowLeft") setPosition({
      x: position.x - speed,
      y: position.y,
    });
    if (event.key === "ArrowUp") setPosition({
      x: position.x,
      y: position.y - speed,
    });
    else if (event.key === "ArrowDown") setPosition({
      x: position.x,
      y: position.y + speed,
    });

    // if (event.key === "ArrowDown") setRotate(rotate -1)
  };
  return (
    <>
      <h2>Welcome to {data.salon.title}</h2>
      {!data.me ? (
        <Join />
      ) : (
        <Row
          style={{ height: "70vh" }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          id="game"
        >
          <Col
            span={16}
            style={{ boxShadow: "1px 1px 13px 3px black" }}
            id="arena"
          >
            <div>
              <UpCircleOutlined
                style={{
                  fontSize: "2em",
                  position: "relative",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
                rotate={rotate}
              />
            </div>
          </Col>
          <Col span={8}>
            <Row>
              <Profile />
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};
