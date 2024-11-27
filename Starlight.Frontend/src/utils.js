/*
 Requests the browser for a fullscreen.
 This function requires **CONSCIOUS USER INTERACTION**, so
 please use this inside onClick/onChanged/whatever event.

 Yours truly,
 DUT.
 */
export const requestFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }
}
