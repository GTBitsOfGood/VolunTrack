import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getWaivers } from "../../actions/queries";
import Waiver from "./Waiver";

function authWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.role !== "admin") {
      return (
        <Error
          title="You are not authorized to access this page"
          statusCode={403}
        />
      );
    } else {
      return <Component {...props} user={user} />;
    }
  };
}

const WaiverManager = () => {
  return "Hello";
};

export default authWrapper(WaiverManager);
