import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import EventManager from "../../../screens/Embed";
import LoadingScreen from "../../../components/LoadingScreen";

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
    return <LoadingScreen size="lg" fullScreen={true} />;
  }

  return <EventManager organizationId={organizationId} />;
};

export default ParentEmbedComponent;
