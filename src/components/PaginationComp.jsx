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

class PaginationComp extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   pagesCount: Math.ceil(this.props.users.length / this.props.pageSize),
    // };
    // this.pageSize = 3;
    // this.pagesCount = Math.ceil(this.props.users.length / this.pageSize);

    // console.log(this.props.currentPages);
    // this.state = {
    //   currentPage: this.props.currentPages,
    // };
  }

  handleClick(e, index) {
    e.preventDefault();
    this.props.updatePage(index);
  }

  // renderPageNumbers = () => {
  //   console.log("hi" + this.state.pagesCount);
  //   // if (this.props.pageCount == 0) {
  //   //   return 1;
  //   // }
  //   return [...Array(this.state.pageCount)].map((p, i) => {
  //     return (
  //       <>
  //         <PaginationItem>
  //           <Styled.PaginationLink onClick={(e) => this.handleClick(e, i)}>
  //             {i + 1}
  //           </Styled.PaginationLink>
  //         </PaginationItem>
  //       </>
  //     );
  //   });
  // };

  render() {
    const { currentPage } = this.props;

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
            {[...Array(this.props.pageCount)].map((page, i) => (
              <PaginationItem active={i === currentPage} key={i}>
                <Styled.PaginationLink onClick={(e) => this.handleClick(e, i)}>
                  {i + 1}
                </Styled.PaginationLink>
              </PaginationItem>
            ))}
            {/* {this.renderPageNumbers()} */}
            <PaginationItem disabled={currentPage >= this.props.pageCount - 1}>
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
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  updatePage: PropTypes.func.isRequired,
};
