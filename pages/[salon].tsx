import { withApollo } from "../apollo/client";
import Salon from "../components/Salon";

import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { Input, Button } from "antd";
import Link from "next/link";

const Page = ({ id }) => {
  const { loading, error, data, client } = useQuery(
    gql`
      query salon($id: String!) {
        salon(id: $id) {
          id
          title
          players {
            id
            name
          }
        }
        me {
          id
          name
        }
      }
    `,
    { variables: { id } }
  );
  if (loading) return <div>Loading...</div>;
  if (!data || !data.salon)
    return (
      <div>
        <h3>This salon has expired or does not exist 🤔</h3>
      </div>
    );
  return <Salon data={data} />;
};

Page.getInitialProps = (ctx) => {
  return { id: ctx.query ? ctx.query.salon : undefined };
};
export default withApollo(Page);
