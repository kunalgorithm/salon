import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { withApollo } from "../apollo/client";

import { Input, Button } from "antd";
import Link from "next/link";
import { Salon, Player } from "@prisma/client";
import { useRouter } from "next/router";

const Profile = () => {
  const player_id =
    typeof window !== "undefined" ? localStorage.getItem("player_id") : null;
  const router = useRouter();
  const { loading, error, data, client } = useQuery(
    gql`
      query player_by_pk($id: Int!, $salonId: uuid!) {
        player_by_pk(id: $id) {
          id
          name
        }

        player(where: { salon_id: { _eq: $salonId } }) {
          id
          name
        }
      }
    `,
    { variables: { id: player_id, salonId: router.query.salon } }
  );
  // if (loading) return <div>Loading...</div>;

  if (!data || !data.player_by_pk) return null;
  return (
    <div style={{ textAlign: "center", marginLeft: "20px" }}>
      <span>Joined as</span>

      <h1>{data.player_by_pk.name}</h1>

      <hr style={{ marginBottom: "20px" }} />
      <h2>Players</h2>
      {data.player &&
        data.player
          // .filter((p) => p.id !== parseInt(player_id))
          .map((player) => <div key={player.id}>{player.name}</div>)}
    </div>
  );
};

export default Profile;
