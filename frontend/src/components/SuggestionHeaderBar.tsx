import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import leaveIcon from "../assets/images/Header_Items/Leave-icon.png";
import eventsIcon from "../assets/images/Header_Items/events-icon.png";
import historyIcon from "../assets/images/Header_Items/history-icon.png";
import songsIcon from "../assets/images/Header_Items/songs-icon.png";
import storeIcon from "../assets/images/Header_Items/store-icon.png";
import logoIcon from "../assets/images/Starlight-logo.png";
import {
    LeaveButton as LeaveButtonStyled,
    LeaveIcon,
    LogoContainer,
    LogoIconImage,
    LogoText,
    LogoWrapper,
    NavIcon,
    NavIconToggle,
    NavLinksContainer,
    NavbarContainer,
    StyledLink
} from "../modalstyle/HeaderBarStyles";
import {
    LeaveButton,
    LogoutButton,
    PopupContent,
    PopupOverlay,
    StayButton
} from "../modalstyle/PopUpModals";

/**
 * Simplified HeaderBar for SuggestionPage without StarlightSong dependencies
 */
function SuggestionHeaderBar() {
    const [showPopup, setShowPopup] = useState(false);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    //const navigate = useNavigate();
    const location = useLocation();

    const handleLeaveClick = () => {
        setShowPopup(true);
    };

    const handleConfirmLeave = () => {
        window.location.href = "/";
    };

    const handleCancelLeave = () => {
        setShowPopup(false);
    };

    const handleLogoutRequest = () => {
        localStorage.removeItem("login");
        window.location.href = "/";
    };

    // Toggle animation handler (visual only, doesn't open anything)
    const handleToggleClick = () => {
        setIsToggleOpen(!isToggleOpen);
        // No sidebar functionality - just animate the toggle
    };

    // Add ESC key handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                event.preventDefault();
                setShowPopup(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            <NavbarContainer>
                {/* Add the toggle with animation but no functionality */}
                <NavIconToggle className={isToggleOpen ? "open" : ""} onClick={handleToggleClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                </NavIconToggle>

                <NavLinksContainer className="left">
                    <StyledLink to="/SongPage" active={location.pathname === "/SongPage"}>
                        <NavIcon src={songsIcon} alt="Songs" />
                        <span>Songs</span>
                    </StyledLink>

                    <StyledLink
                        to="/HistoryPage/586954/0"
                        active={location.pathname.includes("/HistoryPage")}
                    >
                        <NavIcon src={historyIcon} alt="History" />
                        <span>History</span>
                    </StyledLink>
                </NavLinksContainer>

                <LogoContainer>
                    <LogoWrapper to="/SongPage">
                        <LogoText>
                            <span>STAR</span>
                            <LogoIconImage src={logoIcon} alt="Logo" />
                            <span className="light">LIGHT</span>
                        </LogoText>
                    </LogoWrapper>
                </LogoContainer>

                <NavLinksContainer className="right">
                    <StyledLink
                        to="/SuggestionPage"
                        active={location.pathname === "/SuggestionPage"}
                    >
                        <NavIcon src={eventsIcon} alt="Events" />
                        <span>MainStream</span>
                    </StyledLink>

                    <StyledLink to="/StorePage" active={location.pathname === "/StorePage"}>
                        <NavIcon src={storeIcon} alt="Store" />
                        <span>Store</span>
                    </StyledLink>
                </NavLinksContainer>

                <LeaveButtonStyled>
                    <LeaveIcon src={leaveIcon} alt="Leave" onClick={handleLeaveClick} />
                </LeaveButtonStyled>
            </NavbarContainer>

            {showPopup && (
                <PopupOverlay>
                    <PopupContent>
                        <h2>Confirm Leave</h2>
                        <p>Are you sure you want to leave the game?</p>
                        <StayButton onClick={handleCancelLeave}>Stay</StayButton>
                        <LogoutButton onClick={handleLogoutRequest}>Logout</LogoutButton>
                        <LeaveButton onClick={handleConfirmLeave}>Leave</LeaveButton>
                    </PopupContent>
                </PopupOverlay>
            )}
        </>
    );
}

export default SuggestionHeaderBar;
