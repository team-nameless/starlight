import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

// Common styling that can be reused across pages
const activeLinkStyles = css`
    color: rgb(255, 255, 255);
    font-weight: bold;

    &::after {
        width: 100%;
        left: 0;
        background-color: rgb(255, 255, 255);
    }
`;

// Navbar related styled components
export const NavbarContainer = styled.header`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #240b36;
    height: 50px;
    padding: 0 20px;
    color: white;
    overflow: visible; /* Allow overflow for the curved effect */
    z-index: 10; /* Ensure it's above other elements */

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 80px;
        background-color: #240b36;
        border-radius: 0 0 150px 150px;
        z-index: 0;
    }
`;

export const NavIconToggle = styled.div`
    width: 30px;
    height: 22.5px;
    position: relative;
    margin: 0;
    transform: rotate(0deg);
    transition: 0.5s ease-in-out;
    cursor: pointer;
    z-index: 2;

    span {
        display: block;
        position: absolute;
        height: 4.5px;
        width: 100%;
        background: white;
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: 0.25s ease-in-out;

        &:nth-child(1) {
            top: 0px;
        }

        &:nth-child(2) {
            top: 9px;
        }

        &:nth-child(3) {
            top: 18px;
        }
    }

    &.open {
        span:nth-child(1) {
            top: 9px;
            transform: rotate(135deg);
        }

        span:nth-child(2) {
            opacity: 0;
            left: -30px;
        }

        span:nth-child(3) {
            top: 9px;
            transform: rotate(-135deg);
        }
    }
`;

export const NavLinksContainer = styled.nav`
    display: flex;
    gap: 30px;
    z-index: 1;
    font-family: "Keania One", sans-serif;

    &.left {
        margin-right: 100px;
        gap: 100px;
    }

    &.right {
        margin-left: 100px;
        gap: 100px;
    }
`;

interface StyledLinkProps {
    active?: boolean;
}

export const StyledLink = styled(Link)<StyledLinkProps>`
    color: white;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 18px;
    transition:
        color 0.3s ease,
        transform 0.3s ease;
    position: relative;

    span {
        margin-left: 8px;
        transition: color 0.3s ease;
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 50%;
        width: 0;
        height: 2px;
        background-color: white;
        transition:
            width 0.3s ease,
            left 0.3s ease;
    }

    &:hover::after {
        width: 100%;
        left: 0;
    }

    /* Apply active styles if active prop is true */
    ${props => props.active && activeLinkStyles}
`;

export const NavIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const LogoContainer = styled.div`
    position: absolute;
    left: 50%;
    top: -10px;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
`;

export const LogoWrapper = styled(Link)`
    background-color: #240b36;
    width: 200px;
    height: 75px;
    border-radius: 100% 100% 20% 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
`;

export const LogoText = styled.span`
    font-family: "Karla", sans-serif;
    font-weight: 600;
    text-align: center;
    font-size: 24px;
    color: #03dac5;

    .light {
        color: #ff6f00;
    }
`;

export const LogoIconImage = styled.img`
    width: 50px;
    height: 50px;
    margin: 10px;
    transition: transform 0.3s ease;
    vertical-align: middle;

    &:hover {
        transform: scale(1.2);
    }
`;

export const LeaveButton = styled.div`
    cursor: pointer;
    z-index: 2;
`;

export const LeaveIcon = styled.img`
    width: 26px;
    height: 26px;
`;

// Sidebar related styled components
export const SidebarContainer = styled.div`
    position: fixed;
    top: 50px;
    left: -250px;
    width: 250px;
    height: calc(100% - 50px);
    background-color: #292826;
    color: white;
    padding: 20px;
    transition: 0.3s;
    overflow-y: auto;
    z-index: 9; /* Just below navbar */

    &.open {
        width: 400px;
        left: 0;
    }

    /* Scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: #292826 #142048;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #142048;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #240b36;
        border-radius: 10px;
    }

    ul {
        list-style-type: none;
        padding-top: 20px;
        max-height: calc(100% - 70px);
        overflow-y: auto;
    }
`;

export const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #1e1e2f;
    border-radius: 5px;
    padding: 0px 10px;
    justify-content: center;
    width: 100%;

    form.search-form {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    label {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;
        align-self: center;
        margin-bottom: 0;
    }

    input.search-field {
        margin-bottom: 0;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: auto;
        align-self: center;
        height: 51px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        background-clip: padding-box;
        background-color: white;
        vertical-align: middle;
        border-radius: 0.25rem;
        border: 1px solid #e0e0e5;
        font-size: 1rem;
        width: 100%;
        line-height: 2;
        padding: 0.375rem 1.25rem;
        transition: border-color 0.2s;

        &:focus {
            transition: all 0.5s;
            box-shadow: 0 0 40px #cf486c;
            border-color: #e6547c;
            outline: none;
        }
    }

    button.search-submit {
        height: 51px;
        margin: 0;
        padding: 1rem 1.3rem;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        font-family: "Font Awesome 5 Free";
        font-size: 1rem;
        background-color: #f9d342;
        color: #292826;
        border: 1px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover,
        &:active,
        &:focus {
            background-color: #e6547c;
            color: #292826;
            outline: 0;
        }
    }
`;

export const ScreenReaderText = styled.span`
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
`;

export const SongItem = styled.li`
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 60px;
    transition: all 0.3s ease;

    /* Song Info (Default State) - Updated to match styles in SuggestionPage.css */
    .song-info-sidebar {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 3; /* Always above the background layers */
        width: 100%;
        padding-left: 10px;
    }

    .song-sidebar-icon {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        z-index: 3;
        transition: opacity 0.3s ease;
    }

    .sidebar-song {
        font-family: "Inter", sans-serif;
        font-weight: 600;
        font-style: italic;
        font-size: 18px;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* Left Split: Image Section (Initially Hidden) */
    .song-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 80%;
        height: 100%;
        z-index: 1;
        clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
        transition: clip-path 0.3s ease;
        background-size: cover;
        background-position: center;
    }

    /* Right Split: Song Title Section */
    .sidebar-song-title {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #2d2020;
        z-index: 2;
        display: none;
        align-items: center;
        justify-content: flex-start;
        padding-left: 50%;
        color: white;
        font-family: "Inter", sans-serif;
        font-weight: 600;
        font-style: italic;
        font-size: 18px;
        transition:
            clip-path 0.3s ease,
            padding-left 0.3s ease,
            opacity 0.3s ease;
    }

    /* Hover Effects - Explicitly including the song-info-sidebar display: none */
    &:hover {
        .song-sidebar-icon {
            opacity: 0;
        }

        .song-bg {
            clip-path: polygon(0 0, 70% 0, 45% 100%, 0 100%);
        }

        .sidebar-song-title {
            display: flex;
            opacity: 1;
            clip-path: polygon(55% 0, 100% 0, 100% 100%, 30% 100%);
            padding-left: 50%;
        }

        .song-info-sidebar {
            display: none;
        }
    }

    &.selected {
        background-color: rgba(132, 30, 252, 0.3);
    }
`;
