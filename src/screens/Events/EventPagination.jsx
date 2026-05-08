import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";
import styled from "styled-components";

// const PAGE_SIZE = 1;

const Styled = {
  Pagination: styled(Pagination)`
    margin: 1rem 0 !important;
    gap: 0.5rem !important;

    .page-item {
      &.active .page-link {
        color: white;
      }

      &.disabled .page-link {
        color: #94a3b8;
      }
    }

    .page-link {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #64748b;
      min-width: 40px;
      text-align: center;
      padding: 0.5rem 0.75rem;
      transition: all 0.2s ease;
      margin: 0 0.25rem;

      &:hover {
        border-color: #e2e8f0;
      }

      &:focus {
        box-shadow: none;
      }
    }
  `,
  PaginationInfo: styled.div`
    color: #64748b;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    margin-right: 1rem;
  `,
};

class EventPagination extends React.Component {
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
    const delta = 1; // Show two pages near the current page
    const pages = [];
    const left = currentPage - delta;
    const right = currentPage + delta;

    // Always include the first two pages
    for (let i = 0; i < Math.min(2, pageCount); i++) {
      pages.push(i);
    }

    // Include pages around the current page
    for (let i = Math.max(2, left); i <= Math.min(pageCount - 3, right); i++) {
      pages.push(i);
    }

    // Always include the last two pages
    for (let i = Math.max(pageCount - 2, 0); i < pageCount; i++) {
      pages.push(i);
    }

    // Sort and deduplicate
    const sortedPages = [...new Set(pages)].sort((a, b) => a - b);
    const result = [];
    let previous = null;

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
    const { currentPage, pageCount } = this.state;
    const startItem = currentPage * this.props.pageSize + 1;
    const endItem = Math.min(
      (currentPage + 1) * this.props.pageSize,
      this.props.items.length
    );

    return (
      <div className="pagination-wrapper flex items-center justify-center">
        <Styled.Pagination aria-label="Event pagination">
          <PaginationItem disabled={currentPage <= 0}>
            <PaginationLink
              className="text-gray-800 text-primaryColor"
              previous
              onClick={(e) => this.updateCurrentPage(e, currentPage - 1)}
            >
              &lt;
            </PaginationLink>
          </PaginationItem>

          {this.getDisplayedPages(currentPage, pageCount).map((page, index) =>
            page === "..." ? (
              <PaginationItem disabled key={`ellipsis-${index}`}>
                <PaginationLink className="opacity-50">...</PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem active={page === currentPage} key={page}>
                <PaginationLink
                  className={`${
                    page === this.state.currentPage
                      ? "!border-primaryColor bg-primaryColor text-white"
                      : "text-gray-800, hover:text-secondaryColor"
                  }`}
                  onClick={(e) => this.updateCurrentPage(e, page)}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem disabled={currentPage >= pageCount - 1}>
            <PaginationLink
              className="text-gray-800 text-primaryColor"
              next
              onClick={(e) => this.updateCurrentPage(e, currentPage + 1)}
            >
              &gt;
            </PaginationLink>
          </PaginationItem>
        </Styled.Pagination>
      </div>
    );
  }
}

export default EventPagination;

EventPagination.propTypes = {
  items: PropTypes.array.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  updatePageCallback: PropTypes.func.isRequired,
};
