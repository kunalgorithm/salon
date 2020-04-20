import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withApollo } from "../apollo/client";
import Users from "../components/Users";

export default withApollo(() => {
  return <Users />;
});
