import { Salon, Player } from "@prisma/client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Join from "./Join";

import { Row, Col } from "antd";
import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export default ({
  data,
}: {
  data: { salon: Salon & { players: Player[] }; me: Player };
}) => {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [rotate, setRotate] = useState(90);
  const speed = 3;
  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") setRotate(rotate - 4);
    if (event.key === "ArrowRight") setRotate(rotate + 4);
    if (event.key === "ArrowUp")
      setPosition({
        x: position.x + speed * Math.cos(((rotate - 90) * Math.PI) / 180),
        y: position.y + speed * Math.sin(((rotate - 90) * Math.PI) / 180),
      });
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
          onKeyDown={handleKeyPress}
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
              <Profile data={data} />
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};
