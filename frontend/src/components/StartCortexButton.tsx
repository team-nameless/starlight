import { useEffect, useState } from "react";

import "../assets/stylesheets/StartCortexButton.css";
import { isCortexServerRunning } from "../utils/CortexServerUtils";

interface StartCortexButtonProps {
    onServerStarted?: () => void;
}

const StartCortexButton: React.FC<StartCortexButtonProps> = ({ onServerStarted }) => {
    const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    // Check if the server is running when component mounts
    useEffect(() => {
        const checkServer = async () => {
            setIsChecking(true);
            const running = await isCortexServerRunning();
            setIsServerRunning(running);
            setIsChecking(false);

            if (running && onServerStarted) {
                onServerStarted();
            }
        };

        // Check immediately
        checkServer();

        // Then check periodically
        const interval = setInterval(checkServer, 5000);

        return () => clearInterval(interval);
    }, [onServerStarted]);

    return (
        <div className="cortex-server-status">
            {isChecking ? (
                <p>Checking Cortex server status...</p>
            ) : isServerRunning ? (
                <p className="server-status running">✅ Cortex server is running</p>
            ) : (
                <div className="server-status not-running">
                    <p>❌ Cortex server is not running</p>
                    <details>
                        <summary>How to start the server</summary>
                        <pre>
                            To start the Cortex server, open a terminal and run: cd emotiv npm run
                            start:server In a separate terminal, run: npm run start:simple
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default StartCortexButton;
