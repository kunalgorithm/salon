// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Field from "./Field";
import { useRouter } from "next/router";
import { message, Button } from "antd";

export default () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const [createSalon, { loading }] = useMutation(gql`
    mutation createSalon($title: String!) {
      insert_salon(objects: { title: $title }) {
        returning {
          id

          title
        }
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
            console.log(result.data);
            router.push(`/${result.data.insert_salon.returning[0].id}`);
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
        <Button htmlType="submit" type="default" loading={loading}>
          Create
        </Button>
      </form>
    </div>
  );
};
