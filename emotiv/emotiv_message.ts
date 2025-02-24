export const connectMessage = {
    id: 1,
    jsonrpc: "2.0",
    method: "requestAccess",
    params: {
        clientId: "vjMBqB8DFsCLgmhBInToyO4ucsHTOU83NSuphSDT",
        clientSecret:
            "1zqdwEGengT8sYLO74IFh9kAxPoLFrcTN3WPAzN5WX2thDq9oDuIuKXwnObYMiNTveRW3tsBsuQMkouMC7qMuxMBA1Ci33O2QMjrxSObovRh0EcHDToe1a3xvE9OhQBV"
    }
};

export const authorizeMessage = {
    id: 1,
    jsonrpc: "2.0",
    method: "authorize",
    params: {
        clientId: "vjMBqB8DFsCLgmhBInToyO4ucsHTOU83NSuphSDT",
        clientSecret:
            "1zqdwEGengT8sYLO74IFh9kAxPoLFrcTN3WPAzN5WX2thDq9oDuIuKXwnObYMiNTveRW3tsBsuQMkouMC7qMuxMBA1Ci33O2QMjrxSObovRh0EcHDToe1a3xvE9OhQBV"
    }
};

export const sessionMessaage = {
    id: 1,
    jsonrpc: "2.0",
    method: "createSession",
    params: {
        cortexToken: "xxx",
        headset: "yyy",
        status: "active"
    }
};

export const queryMessage = {
    id: 1,
    jsonrpc: "2.0",
    method: "queryHeadsets",
    params: {
        id: "EPOC-*"
    }
};
