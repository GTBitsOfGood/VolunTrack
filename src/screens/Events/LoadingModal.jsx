import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out forwards;
  &.closing {
    animation: ${fadeOut} 0.3s ease-in-out forwards;
  }
`;

const LoadingContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`;

const LoadingCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #ddd;
  border-top-color: var(--primary-color);
  animation: ${rotate} 1s linear infinite;
`;

const CenteredImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 50%;
  max-height: 50%;
`;

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <LoadingContainer onClick={(e) => e.stopPropagation()}>
      <LoadingCircle />
      <CenteredImage src={"/images/voluntrack-small.svg"} alt="Loading Image" />
    </LoadingContainer>
  );
};

export default LoadingModal;
