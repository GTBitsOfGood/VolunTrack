import { Card, ToggleSwitch } from "flowbite-react";
import PropTypes from "prop-types";

const OrganizationCard = (props) => {
  const onChange = () => {
    props.setOpen(true);
    props.setOrganization(props.org);
  };

  return (
    <Card className="w-full border shadow-md">
      <div className="flex justify-center">
        <div className="flex">
          <div className="mr-2 font-semibold">Status:</div>
          <ToggleSwitch
            color="green"
            checked={props.org.active}
            onChange={onChange}
          />
        </div>
        <div className="grow" />
        <div className={props.org.active ? "text-green-400" : "text-red-400"}>
          {props.org.active ? "Activated " : "Deactivated "}on{" "}
          {new Date(props.org.updatedAt).toDateString()}
        </div>
      </div>
      <hr className="my-2 h-px border-0 bg-gray-200 dark:bg-gray-700" />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="font-semibold">Non-Profit Name</div>
          <div>{props.org.name}</div>
          <div className="mt-2 font-semibold">Contact Name</div>
          <div>{props.org.defaultContactName}</div>
          <div className="mt-2 font-semibold">Primary Admin Account</div>
          <div>{props.org.originalAdminEmail}</div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">Non-Profit Website</div>
          <div>{props.org.website}</div>
          <div className="mt-2 font-semibold">Contact Email</div>
          <div>{props.org.defaultContactEmail}</div>
          <div className="mt-2 font-semibold">Organization Code</div>
          <a href={`https://volunteer.bitsofgood.org/${props.org.slug}`}>
            {props.org.slug}
          </a>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">Contact Phone</div>
          <div>{props.org.defaultContactPhone}</div>
          <div className="mt-2 font-semibold">Requested Date</div>
          <div>{new Date(props.org.createdAt).toDateString()}</div>
        </div>
      </div>
    </Card>
  );
};

OrganizationCard.propTypes = {
  setOpen: PropTypes.func,
  org: PropTypes.object,
  setOrganization: PropTypes.func,
};

export default OrganizationCard;
