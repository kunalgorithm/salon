import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Join from "./Join";

import { Row, Col, Popover } from "antd";
import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { useRouter } from "next/router";

export default ({
  data,
}: {
  data: {
    salon_by_pk: { id: string; title: string } & {
      players: {
        id: number;
        name: string;
        x_position: number;
        y_position: number;
        rotation: number;
      }[];
    };
  };
}) => {
  const [position, setPosition] = useState({
    x: 50,
    y: 100,
  });

  const [rotation, setRotation] = useState(90);
  const [player_id, setPlayerId] = useState(null);
  const speed = 4;

  const [move] = useMutation(
    gql`
      mutation move(
        $player_id: Int!
        $x_position: numeric!
        $y_position: numeric!
        $rotation: numeric!
      ) {
        update_player(
          where: { id: { _eq: $player_id } }
          _set: {
            x_position: $x_position
            y_position: $y_position
            rotation: $rotation
          }
        ) {
          affected_rows
          returning {
            id
            x_position
            y_position
            rotation
          }
        }
      }
    `
  );

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") setRotation(rotation - 5);
    if (event.key === "ArrowRight") setRotation(rotation + 5);
    if (event.key === "ArrowUp")
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

    move({
      variables: {
        player_id: player_id,
        x_position: position.x,
        y_position: position.y,
        rotation,
      },
    });
    // AwesomeDebouncePromise(
    //   () =>
    //     move({
    //       variables: {
    //         player_id: player_id,
    //         x_position: position.x,
    //         y_position: position.y,
    //       },
    //     }),
    //   500
    // );
  };
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const obj = JSON.parse(localStorage.getItem("salon"));
      if (obj && obj.salon_id === router.query.salon)
        setPlayerId(parseInt(obj.player_id));
    }
  });

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
              {data.salon_by_pk.players
                .filter((p) => p.id !== player_id)
                .map((player) => (
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
