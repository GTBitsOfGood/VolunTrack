import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventManager from "../../../screens/Embed";

const ParentEmbedComponent = () => {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { organizationId } = router.query;
      if (organizationId) {
        setOrganizationId(organizationId);
      }
    }
  }, [router.isReady, router.query]);

  if (!organizationId) {
    return <div>Loading...</div>;
  }

  return <EventManager organizationId={organizationId} />;
};

export default ParentEmbedComponent;

// import { useRouter } from "next/router";
// import Events from "../../../screens/Embed";
// import EventManager from "../../../screens/Embed";

// const ParentEmbedComponent = () => {
//   const router = useRouter();
//   const { organizationId } = router.query;

//   console.log(organizationId)
//   return (
//     <>
//       {router.isReady}
//       <EventManager organizationId={organizationId} />
//     </>
//   )
// };

// export default ParentEmbedComponent;
