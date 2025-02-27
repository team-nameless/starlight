/**
 * Cortex API user type.
 */
type CortexUser = {
    client_id: string;
    client_secret: string;
};

/**
 * Basic Cortex API response.
 */
type CortexResponse = {
    id: number;
    json_rpc: string;
};

/**
 * Cortex API authorization response.
 */
type AuthorizationResponse = CortexResponse & {
    result: {
        cortexToken: string;
        warning: {
            code: number;
            message: string;
            licenseUrl: string;
        };
    };
};

/**
 * Cortex API headset digestion response.
 */
type HeadsetDigestionResponse = CortexResponse & {
    result: [
        {
            connectedBy: string;
            customName: string;
            dfuTypes: string[];
            dongle: number;
            firmware: number;
            firmwareDisplay: string;
            headbandPosition: null;
            id: string;
            isDfuMode: false;
            isVirtual: true;
            motionSensors: string[];
            sensors: string[];
            settings: {
                eegRate: number;
                eegRes: number;
                memsRate: number;
                memsRes: number;
                mode: string;
            };
            status: string;
            virtualHeadsetId: string;
        }
    ];
};

/**
 * Cortex API session creation response.
 */
type SessionCreationResponse = CortexResponse & {
    result: {
        appId: string;
        headset: {
            connectedBy: string;
            customName: string;
            dongle: string;
            firmware: string;
            id: string;
            motionSensors: string[];
            sensors: string[];
            settings: {
                eegRate: number;
                eegRes: number;
                memsRate: number;
                memsRes: number;
                mode: string;
            };
            status: string;
        };
        id: string;
        license: string;
        owner: string;
        recordIds: [];
        recording: boolean;
        started: string;
        status: string;
        stopped: "";
        streams: [];
    };
};
