import React, { useEffect, useState } from "react";
import { fetchOrganizations } from "../../actions/queries";
import OrganizationCard from "./OrganizationCard";
import Image from "next/image";
import OrganizationToggleModal from "./OrganizationToggleModal";

const BogApproval = () => {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [currOrganizationId, setCurrOrganizationId] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    fetchOrganizations()
      .then((result) => {
        if (result) {
          setOrganizations(result.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onToggleOrganization = () => {
    setOpenModal(false);
    onRefresh();
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const onCloseModal = () => {
    setOpenModal(false);
    setCurrOrganizationId(null);
    onRefresh();
  };

  return loading ? (
    <div>loading</div>
  ) : (
    <div id="screen">
      <div className="justify-left flex">
        <Image
          objectFit="contain"
          height="158px"
          width="302px"
          layout="fixed"
          alt="Bits of Good Logo"
          src="/images/bog_hac4impact_logo.png"
        />
      </div>
      <h1 className="justify-left flex px-4 font-sans text-3xl font-semibold">
        Approval Portal - Volunteer Management Platforms
      </h1>
      <h2 className="justify-left flex px-4 pt-3 pb-1 font-sans text-2xl font-semibold">
        New Applications
      </h2>
      <div className="space-y-5">
        {organizations
          .filter((organization) => {
            if (organization.updatedAt === organization.createdAt) {
              return true;
            } else {
              return false;
            }
          })
          .map((organization, index) => (
            <OrganizationCard
              key={index}
              org={organization}
              setOrganization={setCurrOrganizationId}
              setOpen={setOpenModal}
            />
          ))}
      </div>
      <h2 className="justify-left flex px-4 pt-3 pb-1 font-sans text-2xl">
        Application History
      </h2>
      <div className="space-y-5">
        {organizations
          .filter((organization) => {
            if (organization.updatedAt === organization.createdAt) {
              return false;
            } else {
              return true;
            }
          })
          .map((organization, index) => (
            <OrganizationCard
              key={index}
              org={organization}
              setOrganization={setCurrOrganizationId}
              setOpen={setOpenModal}
            />
          ))}
      </div>
      (currOrganizationId &&
      <OrganizationToggleModal
        open={openModal}
        onClose={onCloseModal}
        toggle={onToggleOrganization}
        organizationId={currOrganizationId}
      />
      )
    </div>
  );
};

export default BogApproval;
