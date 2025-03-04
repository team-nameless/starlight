export const requestFullScreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
    } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
    }
};
