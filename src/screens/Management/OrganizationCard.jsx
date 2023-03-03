import { Card, ToggleSwitch } from 'flowbite-react'
import React from 'react'

const OrganizationCard = ({org, setOpen, setOrganization}) => {

  const onChange = () => {
    console.log(org._id)
    setOpen(true);
    setOrganization(org._id);
  }


  return (
    <div className='flex justify-center'>
      <Card className="bg-gray-300">
        <div className="flex justify-center space-x-3">
          <div className="flex">
            <div className="font-family-sans font-semibold">
              Inactive/Active: 
            </div>
            <ToggleSwitch
            color="green"
            checked={org.active}
            onChange={onChange}
            />
            <div className={org.active ? "text-green-400" : "text-red-400"}>
              {org.active ? "Currently Active" : "Currently Inactive"}
            </div>
          </div>
          <div>
            Requested Date: { (new Date(org.createdAt) ).toDateString() }
          </div>
          <div className={org.active ? "text-green-400" : "text-red-400"}>
            Recent Update: {org.active ? "Activated " : "Deactivated "}on  { (new Date(org.updatedAt) ).toDateString() }
          </div>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col">
            <div className="font-semibold">
              Non-Profit Name
            </div>
            <div>
              {org.name}
            </div>
            <div className="font-semibold">
              Contact Name
            </div>
            <div>
              {org.defaultContactName}
            </div>
            <div className="font-semibold">
              Primary Admin Account
            </div>
            <div>
              {org.defaultContactEmail}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">
              Non-Profit Website
            </div>
            <div>
              {org.website}
            </div>
            <div className="font-semibold">
              Email
            </div>
            <div>
              {org.defaultContactEmail}
            </div>
            <div className="font-semibold">
              Website URL
            </div>
            <div>
              {org.slug}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">
              Phone
            </div>
            <div>
              {org.defaultContactPhone}
            </div>
          </div>

        </div>
      </Card>
    </div>
  )
}

export default OrganizationCard;