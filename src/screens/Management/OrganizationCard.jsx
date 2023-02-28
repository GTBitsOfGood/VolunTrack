import { Card } from 'flowbite-react'
import React from 'react'

const OrganizationCard = ({org}) => {
  return (
    <Card>{org.name}</Card>
  )
}

export default OrganizationCard