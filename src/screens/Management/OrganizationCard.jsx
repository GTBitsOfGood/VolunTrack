import { Card, ToggleSwitch } from "flowbite-react";
import React from "react";

const OrganizationCard = (props) => {
  const onChange = () => {
    console.log(props.org._id);
    setOpen(true);
    setOrganization(props.org._id);
  };

  return (
    <div className="flex justify-center">
      <Card className="bg-gray-300">
        <div className="flex justify-center space-x-3">
          <div className="flex">
            <div className="font-family-sans font-semibold">
              Inactive/Active:
            </div>
            <ToggleSwitch
              color="green"
              checked={props.org.active}
              onChange={onChange}
            />
            <div className={props.org.active ? "text-green-400" : "text-red-400"}>
              {props.org.active ? "Currently Active" : "Currently Inactive"}
            </div>
          </div>
          <div>Requested Date: {new Date(props.org.createdAt).toDateString()}</div>
          <div className={props.org.active ? "text-green-400" : "text-red-400"}>
            Recent Update: {props.org.active ? "Activated " : "Deactivated "}on{" "}
            {new Date(props.org.updatedAt).toDateString()}
          </div>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col">
            <div className="font-semibold">Non-Profit Name</div>
            <div>{props.org.name}</div>
            <div className="font-semibold">Contact Name</div>
            <div>{props.org.defaultContactName}</div>
            <div className="font-semibold">Primary Admin Account</div>
            <div>{props.org.defaultContactEmail}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Non-Profit Website</div>
            <div>{props.org.website}</div>
            <div className="font-semibold">Email</div>
            <div>{props.org.defaultContactEmail}</div>
            <div className="font-semibold">Website URL</div>
            <div>{props.org.slug}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Phone</div>
            <div>{props.org.defaultContactPhone}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

OrganizationCard.propTypes = {
  setOpen: PropTypes.func,
  org: PropTypes.obj,
  setOrganization: PropTypes.func,
};

export default OrganizationCard;
