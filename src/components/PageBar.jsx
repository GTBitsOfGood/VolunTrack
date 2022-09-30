import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styled from "styled-components";

const Styled = {
  CenterBar: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2vw;
  `,
};
export default class PageBar extends React.Component {
  render() {
    return (
      <Styled.CenterBar>
        <Pagination aria-label="Page navigation">
          <PaginationItem disabled>
            <PaginationLink previous href="#" />
          </PaginationItem>
          <PaginationItem active>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink next href="#" />
          </PaginationItem>
        </Pagination>
      </Styled.CenterBar>
    );
  }
}
