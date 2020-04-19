import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { withApollo } from "../apollo/client";

import { Input, Button } from "antd";
import Link from "next/link";

const Profile = () => {
  const { loading, error, data, client } = useQuery(
    gql`
      query {
        me {
          id
          name
        }
      }
    `
  );
  if (loading) return <div>Loading...</div>;
  if (!data || !data.me)
    return (
      <div>
        <h1>You have not joined yet.</h1>
      </div>
    );
  return (
    <div style={{ textAlign: "center", marginLeft: "20px" }}>
      <span>Joined as</span>

      <h1>{data.me.name}</h1>
    </div>
  );
};

export default Profile;
