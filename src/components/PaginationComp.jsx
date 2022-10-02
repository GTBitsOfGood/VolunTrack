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

    this.pagesCount = Math.ceil(this.props.users.length / this.props.pageSize);

    // this.state = {
    //   currentPage: 0,
    // };
  }

  handleClick(e, index) {
    e.preventDefault();
    // console.log("usersl" + this.props.users.length);
    // console.log(
    //   "al" + Math.ceil(this.props.users.length / this.props.pageSize)
    // );

    this.setState({
      currentPage: index,
    });
  }

  render() {
    const { currentPage } = 0;
    const { pagesCount } = Math.ceil(this.props.users.length / this.pageSize);

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
                href="#"
              >
                Previous
              </Styled.PaginationLink>
            </PaginationItem>
            {[...Array(pagesCount)].map((page, i) => (
              <PaginationItem active={i === currentPage} key={i}>
                <Styled.PaginationLink
                  onClick={(e) => this.handleClick(e, i)}
                  href="#"
                >
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
        {/* {this.dataSet
          .slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
          .map((data, i) => (
            <div className="data-slice" key={i}>
              {data}
            </div>
          ))} */}
      </React.Fragment>
    );
  }
}

export default PaginationComp;

PaginationComp.propTypes = {
  users: PropTypes.array.isRequired,
  currentPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  passData: PropTypes.object,
};
