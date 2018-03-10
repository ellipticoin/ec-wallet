export const BASE_CONTRACT_ADDRESS = new Buffer("02082cf471002b5c5dfefdd6cbd30666ff02c4df90169f766877caec26ed4f88", "hex");
export const PRIVATE_KEY = new Buffer("2a185960faf3ffa84ff8886e8e2e0f8ba0fff4b91adad23108bfef5204390483b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
export const PUBLIC_KEY = new Buffer("b114ed4c88b61b46ff544e9120164cb5dc49a71157c212f76995bf1d6aecab0e", "hex");
export const ELIPITCOIN_SEED_EDGE_SERVERS = ["http://testnet-fritz.elipticoin.com:4047"]
export const HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
export const CONFIG_DIR = `${HOME}/.ec-wallet`
export const CONFIG_PATH = `${CONFIG_DIR}/config.yaml`
