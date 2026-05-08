import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";
import styled from "styled-components";

// const PAGE_SIZE = 1;

const Styled = {
  Pagination: styled(Pagination)`
    margin: 2vw;
  `,
  PaginationLink: styled(PaginationLink)`
    background-color: transparent;
    border: none;
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

  getDisplayedPages(currentPage, pageCount) {
    if (pageCount <= 1) return [0];
    const delta = 2;
    const pages = [];
    const left = currentPage - delta;
    const right = currentPage + delta;
    let previous;

    // Collect pages to show
    for (let i = 0; i < pageCount; i++) {
      if (i === 0 || i === pageCount - 1 || (i >= left && i <= right)) {
        pages.push(i);
      }
    }

    // Sort and deduplicate
    const sortedPages = [...new Set(pages)].sort((a, b) => a - b);
    const result = [];
    previous = null;

    // Insert ellipsis where there are gaps
    sortedPages.forEach((page) => {
      if (previous !== null && page - previous > 1) {
        result.push("...");
      }
      result.push(page);
      previous = page;
    });

    return result;
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
              {/* Previous button */}
              <PaginationItem disabled={this.state.currentPage <= 0}>
                <Styled.PaginationLink
                  className="text-gray-400 hover:text-primaryColor"
                  onClick={(e) =>
                    this.updateCurrentPage(e, this.state.currentPage - 1)
                  }
                  previous
                >
                  Previous
                </Styled.PaginationLink>
              </PaginationItem>

              {/* Page numbers with ellipsis */}
              {this.getDisplayedPages(
                this.state.currentPage,
                this.state.pageCount
              ).map((page, index) => {
                if (page === "...") {
                  return (
                    <PaginationItem disabled key={`ellipsis-${index}`}>
                      <Styled.PaginationLink className="text-gray-400" disabled>
                        ...
                      </Styled.PaginationLink>
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem
                    active={page === this.state.currentPage}
                    key={page}
                    className={
                      page === this.state.currentPage ? "bg-gray-400" : ""
                    }
                  >
                    <Styled.PaginationLink
                      className={`${
                        page === this.state.currentPage
                          ? "!border-primaryColor bg-primaryColor text-white"
                          : "text-gray-800 hover:text-secondaryColor"
                      } hover:text-primaryColor`}
                      onClick={(e) => this.updateCurrentPage(e, page)}
                    >
                      {page + 1}
                    </Styled.PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Next button */}
              <PaginationItem
                disabled={this.state.currentPage >= this.state.pageCount - 1}
              >
                <Styled.PaginationLink
                  className="text-gray-400 hover:text-primaryColor"
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
  currentPage: PropTypes.number.isRequired,
  updatePageCallback: PropTypes.func.isRequired,
};
