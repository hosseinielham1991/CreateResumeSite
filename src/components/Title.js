import { Helmet } from "react-helmet";
import { APP_NAME } from "../constanst";

const Title = (props) => {
  return (
    <Helmet>
      <title>
        {props.children} | {APP_NAME}
      </title>
    </Helmet>
  );
};

export default Title;
