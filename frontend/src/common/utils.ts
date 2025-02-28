/*
 * Requests the browser for a fullscreen.
 */
export function requestFullScreen(): void {
    document.documentElement
        .requestFullscreen()
        .then()
        .catch(() => {
            alert("This browser does not support fullscreen feature.");
        });
}
