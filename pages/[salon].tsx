import { withApollo } from "../apollo/client";
import Salon from "../components/Salon";

const Page = ({ salon }) => {
  return <Salon id={salon} />;
};

Page.getInitialProps = (ctx) => {
  return { salon: ctx.query.salon };
};
export default withApollo(Page);
