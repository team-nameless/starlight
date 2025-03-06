import TextField from "@atlaskit/textfield";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoImage from "../assets/images/background-image/logoo.png";
import GirlImage from "../assets/images/modal-image/girlimage.png";
import "../assets/stylesheets/LandingPage.css";
import {
    AppContainer,
    BackgroundLandingPage,
    ButtonContainer,
    CloseButton,
    EyeIcon,
    FormContainer,
    FormWrapper,
    GirlImage2,
    GlobalStyle,
    Hero,
    LoginButton,
    LogoImage2,
    Modal,
    ModalBackground2,
    ModalContent,
    ModalTitle,
    NavButtons,
    PlayButton,
    PlayIconContainer,
    SignUpButton,
    SubmitButton,
    TextFieldContainer,
    PopupOverlay,
    PopupContent,
    StayButton
} from "../modalstyle/PopUpModals.tsx";  
import { requestFullScreen } from "./utils.ts";
import { apiHost } from "../common/site_setting.ts";

function LandingPage() {
    const [handle, setHandle] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [data, setData] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginReminderModal, setShowLoginReminderModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("login") != null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [handleError, setHandleError] = useState("");
    const [signUpPasswordError, setSignUpPasswordError] = useState("");
    const [loginPasswordError, setLoginPasswordError] = useState("");
    const [signUpEmailError, setSignUpEmailError] = useState("");
    const [loginEmailError, setLoginEmailError] = useState("");
    const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");
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

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setHandleError("");
        setSignUpEmailError("");
        setSignUpPasswordError("");
        setIsLoading(true);

        let formHasError = false;

        if (handle.trim() === "") {
            setHandleError("Player Name is required");
            formHasError = true;
        }

        if (email.trim() === "") {
            setSignUpEmailError("Email is required");
            formHasError = true;
        } else if (!/^[\w-]+(\.[\w-]+)*@gmail\.com$/.test(email)) {
            setSignUpEmailError("Please enter a valid Gmail address (e.g. example@gmail.com)");
            formHasError = true;
        }

        if (!passwordRegex.test(password)) {
            setSignUpPasswordError(
                "Password must be at least 8 characters, include a number, a lowercase letter, an uppercase letter, and a special character (@, !, #, $, %, *)"
            );

            formHasError = true;
        }

        if (formHasError) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${apiHost}/api/register`,
                { handle, email, password },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            console.log("API response:", response);
            setData(response.data);
            setShowSignUpModal(false);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error("Error fetching data:", error);

            if (error.response && error.response.status === 400 && error.response.data) {
                const errorMessage = error.response.data;

                if (errorMessage.includes("DuplicateEmail")) {
                    setSignUpEmailError("Email already exists");
                }
            } else {
                alert("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        setLoginEmailError("");
        setLoginPasswordError("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${apiHost}/api/login`,
                { email: loginEmail, password: loginPassword },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            setData(response.data);
            setIsLoggedIn(true);
            setShowLoginModal(false);
            setShowLoginSuccessModal(true);
            localStorage.setItem("login", "true");
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setLoginEmailError("User not found. Please check your email and password.");
                setLoginPasswordError("");
            } else {
                console.error("Error logging in:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayButtonClick = () => {
        if (!isLoggedIn) {
            setShowLoginReminderModal(true);
        } else {
            requestFullScreen();
            navigate("/SongPage"); 
        }
    };

    const closeModal = () => {
        setShowLoginModal(false);
        setShowSignUpModal(false);
        setShowNotificationModal(false);
        setShowSuccessModal(false);
        setShowLoginSuccessModal(false);
        setShowForgotPasswordModal(false);
        setShowLoginReminderModal(false);
    };

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

    const handleForgotPassword = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setForgotPasswordError("");
        setIsLoading(true);

        if (forgotPasswordEmail.trim() === "") {
            setForgotPasswordError("Please fill in email");
            setIsLoading(false);
            return;
        } else if (!/^[\w-]+(\.[\w-]+)*@gmail\.com$/.test(forgotPasswordEmail)) {
            setForgotPasswordError("Please enter a valid Gmail address (e.g. example@gmail.com)");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${apiHost}/api/forgotPassword`,
                { email: forgotPasswordEmail },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (response.status === 200) {
                closeModal();
                setShowNotificationModal(true);
            }
        } catch (error: any) {
            setForgotPasswordError("Failed to send reset code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const openForgotPasswordModal = () => {
        closeModal();
        setShowForgotPasswordModal(true);
    };
    /*
    const handleResetPassword = async e => {
        e.preventDefault();
        setForgotPasswordError("");
        setIsLoading(true);
        if (!passwordRegex.test(newPassword)) {
            setResetPasswordError(
                "Password must be at least 8 characters, include a number, a lowercase letter, an uppercase letter, and a special character."
            );
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${apiHost}/api/resetPassword`,
                { email: forgotPasswordEmail, code: forgotPasswordCode, newPassword },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (response.status === 200) {
                setShowResetPasswordModal(false);
                setShowSuccessModal(true);
            }
        } catch (error) {
            setResetPasswordError("Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };
*/
    return (
        <>
            <GlobalStyle />
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
                    <PlayButton onClick={handlePlayButtonClick} style={{ position: "relative", zIndex: 2 }}>
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
                            <FormContainer
                                style={{ flexDirection: "column", justifyContent: "space-between", height: "535px" }}
                            >
                                <form onSubmit={handleSubmit}>
                                    <TextFieldContainer>
                                        <label htmlFor="playerName">Player Name:</label>
                                        <TextField
                                            id="playerName"
                                            value={handle}
                                            onChange={e => setHandle((e.target as HTMLInputElement).value)}
                                            maxLength={14}
                                            required
                                        />
                                        {handleError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>{handleError}</span>
                                        )}
                                    </TextFieldContainer>
                                    <TextFieldContainer>
                                        <label htmlFor="email">Email:</label>
                                        <TextField
                                            id="email"
                                            value={email}
                                            onChange={e => setEmail((e.target as HTMLInputElement).value)}
                                            required
                                        />
                                        {signUpEmailError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>{signUpEmailError}</span>
                                        )}
                                    </TextFieldContainer>
                                    <TextFieldContainer>
                                        <label htmlFor="password">Password:</label>
                                        <div className="password-container">
                                            <TextField
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={e => setPassword((e.target as HTMLInputElement).value)}
                                                required
                                            />
                                            <EyeIcon onClick={togglePasswordVisibility}>
                                                {showPassword ? "🙉" : "🙈"}
                                            </EyeIcon>
                                        </div>
                                        {signUpPasswordError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>
                                                Password must be at least 8 characters, include a number, a lowercase
                                                letter, an uppercase letter
                                                <br />
                                                and a special character (@, !, #, $, %, *)
                                            </span>
                                        )}
                                    </TextFieldContainer>
                                    <FormWrapper>
                                        <ButtonContainer>
                                            <SubmitButton type="submit">Create Account</SubmitButton>
                                        </ButtonContainer>
                                        <div
                                            style={{
                                                position: "relative",
                                                right: "0px",
                                                marginTop: "10px",
                                                textAlign: "left"
                                            }}
                                        >
                                            <p style={{ margin: "0", display: "block", opacity: 0.7 }}>
                                                Already have an account?{" "}
                                                <span
                                                    style={{ cursor: "pointer", color: "#0090AA" }}
                                                    onClick={switchToLogin}
                                                >
                                                    Log In
                                                </span>
                                                .
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
                            <ModalTitle style={{ marginLeft: "50px" }}>Log In</ModalTitle>
                            <form onSubmit={handleLogin}>
                                <FormContainer style={{ flexDirection: "column", justifyContent: "content-between" }}>
                                    <TextFieldContainer>
                                        <label htmlFor="loginEmail">Email:</label>
                                        <TextField
                                            id="loginEmail"
                                            value={loginEmail}
                                            onChange={e => setLoginEmail((e.target as HTMLInputElement).value)}
                                            required
                                        />
                                        {loginEmailError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>{loginEmailError}</span>
                                        )}
                                    </TextFieldContainer>
                                    <TextFieldContainer>
                                        <label
                                            htmlFor="loginPassword"
                                            style={{
                                                display: "block",
                                                marginBottom: "12px",
                                                fontSize: "16px",
                                                width: "471px"
                                            }}
                                        >
                                            Password:
                                        </label>
                                        <div className="password-container">
                                            <TextField
                                                id="loginPassword"
                                                type={showLoginPassword ? "text" : "password"}
                                                value={loginPassword}
                                                onChange={e => setLoginPassword((e.target as HTMLInputElement).value)}
                                                required
                                            />
                                            <EyeIcon onClick={toggleLoginPasswordVisibility}>
                                                {showLoginPassword ? "🙉" : "🙈"}
                                            </EyeIcon>
                                        </div>
                                        {loginPasswordError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>{loginPasswordError}</span>
                                        )}
                                    </TextFieldContainer>
                                </FormContainer>
                                <FormWrapper>
                                    <ButtonContainer>
                                        <div style={{ marginTop: "-80px", marginBottom: "165px" }}>
                                            <SubmitButton type="submit" style={{ width: "470px", marginLeft: "22px" }}>
                                                Log In
                                            </SubmitButton>
                                        </div>
                                    </ButtonContainer>
                                    <div
                                        style={{
                                            position: "relative",
                                            right: "-20px",
                                            marginTop: "10px",
                                            textAlign: "left"
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: "0",
                                                display: "block",
                                                opacity: 0.7,
                                                marginTop: "-150px",
                                                marginRight: "0px"
                                            }}
                                        >
                                            Don't have an account?{" "}
                                            <span
                                                style={{ cursor: "pointer", color: "#0090AA" }}
                                                onClick={switchToSignUp}
                                            >
                                                Sign Up
                                            </span>
                                            .
                                        </p>
                                        <p
                                            style={{
                                                margin: "0",
                                                display: "block",
                                                opacity: 0.5,
                                                marginTop: "-125px",
                                                textAlign: "right",
                                                fontStyle: "italic",
                                                marginRight: "-220px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#686161",
                                                    textDecoration: "underline",
                                                    cursor: "pointer"
                                                }}
                                                onClick={openForgotPasswordModal}
                                            >
                                                Forgot your password?
                                            </span>
                                        </p>
                                    </div>
                                </FormWrapper>
                            </form>
                        </ModalContent>
                    </Modal>
                )}


                {showSuccessModal && (
                    <PopupOverlay>
                        <PopupContent>
                            <h2>Register successful</h2>
                            <p>Please log in to play the game.</p>
                            <StayButton onClick={closeModal}>
                                Close
                            </StayButton>
                        </PopupContent>
                    </PopupOverlay>
                )}

                {showNotificationModal && (
                    <PopupOverlay>
                        <PopupContent>
                            <h2>Notification</h2>
                            <p>A temporary password has been sent to your email. Please use it to log in.</p>
                            <p>*Hint*: Change your new password in Profile is advised for increased security.</p>
                            <StayButton
                                onClick={() => {
                                    closeModal();
                                    setShowLoginModal(true);
                                }}
                            >
                                Close
                            </StayButton>
                        </PopupContent>
                    </PopupOverlay>
                )}

                {showLoginSuccessModal && (
                    <PopupOverlay>
                        <PopupContent>
                            <h2>Login Successful</h2>
                            <p>
                                You have successfully logged in. Please click the "Start Game" button to enter the song
                                page.
                            </p>
                            <StayButton onClick={closeModal}>
                                Close
                            </StayButton>
                        </PopupContent>
                    </PopupOverlay>
                )}

                {showForgotPasswordModal && (
                    <Modal>
                        <ModalContent style={{ maxWidth: "750px", height: "350px", top: "100px" }}>
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
                                            onChange={e => setForgotPasswordEmail((e.target as HTMLInputElement).value)}
                                            required
                                        />
                                        {forgotPasswordError && (
                                            <span style={{ color: "red", fontSize: "10px" }}>
                                                {forgotPasswordError}
                                            </span>
                                        )}
                                    </TextFieldContainer>
                                    <ButtonContainer>
                                        <SubmitButton type="submit">Send</SubmitButton>
                                    </ButtonContainer>
                                </form>
                            </FormContainer>
                        </ModalContent>
                    </Modal>
                )}

                {showLoginReminderModal && (
                    <PopupOverlay>
                        <PopupContent>
                            <h2>Notification</h2>
                            <p>Please log in to continue.</p>
                            <StayButton onClick={() => setShowLoginReminderModal(false)}>
                                Close
                            </StayButton>
                        </PopupContent>
                    </PopupOverlay>
                )}

                {data && <div>{JSON.stringify(data)}</div>}
            </AppContainer>
        </>
    );
}

export default LandingPage;
