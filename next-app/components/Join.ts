// @ts-nocheck
import React from "react";

import { useRouter } from "next/router";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { Button, message, Row, Col } from "antd";
import Field from "../components/Field";

export const JOIN_MUTATION = gql`
  mutation join($name: String, $salonId: uuid!) {
    insert_player(objects: { salon_id: $salonId, name: $name }) {
      returning {
        name
        id
      }
    }
  }
`;
function Join({ setPlayerId, salon }) {
  const router = useRouter();

  const [joinMutation, { loading, client }] = useMutation(JOIN_MUTATION);

  return (
    <Row justify="center">
      <Col md={12} sm={18} xs={24}>
        <h3>Enter your name to join {salon.title}</h3>
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const {
              name,
              //@ts-ignore
            } = event.currentTarget.elements;

            try {
              await client.resetStore();

              if (!name.value) {
                message.error("You must enter a name to join.");
                return;
              }
              const result: { data?: any } = await joinMutation({
                variables: {
                  name: name.value,
                  salonId: router.query.salon,
                },
              });

              if (result.data && result.data.insert_player) {
                localStorage.setItem(
                  "salon",
                  JSON.stringify({
                    player_id: result.data.insert_player.returning[0].id,
                    salon_id: router.query.salon as string,
                  })
                );
                setPlayerId(
                  parseInt(result.data.insert_player.returning[0].id)
                );
              }
            } catch (error) {
              message.error(error.message);
            }
          }}
        >
          <Field placeholder="Name" name="name" type="name" />

          <div>
            <Button htmlType="submit" type="default" loading={loading}>
              Join
            </Button>
          </div>
        </form>
      </Col>
    </Row>
  );
}

export default Join;