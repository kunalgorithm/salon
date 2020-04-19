import gql from "graphql-tag";

export const typeDefs = gql`
  type Player {
    id: ID!
    email: String
    name: String
    password: String
    x_position: Float
    y_position: Float
    rotation: Float
    salonId: String
    salon: Salon
  }

  type Salon {
    id: ID!
    title: String!
    players: [Player!]!
  }

  type Query {
    me: Player
    player(id: Float!): Player
    players: [Player!]!
    salon(id: String!): Salon
    salons: [Salon!]!
  }

  type Mutation {
    join(name: String, salonId: String!): Player!
    login(email: String!, password: String!): Player!
    signOut: Boolean!
    createSalon(title: String!): Salon!
    move(x_position: Float!, y_position: Float!, rotation: Float!): Player!
  }
`;
