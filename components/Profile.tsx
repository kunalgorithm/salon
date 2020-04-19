import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { withApollo } from "../apollo/client";

import { Input, Button } from "antd";
import Link from "next/link";
import { Salon, Player } from "@prisma/client";

const Profile = ({
  data,
}: {
  data: { salon: Salon & { players: Player[] }; me: Player };
}) => {
  // if (loading) return <div>Loading...</div>;
  if (!data || !data.me) return null;
  return (
    <div style={{ textAlign: "center", marginLeft: "20px" }}>
      <span>Joined as</span>

      <h1>{data.me.name}</h1>

      <hr style={{ marginBottom: "20px" }} />
      <h2>Players</h2>
      {data.salon.players.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  );
};

export default Profile;
