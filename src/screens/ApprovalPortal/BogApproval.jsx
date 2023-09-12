import { Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useEffect, useState } from "react";
import { getOrganizations } from "../../queries/organizations";
import OrganizationCard from "./OrganizationCard";
import OrganizationToggleModal from "./OrganizationToggleModal";
import BasicModal from "../../components/BasicModal";

const BogApproval = () => {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [currOrganization, setCurrOrganization] = useState(null);
    organizationId: null,
    status: null,
  });
  const [openModal, setOpenModal] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    getOrganizations()
      .then((result) => {
        if (result) {
          setOrganizations(result.data.organizations);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onConfirmModal = () => {
    toggleStatus(currOrganization.organizationId);
    onCloseModal();
    onRefresh();
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setCurrOrganization(null);
  };

  return loading ? (
    <div className="mt-16 text-center">
      <Spinner />
    </div>
  ) : (
    <div className="mx-auto my-2 w-3/4 space-y-8">
      <h1 className="my-4 text-3xl font-semibold">
        Bits of Good Nonprofit Approval Portal
      </h1>
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold">New Applications</h2>
        {organizations.filter((organization) => {
          return organization.updatedAt === organization.createdAt;
        }).length > 0 ? (
          organizations
            .filter((organization) => {
              return organization.updatedAt === organization.createdAt;
            })
            .map((organization, index) => (
              <OrganizationCard
                key={index}
                org={organization}
                setOrganization={setCurrOrganization}
                setOpen={setOpenModal}
              />
            ))
        ) : (
          <div className="my-8 text-center">No new applications</div>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Application History</h2>
        {organizations
          .filter((organization) => {
            return organization.updatedAt !== organization.createdAt;
          })
          .map((organization, index) => (
            <OrganizationCard
              key={index}
              org={organization}
              setOrganization={setCurrOrganization}
              setOpen={setOpenModal}
            />
          ))}
      </div>
      {currOrganization && (
        <BasicModal
          open={openModal}
          text={`By clicking the confirm button, this volunteer management platform \
            will become ${
              currOrganization.status ? " inactive " : " active "
            } immediately. Are \
            you sure you want to confirm?`}
          confirmText={"Confirm"}
          cancelText={"Cancel"}
          onClose={onCloseModal}
          onConfirm={onConfirmModal}
          title={"Toggle the organizations status"}
        />
      )}
    </div>
  );
};

export default BOGWrapper(BogApproval);

function BOGWrapper(Component) {
  return function WrappedComponent(props) {
    const {
      data: { user },
    } = useSession();
    if (user.isBitsOfGoodAdmin !== true) {
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
