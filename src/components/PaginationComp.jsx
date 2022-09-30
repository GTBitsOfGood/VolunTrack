import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styled from "styled-components";
import variables from "../design-tokens/_variables.module.scss";

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

export default class PaginationComp extends React.Component {
  render() {
    return (
      <Styled.Pagination
        aria-label="Page navigation example"
        className="pagination justify-content-center"
      >
        <PaginationItem>
          <Styled.PaginationLink href="#">Previous</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem active>
          <Styled.PaginationLink href="#">1</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Styled.PaginationLink href="#">2</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Styled.PaginationLink href="#">3</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Styled.PaginationLink href="#">4</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Styled.PaginationLink href="#">5</Styled.PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Styled.PaginationLink href="#">Next</Styled.PaginationLink>
        </PaginationItem>
      </Styled.Pagination>
    );
  }
}
