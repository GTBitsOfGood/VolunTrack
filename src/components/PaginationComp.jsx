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
    this.state = { pageCount: 0, currentPage: 0 };
  }

  updateCurrentPage(e, index) {
    e.preventDefault();
    this.setState({ currentPage: index });
    this.props.updatePageCallback(index);
  }

  componentDidMount = () => {
    this.setState({
      pageCount: Math.ceil(this.props.items.length / this.props.pageSize),
      currentPage: this.props.currentPage,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.items != [] && this.props.items !== prevProps.items) {
      this.setState({
        pageCount: Math.ceil(this.props.items.length / this.props.pageSize),
        currentPage: this.props.currentPage,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        {
          <div className="pagination-wrapper">
            <Styled.Pagination
              aria-label="Page navigation example"
              className="pagination justify-content-center"
            >
              <PaginationItem disabled={this.state.currentPage <= 0}>
                <Styled.PaginationLink
                  onClick={(e) =>
                    this.updateCurrentPage(e, this.state.currentPage - 1)
                  }
                  previous
                >
                  Previous
                </Styled.PaginationLink>
              </PaginationItem>
              {[...Array(this.state.pageCount)].map((page, i) => (
                <PaginationItem active={i === this.state.currentPage} key={i}>
                  <Styled.PaginationLink
                    onClick={(e) => this.updateCurrentPage(e, i)}
                  >
                    {i + 1}
                  </Styled.PaginationLink>
                </PaginationItem>
              ))}
              {/* {this.renderPageNumbers()} */}
              <PaginationItem
                disabled={this.state.currentPage >= this.state.pageCount - 1}
              >
                <Styled.PaginationLink
                  onClick={(e) =>
                    this.updateCurrentPage(e, this.state.currentPage + 1)
                  }
                  next
                >
                  Next
                </Styled.PaginationLink>
              </PaginationItem>
            </Styled.Pagination>
          </div>
        }
      </React.Fragment>
    );
  }
}

export default PaginationComp;

PaginationComp.propTypes = {
  items: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  updatePageCallback: PropTypes.func.isRequired,
};
