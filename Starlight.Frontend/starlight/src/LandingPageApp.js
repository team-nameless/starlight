import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/new';
import TextField from '@atlaskit/textfield';
import './styleoflandingpage.css'; 
import Background from './assets/background-image/backgroundd.png';
import ModalBackground from './assets/background-image/pur.png';
import GirlImage from './assets/modal-image/girlimage.png'; 
import LogoImage from './assets/background-image/logoo.png';

const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
  font-family: 'Anta', sans-serif; 
  margin: 0;
  padding: 0;
  overflow: hidden; 
`;

const ModalTitle = styled.h2`
  position: absolute;
  top: 40px; 
  left: 230px; 
  text-align: center;
`;


const ButtonContainer = styled.div`
  display: flex; 
  justify-content: flex-start; 
  margin-top: 30px; 
  width: 100%; 
`;

const BackgroundLandingPage = styled.div`
  background-image: url(${Background});
  position: relative;
  height: 100vh; 
  width: 100%; 
  background-size: cover;
  background-position: center;
  z-index: 0;
`;

const ModalBackground2 = styled.div`
  background-image: url(${ModalBackground});
  background-size: cover; 
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0; 
  width: 32%; 
  height: 100%;
  object-fit: cover; 
`;

const LogoImage2 = styled.img`
  position: absolute;
  top: 316px; 
  right: 335px; 
  width: 75px; 
  height: 95px;
  z-index: 0; 
`;


const GirlImage2 = styled.img`
  width: auto; 
  height: 100%; 
  object-fit: cover; 
  border-radius: 10px; 
  position: absolute; 
  bottom: 0; 
  right: 0; 
  z-index: 1;
`;

const SignUpButton = styled.button`
  margin-left: 10px;
  padding: 20px 30px;
  background-color: white; 
  color: black; 
  border: none;
  border-radius: 35px;
  font-family: 'Anta', sans-serif;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    background-color: #841EFC;
    color: white 
  }
`;

const LoginButton = styled.button`
  margin-left: 10px;
  padding: 20px 30px;
  background-color: #841EFC; 
  color: white; 
  border: none;
  border-radius: 35px;
  cursor: pointer;
  font-family: 'Anta', sans-serif;
  font-size: 25px;

  &:hover {
    background-color: white;
    color: black;
  }
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: flex-end; 
  font-family: 'Anta', sans-serif;
  padding: 20px;
  z-index: 1; 
`;


const Modal = styled.div`
  display: flex; 
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.92;
`;

const ModalContent = styled.div`
  display: flex; 
  background-color: #ffffff;
  margin: 8% auto;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 1000px;
  position: relative; 
`;


const TextFieldContainer = styled.div`
  margin: 10px 0; 
  width: 87%; 
  text-align: left;
  margin-bottom: 61px;
  margin-top: -30px;
  
  label {
    display: flex; 
    margin-bottom: 10px; 
  }
`;

const FormContainer = styled.div`
  flex: 2; 
  padding: 120px; 
  padding-left: 2px; 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  margin-left: 20px;
`;


const ImageContainer = styled.div`
  flex: 1; 
  position: relative; 
  overflow: hidden; 
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right; 
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  margin: 10px;

  &:hover,
  &:focus {
    color: black; 
  }
`;

const SubmitButton = styled.button`
  background-color: #841EFC; 
  color: white; 
  border: none; 
  padding: 13px 30px; 
  border-radius: 5px; 
  cursor: pointer; 
  margin-top: 375px; 
  width: 200%;
  display: block;
  margin-left: -695px;
  align-self: flex-start;
  transition: background-color 0.3s ease; 

  &:hover {
    background-color: #a135ff; 
  }
`;


const PlayButton = styled.button`
  display: flex; 
  align-items: center;
  padding: 25px 40px; 
  border-radius: 55px; 
  background-color: #67D920; 
  color: black; 
  font-size: 1.6rem; 
  font-family: 'Adlam Display', sans-serif; 
  border: none; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  margin-top: 45px;
  z-index: 5;
  margin-left: 320px;

 &:hover {
    background-color: black; 
    color: #67D920; 

    div {
      background-color: #67D920; 
    }

    .play-icon {
      color: black; 
    }
  }
`;

const PlayIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px; 
  height: 50px; 
  background-color: black; 
  border-radius: 50%; 
  margin-right: 15px; 

  .play-icon {
    font-size: 1.8rem; 
    color: #67D920; 
  }
`;


