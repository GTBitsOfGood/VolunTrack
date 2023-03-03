import { Button, Modal } from 'flowbite-react';
import React from 'react'
import { toggleStatus } from '../../actions/queries'

const OrganizationToggleModal = ({ open, onClose, status, organizationId }) => {
    const handleSubmit = () => {
      toggleStatus(organizationId);
      onClose();
    }
    

    return (
        <Modal show={open} dismissible={true} onClose={onClose} popup={true}>
          <Modal.Header/>
          <Modal.Body className="text-center">
            <h3 className="text-xl font-family-sans font-semibold pb-4">
              {status ? "Deactivate " : "Activate "} the platform
            </h3>
            <p>
              By clicking the confirm button, this volunteer management platform will become{status ? " inactive " : " active "}immediately.
              Are you sure you want to confirm?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-center">
          <Button className="bg-primary" onClick={handleSubmit}>
            Confirm
          </Button>
          <Button className="border-primary bg-white text-primary" onClick={onClose}>
            Cancel
          </Button>
          </Modal.Footer>
        </Modal>
      );
}

export default OrganizationToggleModal