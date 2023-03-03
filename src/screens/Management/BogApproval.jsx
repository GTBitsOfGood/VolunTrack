import React, { useEffect, useState } from 'react'
import { fetchOrganizations } from '../../actions/queries';
import OrganizationCard from './OrganizationCard';
import Image from "next/image";
import OrganizationToggleModal from './OrganizationToggleModal';

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
  }

  const onToggleOrganization = () => {
    setOpenModal(false);
    onRefresh();
  }
  
  useEffect(() => {
    onRefresh();
  }, []);

  const onCloseModal = () => {
    setOpenModal(false);
    setCurrOrganizationId(null);
    onRefresh();
  }

  return (
    loading ? <div>loading</div> : (
      <div id="screen">
        <div className='flex justify-left'>
          <Image
            objectFit="contain"
            height="158px"
            width="302px"
            layout="fixed"
            alt="Bits of Good Logo"
            src="/images/bog_hac4impact_logo.png"
          />
        </div>
        <h1 className='flex justify-left font-sans px-4 font-semibold text-3xl'>
          Approval Portal - Volunteer Management Platforms 
        </h1>
        <h2 className='flex justify-left font-sans px-4 pt-3 pb-1 font-semibold text-2xl'>
          New Applications
        </h2>
        <div className="space-y-5">
          {organizations.filter((organization) => {
            if (organization.updatedAt === organization.createdAt) {
              return true;
            } else {
              return false;
            }
          }).map((organization, index) => (
            <OrganizationCard key={index} org={organization} setOrganization={setCurrOrganizationId} setOpen={setOpenModal}/>
          ))}
        </div>
        <h2 className='flex justify-left font-sans px-4 pt-3 pb-1 text-2xl'>
          Application History
        </h2>
        <div className="space-y-5">
          {organizations.filter((organization) => {
          if (organization.updatedAt === organization.createdAt) {
            return false;
          } else {
            return true;
          }
          }).map((organization, index) => (
            <OrganizationCard key={index} org={organization} setOrganization={setCurrOrganizationId} setOpen={setOpenModal}/>
          ))}
        </div>
        
        (currOrganizationId && 
          <OrganizationToggleModal open={openModal} onClose={onCloseModal} toggle={onToggleOrganization} organizationId={currOrganizationId}/>
        )
      </div>
    )
  )
}

export default BogApproval