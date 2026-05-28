export interface VersionServices {
    getVersionInfo: () => { 
        protocolVersions: { version: string; path: string }[];
    };
}

const versionDSP = "2025-1";
const pathDSP = "/api/v1";

export function makeVersionServices(): VersionServices {
    return {
        getVersionInfo: () => ({
            protocolVersions: [{ version: versionDSP, path: pathDSP }]
        })
    };
}