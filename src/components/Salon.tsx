// import { useMutation } from "@apollo/react-hooks";
// import gql from "graphql-tag";

import React, { KeyboardEvent } from "react";

import { Row, Col, Popover } from "antd";
// import Profile from "./Profile";
import { UpCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import useInterval from "./useInterval";
import styled from "styled-components";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

interface Player {
  id: number;
  name: string;
  x_position: number;
  y_position: number;
  rotation: number;
  updatedAt: Date;
}

export default () => {
  const salonHeight = 500;
  const salonWidth = 500;

  const salon_id = new URLSearchParams(window.location.search).get("room");
  const player_id = localStorage.getItem("player_id")
    ? parseInt(localStorage.getItem("player_id")!)
    : undefined;
  const { data } = useSubscription(
    gql`
      subscription salon_by_pk($id: String!) {
        salon_by_pk(id: $id) {
          players {
            id
            name
            x_position
            y_position
            rotation
            updatedAt
          }
        }
      }
    `,
    { variables: { id: salon_id } }
  );

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
            updatedAt
          }
        }
      }
    `
  );

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
    const xComponent = speed * Math.cos(((rotation - 90) * Math.PI) / 180);
    const yComponent = speed * Math.sin(((rotation - 90) * Math.PI) / 180);

    if (keysDown["ArrowUp"]) {
      const newXPosition = position.x + xComponent;
      const newYPosition = position.y + yComponent;
      setPosition({
        x:
          newXPosition > 0 && newXPosition < salonWidth
            ? newXPosition
            : position.x,
        y:
          newYPosition > 0 && newYPosition < salonHeight
            ? newYPosition
            : position.y,
      });
    }

    if (keysDown["ArrowDown"]) {
      const newXPosition = position.x - xComponent;
      const newYPosition = position.y - yComponent;
      setPosition({
        x:
          newXPosition > 0 && newXPosition < salonWidth
            ? newXPosition
            : position.x,
        y:
          newYPosition > 0 && newYPosition < salonHeight
            ? newYPosition
            : position.y,
      });
    }
    if (keysDown["ArrowLeft"]) setRotation(rotation - 7);
    if (keysDown["ArrowRight"]) setRotation(rotation + 7);
  }, 30);

  useInterval(
    () =>
      move({
        variables: {
          player_id: player_id,
          x_position: position.x,
          y_position: position.y,
          rotation,
        },
      }),
    100
  );

  return (
    <Container
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      id="game"
    >
      <div>
        <UpCircleOutlined
          style={{
            fontSize: "2em",
            position: "relative",
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          rotate={rotation}
          translate={"no"}
        />
        {data &&
          data.salon_by_pk.players
            .filter((p: Player) => p.id !== player_id!)
            .map((player: Player) => (
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
                  translate={"no"}
                />
              </Popover>
            ))}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1 1 0%;
  background-color: #708090ad;
  :focus {
    outline: none;
    background-color: transparent;
  }
`;
