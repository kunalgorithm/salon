import { withApollo } from "../apollo/client";
import Salon from "../components/Salon";

import React from "react";

import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { JOIN_MUTATION } from "../components/Join";

const Page = ({ id }) => {
  const { loading, error, data } = useSubscription(
    gql`
      subscription salon($id: uuid!) {
        salon_by_pk(id: $id) {
          id
          title
          players {
            id
            name
            x_position
            y_position
          }
        }
      }
    `,
    { variables: { id } }
  );
  const [join] = useMutation(JOIN_MUTATION);
  // console.log(data);
  if (loading) return <div>Loading...</div>;

  // if (data && data.me && data.me.salonId !== id) {
  //   join({ variables: { salonId: id } });
  // }
  if (!data || !data.salon_by_pk)
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
