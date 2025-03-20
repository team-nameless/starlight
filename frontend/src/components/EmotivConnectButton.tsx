import { useCallback, useEffect, useState } from "react";

import "../assets/stylesheets/EmotivConnectButton.css";
import { isCortexServerRunning } from "../utils/CortexServerUtils";

interface EmotivConnectButtonProps {
    trackDuration?: number;
    onConnectStart?: () => void;
    onDataCollectionComplete?: (success: boolean) => void;
    disabled?: boolean;
}

const EmotivConnectButton: React.FC<EmotivConnectButtonProps> = ({
    trackDuration,
    onConnectStart,
    onDataCollectionComplete,
    disabled = false
}) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isCollecting, setIsCollecting] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [serverAvailable, setServerAvailable] = useState(false);

    // Check server availability
    useEffect(() => {
        let mounted = true;

        const checkServer = async () => {
            const running = await isCortexServerRunning();
            if (mounted) {
                setServerAvailable(running);
            }
        };

        checkServer();
        const interval = setInterval(checkServer, 5000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    // Handle countdown timer
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isCollecting && countdown !== null && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (isCollecting && countdown === 0) {
            setIsCollecting(false);
            setIsConnecting(false);
            setCountdown(null);
            onDataCollectionComplete?.(true);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isCollecting, countdown, onDataCollectionComplete]);

    // Function to start data collection
    const startDataCollection = useCallback(async () => {
        setIsConnecting(true);
        onConnectStart?.();

        // Check server status first
        const serverRunning = await isCortexServerRunning();
        if (!serverRunning) {
            alert(
                "Cortex server is not running. Please start it with 'npm run start:server' first."
            );
            setIsConnecting(false);
            return;
        }

        // Start countdown timer based on track duration
        const duration = trackDuration || 30;
        setCountdown(duration);
        setIsCollecting(true);

        // Simulate direct command to simple_reader (in real app, you'd use WebSocket/API)
        console.log(`Starting Emotiv data collection for ${duration} seconds`);

        // Let's trigger a fetch to the health check endpoint to simulate activity
        try {
            await fetch("http://localhost:8687", {
                method: "GET",
                headers: { Accept: "application/json" }
            });
        } catch (error) {
            console.error("Error connecting to Emotiv server:", error);
        }
    }, [trackDuration, onConnectStart]);

    // Stop data collection manually
    const stopDataCollection = useCallback(() => {
        console.log("Manually stopping Emotiv data collection");
        setIsCollecting(false);
        setIsConnecting(false);
        setCountdown(null);
        onDataCollectionComplete?.(false);
    }, [onDataCollectionComplete]);

    return (
        <div className="emotiv-connect-container">
            {!isCollecting ? (
                <button
                    className={`emotiv-connect-button ${!serverAvailable ? "server-offline" : ""}`}
                    onClick={startDataCollection}
                    disabled={disabled || isConnecting || !serverAvailable}
                >
                    {isConnecting
                        ? "Connecting..."
                        : serverAvailable
                          ? "Start Emotiv Collection"
                          : "Cortex Server Offline"}
                </button>
            ) : (
                <div className="emotiv-collecting">
                    <div className="emotiv-collecting-status">
                        Collecting brain data
                        {countdown !== null && (
                            <span className="emotiv-countdown"> ({countdown}s)</span>
                        )}
                    </div>
                    <button className="emotiv-stop-button" onClick={stopDataCollection}>
                        Stop Collection
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmotivConnectButton;
