import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@atlaskit/textfield';
import './styleoflandingpage.css'; 
import axios from 'axios';
import Background from './assets/background-image/backgroundd.png';
import ModalBackground from './assets/background-image/pur.png';
import GirlImage from './assets/modal-image/girlimage.png'; 
import LogoImage from './assets/background-image/logoo.png';
import { useNavigate } from 'react-router-dom';
import {requestFullScreen} from "./utils";

const rootUrl = "https://cluster1.swyrin.id.vn";
// const rootUrl = "https://localhost:7224";

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
  left: 205px; 
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

  &.forgot-password, &.enter-code {
    top: 195px; 
    width: 50px; 
    height: 65px; 
    left: 478px; 
  }
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
  width: 100%; 
  text-align: left;
  margin-bottom: 51px;
  margin-top: -30px;
  
  label {
    display: flex; 
    margin-bottom: 10px; 
  }

  &.email-field, &.code-field {
    margin-bottom: 70px; 
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
  padding: 13px 190px; 
  border-radius: 5px; 
  cursor: pointer; 
  margin-top: -50px; 
  width: 200%;
  display: block;
  margin-left: 0px;
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
    font-size: 12.5vw;
    margin: 0;
    margin-left: 60px;
    font-family: 'Protest Revolution', serif;
    font-weight: 400;
    color: #841efc;
    margin-top: 30px;
  }

  h2 {
    font-size: 10vw;
    margin: 0;
    margin-left: 210px;
    font-family: 'Protest Revolution', serif;
    font-weight: 400;
    color: #fffdfd;
  }
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const LandingPageApp = () => {
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState(''); 
  const [loginPassword, setLoginPassword] = useState(''); 
  const [data, setData] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [handleError, setHandleError] = useState(''); 
  const [signUpPasswordError, setSignUpPasswordError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState(''); 
  const [loginEmailError, setLoginEmailError] = useState('');
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordCode, setForgotPasswordCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*]).{8,}$/;

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [showSuccessModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleError('');  
    setSignUpEmailError('');
    setSignUpPasswordError('');
    setIsLoading(true); 
  
    let formHasError = false;
    
    if (handle.trim() === '') {
      setHandleError('Player Name is required');
      formHasError = true;
    }
  
    if (email.trim() === '') {
      setSignUpEmailError('Email is required');
      formHasError = true;
    } else if (!/^[\w-]+(\.[\w-]+)*@gmail\.com$/.test(email)) {
      setSignUpEmailError('Please enter a valid Gmail address (e.g. example@gmail.com)');
      formHasError = true;
    }
  
    if (!passwordRegex.test(password)) {
      setSignUpPasswordError('Password must be at least 8 characters, include a number, a lowercase letter, an uppercase letter, and a special character (@, !, #, $, %, *)');

      formHasError = true;
    }
  
    if (formHasError) {
      setIsLoading(false); 
      return;
    }
  
    try {
      const response = await axios.post(`${rootUrl}/api/register`, { handle, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('API response:', response);
      setData(response.data); 
      setShowSignUpModal(false); 
      setShowSuccessModal(true); 
  
    } catch (error) {
      console.error('Error fetching data:', error);
  
      if (error.response && error.response.status === 400 && error.response.data) {
        const errorMessage = error.response.data;
  
        if (errorMessage.includes('DuplicateEmail')) {
          setSignUpEmailError('Email already exists');  
        }
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false); 
    }
  };
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    setLoginEmailError('');
    setLoginPasswordError('');
    setIsLoading(true); 
  
    try {
      const response = await axios.post(`${rootUrl}/api/login`, { email: loginEmail, password: loginPassword }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
  
      setData(response.data); 
      setIsLoggedIn(true);
      setShowLoginModal(false); 
      setShowLoginSuccessModal(true); 
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginEmailError('User not found. Please check your email and password.');
        setLoginPasswordError(''); 
      } else {
        console.error('Error logging in:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false); 
    }
  };

  const handlePlayButtonClick = () => {
    if (!isLoggedIn) {
      setShowNotificationModal(true);
    } else {
      requestFullScreen();
      navigate('/songpage'); 
    }
  }

  const closeModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
    setShowNotificationModal(false);
    setShowSuccessModal(false);
    setShowLoginSuccessModal(false); 
    setShowForgotPasswordModal(false);
    setShowCodeModal(false);
    setShowResetPasswordModal(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setIsLoading(true);
  
    if (forgotPasswordEmail.trim() === '') {
      setForgotPasswordError('Please fill in email');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${rootUrl}/api/forgotPassword`, { email: forgotPasswordEmail }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        closeModal();
        setShowCodeModal(true);
      }
    } catch (error) {
      setForgotPasswordError('Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openForgotPasswordModal = () => {
    closeModal();
    setShowForgotPasswordModal(true);
  };
  
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setCodeError('');
    setIsLoading(true);
  
    try {
      const encodedCode = encodeURIComponent(forgotPasswordCode); 
      const response = await axios.post(`${rootUrl}/api/verifyCode`, { email: forgotPasswordEmail, code: encodedCode }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        setShowCodeModal(false);
        setShowResetPasswordModal(true);
      }
    } catch (error) {
      setCodeError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetPasswordError('');
    setIsLoading(true);
  
    if (!passwordRegex.test(newPassword)) {
      setResetPasswordError('Password must be at least 8 characters, include a number, a lowercase letter, an uppercase letter, and a special character.');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(`${rootUrl}/api/resetPassword`, { email: forgotPasswordEmail, code: forgotPasswordCode, newPassword }, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 200) {
        setShowResetPasswordModal(false);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setResetPasswordError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  

  return (
    <AppContainer>
      {isLoading && (
        <div className="loader">
          <div className="one"></div>
          <div className="two"></div>
        </div>
      )}
      <BackgroundLandingPage>
        <header>
          <NavButtons>
            {!isLoggedIn && (
              <>
                <SignUpButton onClick={() => setShowSignUpModal(true)}>Sign up</SignUpButton>
                <LoginButton onClick={() => setShowLoginModal(true)}>Log in</LoginButton>
              </>
            )}
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
              <form onSubmit={handleSubmit}>
                <TextFieldContainer>
                  <label htmlFor="playerName">Player Name:</label>
                  <TextField
                    id="playerName"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    maxLength={14}
                    required
                  />
                  {handleError && <span style={{ color: 'red', fontSize: '10px' }}>{handleError}</span>}
                </TextFieldContainer>
                <TextFieldContainer>
                  <label htmlFor="email">Email:</label>
                  <TextField
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {signUpEmailError && <span style={{ color: 'red', fontSize: '10px' }}>{signUpEmailError}</span>}
                </TextFieldContainer>
                <TextFieldContainer>
                  <label htmlFor="password">Password:</label>
                  <div className="password-container">
                    <TextField
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <EyeIcon onClick={togglePasswordVisibility}>
                      {showPassword ? '🙉' : '🙈'}
                    </EyeIcon>
                  </div>
                  {signUpPasswordError && (
                    <span style={{ color: 'red', fontSize: '10px' }}>
                      Password must be at least 8 characters, include a number, a lowercase letter, an uppercase letter
                      <br />
                      and a special character (@, !, #, $, %, *)
                    </span>
                  )}
                </TextFieldContainer>
                <FormWrapper>
                  <ButtonContainer>
                    <SubmitButton type="submit">Create Account</SubmitButton>
                  </ButtonContainer>
                  <div style={{ position: 'relative', right: '0px', marginTop: '10px', textAlign: 'left' }}>
                    <p style={{ margin: '0', display: 'block', opacity: 0.7 }}>
                      Already have an account? <span style={{ cursor: 'pointer', color: '#0090AA' }} onClick={switchToLogin}>Log In</span>.
                    </p>
                  </div>
                </FormWrapper>
              </form>
            </FormContainer>
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
            <form onSubmit={handleLogin}>
              <FormContainer style={{ flexDirection: 'column', height: '403px', justifyContent: 'space-between' }}>
                <TextFieldContainer>
                  <label htmlFor="loginEmail">Email:</label>
                  <TextField
                    id="loginEmail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  {loginEmailError && <span style={{ color: 'red', fontSize: '10px' }}>{loginEmailError}</span>}
                </TextFieldContainer>
                <TextFieldContainer>
                  <label htmlFor="loginPassword" style={{ display: 'block', marginBottom: '12px', fontSize: '16px', width: '471px' }}>
                    Password:
                  </label>
                  <div className="password-container">
                    <TextField
                      id="loginPassword"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <EyeIcon onClick={toggleLoginPasswordVisibility}>
                      {showLoginPassword ? '🙉' : '🙈'}
                    </EyeIcon>
                  </div>
                  {loginPasswordError && <span style={{ color: 'red', fontSize: '10px' }}>{loginPasswordError}</span>}
                </TextFieldContainer>
              </FormContainer>
              <FormWrapper>
                <ButtonContainer>
                  <div style={{ marginTop: '-80px', marginBottom: '165px' }}>
                    <SubmitButton type="submit" style={{ width: '470px', marginLeft: '22px' }}>Log In</SubmitButton>
                  </div>
                </ButtonContainer>
                <div style={{ position: 'relative', right: '-20px', marginTop: '10px', textAlign: 'left' }}>
                  <p style={{ margin: '0', display: 'block', opacity: 0.7, marginTop: '-150px', marginRight: '0px' }}>
                    Don't have an account? <span style={{ cursor: 'pointer', color: '#0090AA' }} onClick={switchToSignUp}>Sign Up</span>.
                  </p>
                  <p style={{ margin: '0', display: 'block', opacity: 0.5, marginTop: '-125px', textAlign: 'right', fontStyle: 'italic', marginRight: '-220px' }}>
                    <span style={{ color: '#686161', textDecoration: 'underline', cursor: 'pointer' }} onClick={openForgotPasswordModal}>Forgot your password?</span>
                  </p>
                </div>
              </FormWrapper>
            </form>
          </ModalContent>
        </Modal>
      )}
    
      {showSuccessModal && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Register successful</h2>
            <p>Please log in to play the game.</p>
            <button className="stay-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    
      {showNotificationModal && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Warning</h2>
            <p>You need to log in to play the game.</p>
            <button className="stay-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    
      {showLoginSuccessModal && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Login Successful</h2>
            <p>You have successfully logged in. Please click the "Start Game" button to enter the song page.</p>
            <button className="stay-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
      {showForgotPasswordModal && (
        <Modal>
          <ModalContent style={{ maxWidth: '750px', height:'350px', top: '100px' }}>  
            <ModalBackground2 />
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <GirlImage2 src={GirlImage} alt="Girl" />
            <LogoImage2 src={LogoImage} alt="Logo" className="forgot-password" /> 
            <ModalTitle>Forgot Password</ModalTitle>
            <FormContainer>
              <form onSubmit={handleForgotPassword}>
                <TextFieldContainer className="email-field">
                  <label htmlFor="forgotPasswordEmail">Email:</label>
                  <TextField
                    id="forgotPasswordEmail"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                  {forgotPasswordError && <span style={{ color: 'red', fontSize: '10px' }}>{forgotPasswordError}</span>}
                </TextFieldContainer>
                <ButtonContainer>
                  <SubmitButton type="submit">Send</SubmitButton>
                </ButtonContainer>
              </form>
            </FormContainer>
          </ModalContent>
        </Modal>
      )}
    
      {showCodeModal && (
        <Modal>
          <ModalContent style={{ maxWidth: '750px', height:'350px', top: '100px' }}> 
            <ModalBackground2 />
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <GirlImage2 src={GirlImage} alt="Girl" />
            <LogoImage2 src={LogoImage} alt="Logo" className="enter-code" /> 
            <ModalTitle>Enter Code</ModalTitle>
            <FormContainer>
              <form onSubmit={handleCodeSubmit}>
                <TextFieldContainer className="code-field">
                  <label htmlFor="forgotPasswordCode">Code:</label>
                  <TextField
                    id="forgotPasswordCode"
                    value={forgotPasswordCode}
                    onChange={(e) => setForgotPasswordCode(e.target.value)}
                    required
                  />
                  {codeError && <span style={{ color: 'red', fontSize: '10px' }}>{codeError}</span>}
                </TextFieldContainer>
                <ButtonContainer>
                  <SubmitButton type="submit">Send</SubmitButton>
                </ButtonContainer>
              </form>
            </FormContainer>
          </ModalContent>
        </Modal>
      )}
    
      {showResetPasswordModal && (
        <Modal>
          <ModalContent>
            <ModalBackground2 />
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <GirlImage2 src={GirlImage} alt="Girl" />
            <LogoImage2 src={LogoImage} alt="Logo" />
            <ModalTitle>Reset Password</ModalTitle>
            <FormContainer>
              <form onSubmit={handleResetPassword}>
                <TextFieldContainer>
                  <label htmlFor="newPassword">Create New Password:</label>
                  <div className="password-container">
                    <TextField
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <EyeIcon onClick={toggleNewPasswordVisibility}>
                      {showNewPassword ? '🙉' : '🙈'}
                    </EyeIcon>
                  </div>
                </TextFieldContainer>
                {resetPasswordError && <span style={{ color: 'red', fontSize: '10px' }}>{resetPasswordError}</span>}
                <ButtonContainer>
                  <SubmitButton type="submit">Send</SubmitButton>
                </ButtonContainer>
              </form>
            </FormContainer>
          </ModalContent>
        </Modal>
      )}
    
      {data && <div>{JSON.stringify(data)}</div>}
    </AppContainer>
  );
};

export default LandingPageApp;

