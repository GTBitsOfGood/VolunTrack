import { Table } from "flowbite-react";
import Link from "next/link";
import PropTypes from "prop-types";
import React from "react";
import { Button, Modal, ModalHeader } from "reactstrap";
import styled from "styled-components";
import Loading from "../../components/Loading";
import Pagination from "../../components/PaginationComp";
import EditUserForm from "../../components/Forms/EditUserForm";
import {
  ArrowTrendingUpIcon,
  PencilIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

const Styled = {
  Button: styled(Button)`
    background: none;
    border: none;
  `,
  Container: styled.div`
    width: 100%;
    height: 100%;
    margin: auto;
  `,
};

class VolunteerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userSelectedForEdit: null,
      modalOpen: false,
      currentPage: 0,
      pageSize: 10,
    };
  }

  onDisplayEditUserModal = (userToEdit) => {
    this.setState({
      userSelectedForEdit: userToEdit,
      modalOpen: true,
    });
  };

  deleteUser = (id) => {
    // deleteUser(id);
    this.props.deleteUserCallback(id);
  };

  onModalClose = () => {
    this.setState({
      userSelectedForEdit: null,
      modalOpen: false,
    });
  };

  updatePage = (pageNum) => {
    this.setState({
      currentPage: pageNum,
    });
  };

  handleSubmit = (values) => {
    this.props.editUserCallback(this.state.userSelectedForEdit?._id, values);
    this.onModalClose();
  };

  render() {
    const { users, loading } = this.props;
    return (
      <div>
        <Table striped={true}>
          <Table.Head className="dark:border-red-700">
            <Table.HeadCell className="text-primaryColor">
              Volunteer Name
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor">
              Email Address
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor">
              Phone Number
            </Table.HeadCell>
            <Table.HeadCell className="text-primaryColor"> </Table.HeadCell>
          </Table.Head>
          {users
            .slice(
              this.state.currentPage * this.state.pageSize,
              (this.state.currentPage + 1) * this.state.pageSize
            )
            .map((user, index) => (
              <Table.Row key={index} evenIndex={index % 2 === 0}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>
                  {user.email}
                  <Styled.Button
                    onClick={() => {
                      navigator.clipboard.writeText(user.email);
                    }}
                  >
                    <DocumentDuplicateIcon className="text-primaryColor h-7" />
                  </Styled.Button>
                </Table.Cell>
                <Table.Cell>
                  {user.phone_number
                    ? user.phone_number.substr(0, 3) +
                      "-" +
                      user.phone_number.substr(3, 3) +
                      "-" +
                      user.phone_number.substr(6, 4)
                    : ""}
                </Table.Cell>
                <Table.Cell>
                  <Styled.Button
                    onClick={() => this.onDisplayEditUserModal(user)}
                  >
                    <PencilIcon className="text-primaryColor h-7" />
                  </Styled.Button>
                  {/*<Styled.Button onClick={() => this.deleteUser(user._id)}>*/}
                  {/*  <Icon color="grey3" name="delete" />*/}
                  {/*</Styled.Button>*/}
                  <Link href={`stats/${user._id}`}>
                    <Styled.Button>
                      <ArrowTrendingUpIcon className="text-primaryColor h-7" />
                    </Styled.Button>
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          {loading && <Loading />}
          <Modal style={{ maxWidth: "750px" }} isOpen={this.state.modalOpen}>
            <ModalHeader color="#ef4e79">
              {this.state.userSelectedForEdit?.name ?? ""}
            </ModalHeader>
            <div className="p-3">
              <EditUserForm
                userSelectedForEdit={this.state.userSelectedForEdit}
                submitHandler={this.handleSubmit}
                isPopUp={true}
                isAdmin={this.props.isAdmin}
                closePopUp={this.onModalClose}
                disableEdit={false}
              />
            </div>
          </Modal>
        </Table>
        {users.length !== 0 && (
          <Pagination
            items={users}
            pageSize={this.state.pageSize}
            loading={this.props.loading}
            currentPage={this.state.currentPage}
            updatePageCallback={this.updatePage}
          />
        )}
      </div>
    );
  }
}

export default VolunteerTable;

VolunteerTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  editUserCallback: PropTypes.func.isRequired,
  deleteUserCallback: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
