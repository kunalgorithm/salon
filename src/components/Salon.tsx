// import { useMutation } from "@apollo/react-hooks";
// import gql from "graphql-tag";

import React, { KeyboardEvent } from "react";

import { Row, Col, Popover } from "antd";
// import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import useInterval from "./useInterval";

interface Player {
  id: number;
  name: string;
  x_position: number;
  y_position: number;
  rotation: number;
  updatedAt: Date;
}

export default () => {
  const [position, setPosition] = useState({
    x: 250,
    y: 100,
  });

  const [rotation, setRotation] = useState(90);

  const speed = 10;

  const [keysDown, setKeysDown] = useState({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    let newKeysDown = keysDown;
    //@ts-ignore
    newKeysDown[event.key] = true;
    setKeysDown(newKeysDown);
  };

  const handleKeyUp = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    let newKeysDown = keysDown;
    //@ts-ignore
    newKeysDown[event.key] = false;
    setKeysDown(newKeysDown);
  };

  let nextTurnTO;
  let networkTO;
  useInterval(() => {
    if (keysDown["ArrowUp"])
      setPosition({
        x:
          position.x + speed * Math.cos(((rotation - 90) * Math.PI) / 180) > 0
            ? position.x + speed * Math.cos(((rotation - 90) * Math.PI) / 180)
            : position.x,
        y:
          position.y + speed * Math.sin(((rotation - 90) * Math.PI) / 180) > 0
            ? position.y + speed * Math.sin(((rotation - 90) * Math.PI) / 180)
            : position.y,
      });

    if (keysDown["ArrowDown"])
      setPosition({
        x:
          position.x - speed * Math.cos(((rotation - 90) * Math.PI) / 180) > 0
            ? position.x - speed * Math.cos(((rotation - 90) * Math.PI) / 180)
            : position.x,
        y:
          position.y - speed * Math.sin(((rotation - 90) * Math.PI) / 180) > 0
            ? position.y - speed * Math.sin(((rotation - 90) * Math.PI) / 180)
            : position.y,
      });
    if (keysDown["ArrowLeft"]) setRotation(rotation - 7);
    if (keysDown["ArrowRight"]) setRotation(rotation + 7);
  }, 30);

  return (
    <Row
      style={{ height: "500px", width: "500px" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      id="game"
    >
      <Col span={16} style={{ boxShadow: "1px 1px 13px 3px black" }} id="arena">
        <div>
          <UpCircleOutlined
            style={{
              fontSize: "2em",
              position: "absolute",
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            rotate={rotation}
            translate={null}
          />
        </div>
      </Col>
    </Row>
  );
};
