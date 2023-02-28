import React, { useEffect, useState } from 'react'
import { fetchOrganizations } from '../../actions/queries';
import OrganizationCard from './OrganizationCard';
import Image from "next/image";

const BogApproval = () => {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);


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
  organizations.map((organization, key) => {
    console.log(organization);
  })
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    loading ? <div>loading</div> : (
      <div>
        <div className='flex justify-left'>
          <Image
            objectFit="contain"
            height="158px"
            width="302px"
            layout="fixed"
            alt="Bits of Good Logo"
            src="/images/bog_hac4impact_logo.png"
          />

          <div>
            Information Collection Form - Bits of Good Volunteer Management
            Platform
          </div>
          <div>
            After submitting this form, Bits of Good will review your
            information soon. Once you are approved, our member will be in
            contact with you to help you establish the platform.
          </div>
        </div>
        {organizations.map((organization, index) => (
          <OrganizationCard key={index} org={organization}/>
        ))}
      </div>
    
    )
  )
}

export default BogApproval