import { Card, ToggleSwitch } from 'flowbite-react'
import React from 'react'

const OrganizationCard = ({org, setOpen, setOrganization}) => {

  const onChange = () => {
    console.log("Submit")
    setOpen(true);
    setOrganization(org._id);
  }


  return (
    <div className='flex justify-center'>
      <Card>
        <div>
          <div>
            Inactive/Active
          </div>
          <div id="toggle">
            <ToggleSwitch
              checked={org.active}
              label={org.active ? "Currently Active" : "Currently Inactive"}
              onChange={onChange}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default OrganizationCard;