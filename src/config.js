// Single place to edit if ClaimGuard's URL needs to change last-minute
// (e.g. a different port, or a real hosted domain instead of localhost)
// without hunting through every component that links to it. Still
// overridable per-deployment via this module's own cfg block in
// openimis.json ("fe-claimguard": { "claimguardBaseUrl": "..." }) -- see
// modulesManager.getConf(...) calls in the components below -- but for a
// same-machine demo, editing this one constant and rebuilding is the
// fastest path.
export const CLAIMGUARD_BASE_URL = "http://localhost:5173";
