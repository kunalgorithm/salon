import { LocalMediaList } from "@andyet/simplewebrtc";
import React from "react";
import styled from "styled-components";
import { TalkyButton } from "../styles/button";
import { colorToString } from "../utils/colorify";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const Container = styled.div({
  textAlign: "center",
});

const JoinButton = styled(TalkyButton)`
  background-color: ${({ theme }) =>
    colorToString(theme.buttonPrimaryBackground)};
  font-size: 22px;
  color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
  padding: 10px;
  :hover {
    background-color: ${({ theme }) =>
      colorToString(theme.buttonPrimaryBackgroundHover)};
    color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
  }
  :active {
    background-color: ${({ theme }) =>
      colorToString(theme.buttonPrimaryBackgroundActive)};
    color: ${({ theme }) => colorToString(theme.buttonPrimaryText)};
  }
`;

// ShareControls renders a button that when pressed will share all media that
// is populated in LocalMediaList.
const ShareControls = ({ player_name }: { player_name: string }) => {
  const params = new URLSearchParams(window.location.search);
  const salon_id = params.get("room");

  const [insertSalon] = useMutation(gql`
    mutation insert_salon_one($salon_id: String!) {
      insert_salon_one(
        object: { id: $salon_id }
        on_conflict: { constraint: salon_pkey, update_columns: [] }
      ) {
        id
        players {
          id
          name
        }
      }
    }
  `);

  const [insertPlayer] = useMutation(gql`
    mutation insert_player_one($salon_id: String!, $name: String!) {
      insert_player_one(object: { name: $name, salon_id: $salon_id }) {
        id
        salon_id
      }
    }
  `);

  return (
    <LocalMediaList
      shared={false}
      render={({ media, shareLocalMedia, removeMedia }) => {
        if (media.length === 0) {
          return null;
        }

        const shareAll = async () => {
          const salon = await insertSalon({ variables: { salon_id } });

          const player = await insertPlayer({
            variables: { salon_id, name: player_name },
          });
          localStorage.setItem("player_id", player.data.insert_player_one.id);

          for (const m of media) {
            shareLocalMedia!(m.id);
          }
        };

        return (
          <Container>
            <JoinButton onClick={shareAll}>Join</JoinButton>
          </Container>
        );
      }}
    />
  );
};

export default ShareControls;
