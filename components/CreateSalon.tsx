import React, { useState, useEffect } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import Field from "./Field";
import { useRouter } from "next/router";
import { message } from "antd";

export default () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [createSalon] = useMutation(gql`
    mutation createSalon($title: String!) {
      createSalon(title: $title) {
        id
        title
      }
    }
  `);

  return (
    <div>
      <h1>Start a new Salon</h1>

      <form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();

          const result = await createSalon({ variables: { title: input } });
          if (result.data) {
            router.push(`/${result.data.createSalon.id}`);
          } else {
            message.error(result.errors);
          }
        }}
      >
        <Field
          name="post"
          type="post"
          autoComplete="post"
          required
          placeholder="Salon Title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};
