/**
 * Spotify service for authentication only
 */

// Spotify API configuration
const SPOTIFY_CLIENT_ID = "1bef03542b374c53b8487ce076460427";
const REDIRECT_URI = "http://localhost:3000";
const SPOTIFY_SCOPES = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state"
].join(" ");

class SpotifyService {
    private token: string | null = null;
    private playerStateChangeCallbacks: ((state: any) => void)[] = [];

    constructor() {
        this.loadSavedToken();
    }

    /**
     * Load saved token from localStorage
     */
    private loadSavedToken(): boolean {
        try {
            const savedToken = localStorage.getItem("spotify_token");
            if (savedToken) {
                const data = JSON.parse(savedToken);
                if (data.expiry > Date.now()) {
                    console.log(
                        "Found valid saved token, expiry:",
                        new Date(data.expiry).toLocaleString()
                    );
                    this.token = data.token;
                    return true;
                } else {
                    console.log("Saved token expired, removing");
                    localStorage.removeItem("spotify_token");
                }
            }
        } catch (e) {
            console.error("Error loading saved token:", e);
        }
        return false;
    }

    /**
     * Initialize Spotify authentication flow
     */
    public authenticate(): void {
        // Clear any previous tokens
        localStorage.removeItem("spotify_token");
        this.token = null;

        // Generate a random state string for security
        const state = this.generateRandomString(16);
        localStorage.setItem("spotify_auth_state", state);

        // Build authorization URL
        const authUrl = new URL("https://accounts.spotify.com/authorize");
        authUrl.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
        authUrl.searchParams.append("response_type", "token");
        authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
        authUrl.searchParams.append("state", state);
        authUrl.searchParams.append("scope", SPOTIFY_SCOPES);
        authUrl.searchParams.append("show_dialog", "true");

        console.log("Redirecting to Spotify auth URL");

        // Redirect to Spotify login
        window.location.href = authUrl.toString();
    }

    /**
     * Process the callback from Spotify OAuth
     */
    public processCallback(): boolean {
        try {
            // Get the access token from the URL hash
            const hash = window.location.hash.substring(1);

            // Parse the fragment into key/value pairs
            const result: Record<string, string> = {};
            hash.split("&").forEach((pair) => {
                const [key, value] = pair.split("=");
                if (key && value) {
                    result[key] = decodeURIComponent(value);
                }
            });

            const accessToken = result["access_token"];

            if (accessToken) {
                // Save the token
                this.token = accessToken;
                const expiresIn = parseInt(result["expires_in"] || "3600", 10);

                localStorage.setItem(
                    "spotify_token",
                    JSON.stringify({
                        token: this.token,
                        expiry: Date.now() + expiresIn * 1000
                    })
                );

                console.log("Token saved, expires in:", expiresIn, "seconds");
                return true;
            }

            console.error("No access token found in URL hash");
            return false;
        } catch (error) {
            console.error("Error processing callback:", error);
            return false;
        }
    }

    /**
     * Check if user is authenticated with Spotify
     */
    public isAuthenticated(): boolean {
        return this.token !== null;
    }

    /**
     * Register callback for player state changes
     */
    public onPlayerStateChange(callback: (state: any) => void): void {
        this.playerStateChangeCallbacks.push(callback);
    }

    /**
     * Check if user has Spotify Premium
     * @returns Promise resolving to true if premium, false otherwise
     */
    public async checkPremiumStatus(): Promise<boolean> {
        if (!this.token) {
            return false;
        }

        try {
            const response = await fetch("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.product === "premium";
            }

            return false;
        } catch (error) {
            console.error("Error checking premium status:", error);
            return false;
        }
    }

    /**
     * Generate random string for state parameter
     */
    private generateRandomString(length: number): string {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let text = "";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
}

// Add type declaration for Spotify SDK
declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

// Create singleton instance
const spotifyService = new SpotifyService();
export default spotifyService;
