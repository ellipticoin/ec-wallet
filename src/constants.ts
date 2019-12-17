export const HOME =
  process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
export const CONFIG_DIR = `${HOME}/.ec-wallet`;
export const CONFIG_PATH = `${CONFIG_DIR}/config.yaml`;