const Hero = styled.div`
  text-align: left; 
  padding: 15px 20px; 
  z-index: 1; 

  h1 {
    font-size: 11.5vw;
    margin: 0;
    margin-left: 60px;
    font-family: 'Protest Revolution'; 
    color: #841efc; 
    margin-top: 30px
  }

  h2 {
    font-size: 8vw;
    margin: 0;
    margin-left: 210px;
    font-family: 'Protest Revolution'; 
    color: #fffdfd; 
  }
`;

const LandingPageApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setShowSignUpModal(false);
  };

  const handlePlayButtonClick = () => {
    if (!isLoggedIn) {
      setShowNotificationModal(true);
    } else {
      window.location.href = 'main.html';
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowNotificationModal(false);
  };

  const FormWrapper = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 

`;

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  return (
    <AppContainer>
      <BackgroundLandingPage>
        <header>
        <NavButtons>
             <SignUpButton onClick={() => setShowSignUpModal(true)}>Sign up</SignUpButton>
             <LoginButton onClick={() => setShowLoginModal(true)}>Log in</LoginButton>
        </NavButtons>
        </header>
        <Hero>
          <h1>Star</h1>
          <h2>Light</h2>
        </Hero>
        <PlayButton onClick={handlePlayButtonClick} style={{ position: 'relative', zIndex: 2 }}>
          <PlayIconContainer>
            <span className="play-icon">▶</span>
          </PlayIconContainer>
          Start Game
        </PlayButton>
      </BackgroundLandingPage>

      {showSignUpModal && (
  <Modal>
    <ModalContent>
      <ModalBackground2 />
      <CloseButton onClick={closeModal}>&times;</CloseButton>
      <GirlImage2 src={GirlImage} alt="Girl" /> 
      <LogoImage2 src={LogoImage} alt="Logo" />

      <ModalTitle>Create Account</ModalTitle>
      
      <FormContainer style={{ flexDirection: 'column', justifyContent: 'space-between', height: '535px' }}>
        
        <TextFieldContainer>
          <label htmlFor="playerName">Player Name:</label>
          <TextField id="playerName" required />
        </TextFieldContainer>

        <TextFieldContainer>
          <label htmlFor="email">Email:</label>
          <TextField id="email" required />
        </TextFieldContainer>

        <TextFieldContainer>
          <label htmlFor="password">Password:</label>
          <TextField id="password" required />
        </TextFieldContainer>

      </FormContainer>

      <FormWrapper>
  <ButtonContainer>
      <SubmitButton type="submit">Create Account</SubmitButton>
  </ButtonContainer>
  <div style={{ position: 'relative', right: '690px', marginTop: '10px', textAlign: 'left' }}>
    <p style={{ margin: '0', display: 'block', opacity: 0.7 }}>
        Already have an account? <span style={{ cursor: 'pointer', color: '#0090AA' }} onClick={switchToLogin}>Log In</span>.
    </p>
</div>
</FormWrapper>
    </ModalContent>
  </Modal>
)}
{showLoginModal && (
  <Modal>
    <ModalContent>
      <ModalBackground2 />
      <CloseButton onClick={closeModal}>&times;</CloseButton>
      <GirlImage2 src={GirlImage} alt="Girl" /> 
      <LogoImage2 src={LogoImage} alt="Logo" />
      <ModalTitle style={{ marginLeft: '50px' }}>Log In</ModalTitle>
      <FormContainer style={{ flexDirection: 'column', height: '535px' }}>
        <TextFieldContainer>
          <label htmlFor="email">Email:</label>
          <TextField id="email" required />
        </TextFieldContainer>

        <TextFieldContainer>
          <label htmlFor="password">Password:</label>
          <TextField id="password" required />
        </TextFieldContainer>
      </FormContainer>

      <FormWrapper>
        <ButtonContainer>
          <SubmitButton type="submit" style={{ marginTop: '280px', width: '500px' }}>Log In</SubmitButton>
        </ButtonContainer>

        <div style={{ position: 'relative', right: '695px', marginTop: '10px', textAlign: 'left' }}>
          <p style={{ margin: '0', display: 'block', opacity: 0.7 }}>
            Don't have an account? <span style={{ cursor: 'pointer', color: '#0090AA' }} onClick={switchToSignUp}>Sign Up</span>.
          </p>
          <p style={{ margin: '0', display: 'block', opacity: 0.5, marginTop: '-110px', textAlign: 'right', fontStyle: 'italic', marginRight: '-250px' }}>
            <a href="/forgot-password" style={{ color: '#686161', textDecoration: 'underline', cursor: 'pointer' }}>Forgot your password?</a>
          </p>
        </div>
      </FormWrapper>
    </ModalContent>
  </Modal>
)}


      {showNotificationModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <p>You need to log in to play the game.</p>
          </ModalContent>
        </Modal>
      )}
    </AppContainer>
  );
};

export default LandingPageApp;

