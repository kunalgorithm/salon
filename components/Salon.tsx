import { Salon } from "@prisma/client";

export default ({ data }: { data: { salon: Salon } }) => {
  return <div>Welcome to {data.salon.title}</div>;
};
