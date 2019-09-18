import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';

const Container = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: bottom 0.2s;
  bottom: ${props => (props.isHidden ? '-10rem' : '0')};
  .banner {
    padding: 0.5rem;
    background: ${props => (props.success ? 'hsla(127, 100%, 32%, 90%)' : props.theme.grey9)};
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    margin: auto;
    max-width: ${props => (props.success || props.failed ? '15rem' : '5rem')};
    transition: max-width 0.2s;

    p {
      font-size: 1.3rem;
      font-weight: 600;
      color: white;
      margin: 0 0.5em;
      padding: 0;
      white-space: nowrap;
      overflow: hidden;
    }
    p.icon {
      font-size: 1.6rem;
      ${props => (props.success ? 'animation: funBounce 0.5s ease-in forwards;' : '')}
      animation-delay: 0.5s;
    }
  }

  @keyframes funBounce {
    25% {
      transform: scale(1.2) rotate(20deg);
    }
    50% {
      transform: scale(1.2) rotate(-20deg);
    }
    75% {
      transform: scale(1.2) rotate(0deg);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export const RequestContext = React.createContext();

const initialState = {
  loading: false,
  success: false,
  failed: false,
  isHidden: true,
  text: ''
};

class RequestProvider extends React.Component {
  state = initialState;

  delayedFall = () => {
    setTimeout(() => {
      this.setState({
        isHidden: true
      });
    }, 2000);
  };
  render() {
    return (
      <RequestContext.Provider
        value={{
          state: this.state,
          startLoading: () => this.setState({ ...initialState, loading: true, isHidden: false }),
          success: text => {
            this.setState({
              loading: false,
              success: true,
              failed: false,
              text: text
            });
            this.delayedFall();
          },
          failed: text =>
            this.setState({
              loading: false,
              success: false,
              failed: true,
              text: text
            })
        }}
      >
        {this.props.children}
        <Container {...this.state}>
          <div className="banner">
            {this.state.loading ? (
              <Loading size="0.5rem" />
            ) : (
              <React.Fragment>
                <p>{this.state.text}</p>
                {this.state.success && (
                  <p className="icon">
                    <span role="img" aria-label="success">
                      🎉
                    </span>
                  </p>
                )}
              </React.Fragment>
            )}
          </div>
        </Container>
      </RequestContext.Provider>
    );
  }
}

export default RequestProvider;
