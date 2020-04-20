import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { withApollo } from "../apollo/client";

import { Input, Button } from "antd";
import Link from "next/link";
import { Salon, Player } from "@prisma/client";

const Profile = () => {
  const id =
    typeof window !== "undefined" ? localStorage.getItem("player_id") : null;
  const { loading, error, data, client } = useQuery(
    gql`
      query player_by_pk($id: Int!) {
        player_by_pk(id: $id) {
          id
          name
        }
      }
    `,
    { variables: { id } }
  );
  // if (loading) return <div>Loading...</div>;
  if (!data || !data.player_by_pk) return null;
  return (
    <div style={{ textAlign: "center", marginLeft: "20px" }}>
      <span>Joined as</span>

      <h1>{data.player_by_pk.name}</h1>

      <hr style={{ marginBottom: "20px" }} />
      <h2>Players</h2>
      {/* {data.salon.players.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))} */}
    </div>
  );
};

export default Profile;
