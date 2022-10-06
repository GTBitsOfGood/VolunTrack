import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";
import styled from "styled-components";
import variables from "../design-tokens/_variables.module.scss";

// const PAGE_SIZE = 1;

const Styled = {
  Pagination: styled(Pagination)`
    margin: 2vw;
  `,
  PaginationLink: styled(PaginationLink)`
    background-color: transparent;
    border: none;
    color: ${variables["gray-400"]};
  `,
};

// const person = {
//   name: "John Doe",
//   age: 999,
// };

class PaginationComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
    };

    this.pageSize = 3;
    this.pagesCount = Math.ceil(this.props.users.length / this.pageSize);

    // console.log(this.props.currentPages);
    // this.state = {
    //   currentPage: this.props.currentPages,
    // };
  }

  handleClick(e, index) {
    // const { updateCurrentPage } = this.props.updateCurrentPage;
    // console.log(updateCurrentPage);
    e.preventDefault();

    // updateCurrentPage({ currentPage: index });
    this.setState({
      currentPage: index,
    });
  }

  render() {
    const { currentPage } = this.state;

    return (
      <React.Fragment>
        <div className="pagination-wrapper">
          <Styled.Pagination
            aria-label="Page navigation example"
            className="pagination justify-content-center"
          >
            <PaginationItem disabled={currentPage <= 0}>
              <Styled.PaginationLink
                onClick={(e) => this.handleClick(e, currentPage - 1)}
                previous
              >
                Previous
              </Styled.PaginationLink>
            </PaginationItem>
            {[...Array(this.pagesCount)].map((page, i) => (
              <PaginationItem active={i === currentPage} key={i}>
                <Styled.PaginationLink onClick={(e) => this.handleClick(e, i)}>
                  {i + 1}
                </Styled.PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentPage >= this.pagesCount - 1}>
              <Styled.PaginationLink
                onClick={(e) => this.handleClick(e, currentPage + 1)}
                next
              >
                Next
              </Styled.PaginationLink>
            </PaginationItem>
          </Styled.Pagination>
        </div>
      </React.Fragment>
    );
  }
}

export default PaginationComp;

PaginationComp.propTypes = {
  users: PropTypes.array.isRequired,
  // currentPages: PropTypes.number.isRequired,
  // pageSize: PropTypes.number.isRequired,
  updateCurrentPage: PropTypes.func.isRequired,
};
