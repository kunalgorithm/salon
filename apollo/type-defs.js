import gql from "graphql-tag";

export const typeDefs = gql`
  type Player {
    id: ID!
    email: String!
    name: String
    password: String!
  }

  type Salon {
    id: ID!
    title: String!
  }

  type Query {
    me: Player
    player(id: Float!): Player
    players: [Player!]!
    salon(id: String!): Salon
    salons: [Salon!]!
  }

  type Mutation {
    signup(email: String!, name: String!, password: String!): Player!
    login(email: String!, password: String!): Player!
    signOut: Boolean!
    createSalon(title: String!): Salon!
  }
`;
