import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getWaivers } from "../../actions/queries";
import "react-quill/dist/quill.snow.css";
import Waiver from "./Waiver";
import { Button } from "flowbite-react";
import { useRef } from "react";
import { uploadWaiver } from "../../actions/queries";

const WaiversContainer = styled.div`
  min-width: 60%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

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



const WaiverEdit = () => {
  const [waivers, setWaivers] = useState({});
  const [submit, setSubmitting] = useState(false);
  const [adultExists, setAdultExists] = useState(false);
  const [minorExists, setMinorExists] = useState(false);
  const [user, setUser] = useState();
  const [content, setContent] = useState(
    adultExists ? "<p>s</p>" : ""
  );

  // const loadSession = async () => {
  //   const { data: session } = await useSession();
  //   setUser(session.user);
  // };
  // useEffect(() => {
  //   loadSession();
  // }, []);




  let ReactQuill;
// patch for build failure
if (typeof window !== "undefined") {
  ReactQuill = require("react-quill");
}
const quill = useRef(null);


  const submitWaiver = (values, setSubmitting) => {
    // const waiver = {
    //   type: "adult",
    //   text: "<p>s</p>",
    //   organizationId: 11111,
    // };
    // setSubmitting(true);

    uploadWaiver("adult", "<p>s</p>", 11111);
      // .finally(() => setSubmitting(false));
  };


  // const getAndSetWaivers = async () => {
  //   const res = await getWaivers();
  //   setWaivers(res.data);
  // };

  // useEffect(() => {
  //   getAndSetWaivers();
  // }, []);

  

  return (
    <WaiversContainer>
      <h2>Manage Waivers</h2>
      
        {/* <Tabs.Group
    aria-label="Default tabs"
    style="default"
  >
    <Tabs.Item
      active={true}
      title="Adult Waiver" 
    >
      Profile content
    </Tabs.Item>
    <Tabs.Item title="Minor Waiver">
      Dashboard content
    </Tabs.Item>
  </Tabs.Group> */}
     
   



    Adult Waiver
    <div>
      <ReactQuill
                          value={content}
                          onChange={(newValue) => {
                            setContent(newValue)
                          }}
                          ref={quill}
                          
                        />
                        </div>
      <Button gradientMonochrome="pink" onClick={submitWaiver}>
      Save
    </Button>
    {/* <br></br>
    Minor Waiver
    <div>
      <ReactQuill
                          // value={content}
                          // onChange={(newValue) => {
                          //   setContent(newValue);
                          // }}
                          ref={quill}
                        />
                        </div>
      <Button gradientMonochrome="pink">
      Save
    </Button> */}
    </WaiversContainer>
  );
};

export default authWrapper(WaiverEdit);
