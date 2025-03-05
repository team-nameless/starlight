import styled, { createGlobalStyle } from "styled-components";

// Import the images directly in this file
import Background from "../assets/background-image/backgroundd.png";
import ModalBackground from "../assets/background-image/pur.png";

// Global styles to ensure proper sizing
export const GlobalStyle = createGlobalStyle`
  body {
    font-family: "Anta", sans-serif;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  html, body, #root {
    height: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }

  #root {
    display: flex;
    flex-direction: column;
    max-width: none !important;
  }
`;

export const AppContainer = styled.div`
    font-family: "Anta", sans-serif;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export const BackgroundLandingPage = styled.div`
    background-image: url(${Background});
    position: relative;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    z-index: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

export const ModalTitle = styled.h2`
    position: absolute;
    top: 40px;
    left: 205px;
    text-align: center;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 30px;
    width: 100%;
`;

export const ModalBackground2 = styled.div`
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

export const LogoImage2 = styled.img`
    position: absolute;
    top: 316px;
    right: 335px;
    width: 75px;
    height: 95px;
    z-index: 0;

    &.forgot-password,
    &.enter-code {
        top: 195px;
        width: 50px;
        height: 65px;
        left: 478px;
    }
`;

export const GirlImage2 = styled.img`
    width: auto;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
`;

export const SignUpButton = styled.button`
    margin-left: 10px;
    padding: 20px 30px;
    background-color: white;
    color: black;
    border: none;
    border-radius: 35px;
    font-family: "Anta", sans-serif;
    cursor: pointer;
    font-size: 20px;

    &:hover {
        background-color: #841efc;
        color: white;
    }
`;

export const LoginButton = styled.button`
    margin-left: 10px;
    padding: 20px 30px;
    background-color: #841efc;
    color: white;
    border: none;
    border-radius: 35px;
    cursor: pointer;
    font-family: "Anta", sans-serif;
    font-size: 25px;

    &:hover {
        background-color: white;
        color: black;
    }
`;

export const NavButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    font-family: "Anta", sans-serif;
    padding: 20px;
    z-index: 1;
`;

export const Modal = styled.div`
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

export const ModalContent = styled.div`
    display: flex;
    background-color: #ffffff;
    margin: 8% auto;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 80%;
    max-width: 1000px;
    position: relative;
`;

export const TextFieldContainer = styled.div`
    margin: 10px 0;
    width: 100%;
    text-align: left;
    margin-bottom: 51px;
    margin-top: -30px;

    label {
        display: flex;
        margin-bottom: 10px;
    }

    &.email-field,
    &.code-field {
        margin-bottom: 70px;
    }
`;

export const FormContainer = styled.div`
    flex: 2;
    padding: 120px;
    padding-left: 2px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 20px;
`;

export const CloseButton = styled.span`
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

export const SubmitButton = styled.button`
    background-color: #841efc;
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

export const PlayButton = styled.button`
    display: flex;
    align-items: center;
    padding: 25px 40px;
    border-radius: 55px;
    background-color: #67d920;
    color: black;
    font-size: 1.6rem;
    font-family: "Adlam Display", sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 45px;
    margin-bottom: 60px;
    z-index: 5;
    align-self: center;

    &:hover {
        background-color: black;
        color: #67d920;

        div {
            background-color: #67d920;
        }

        .play-icon {
            color: black;
        }
    }
`;

export const PlayIconContainer = styled.div`
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
        color: #67d920;
    }
`;

export const Hero = styled.div`
    text-align: center;
    padding: 15px 20px;
    z-index: 1;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 12.5vw;
        margin: 0;
        font-family: "Protest Revolution", serif;
        font-weight: 400;
        color: #841efc;
        text-align: center;
    }

    h2 {
        font-size: 10vw;
        margin: 0;
        font-family: "Protest Revolution", serif;
        font-weight: 400;
        color: #fffdfd;
        text-align: center;
    }
`;

export const EyeIcon = styled.span`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
`;

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;
