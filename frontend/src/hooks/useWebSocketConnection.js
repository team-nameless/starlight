import useWebSocket from 'react-use-websocket';

const useWebSocketConnection = (url) => {
    const { sendJsonMessage } = useWebSocket(url, {
        onOpen: () => console.log('WebSocket connection opened'),
        onClose: () => console.log('WebSocket connection closed'),
        shouldReconnect: () => true,
    });

    return { sendJsonMessage };
};

export default useWebSocketConnection;
