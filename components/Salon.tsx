import { Salon, Player } from "@prisma/client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Join from "./Join";

import { Row, Col, Popover } from "antd";
import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

export default ({
  data,
}: {
  data: { salon_by_pk: Salon & { players: Player[] } };
}) => {
  const [position, setPosition] = useState({
    x: 50,
    y: 100,
  });
  const [rotation, setRotation] = useState(90);
  const speed = 3;

  // const [move] = useMutation(
  //   gql`
  //     mutation move(
  //       $player_id: Float!
  //       $x_position: Float!
  //       $y_position: Float!

  //     ) {
  //       update_player(where: {id: {_eq: $$player_id}}, _set: {x_position: $x_position, y_position: $y_position}) {
  //       affected_rows
  //       returning {
  //         id
  //         x_position
  //         y_position
  //       }
  //       }
  //     }
  //   `
  // );
  const move = (variables) => {};
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight")
      setPosition({
        x: position.x + speed,
        y: position.y,
      });
    else if (event.key === "ArrowLeft")
      setPosition({
        x: position.x - speed,
        y: position.y,
      });
    if (event.key === "ArrowUp")
      setPosition({
        x: position.x,
        y: position.y - speed,
      });
    else if (event.key === "ArrowDown")
      setPosition({
        x: position.x,
        y: position.y + speed,
      });

    move({
      variables: {
        x_position: position.x,
        y_position: position.y,
        rotation: rotation,
      },
    });
  };
  const player_id =
    typeof window !== "undefined" ? localStorage.getItem("player_id") : null;

  return (
    <>
      <h2>Welcome to {data.salon_by_pk.title}</h2>
      {!player_id ? (
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
                  position: "absolute",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
                rotate={rotation}
              />
              {data.salon_by_pk.players.map((player) => (
                <Popover content={player.name} key={player.id}>
                  <UpCircleOutlined
                    style={{
                      fontSize: "2em",
                      position: "absolute",
                      left: `${player.x_position}px`,
                      top: `${player.y_position}px`,
                      color:
                        Math.abs(player.x_position - position.x) < 50 &&
                        Math.abs(player.y_position - position.y) < 50
                          ? "blue"
                          : "slategray",
                    }}
                    rotate={player.rotation}
                  />
                </Popover>
              ))}
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
