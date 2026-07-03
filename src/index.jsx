import messages_en from "./translations/en.json";
import ClaimGuardPanel from "./components/ClaimGuardPanel";
import ClaimGuardAboutPage from "./pages/ClaimGuardAboutPage";

const ROUTE_ABOUT = "claimguard/about";

// openIMIS frontend modules are npm packages that export a factory
// returning a config object read by the assembly's Contributions/ modules
// manager -- see chaldeastudios/openimis-fe_js (this repo's sibling) and
// the reference openimis-fe-claim_js module this mirrors.
//
// Two integration points:
//   1. "claim.MasterPanel" -- an extension array the claim module itself
//      renders on every claim's detail/edit page (see ClaimMasterPanel.jsx
//      in openimis-fe-claim_js), passing the loaded `claim` (uuid, code,
//      ...) as a prop. This is where the "Open in ClaimGuard" and
//      "Run AI Analysis" buttons live.
//   2. "core.MainMenu" / "core.Router" -- a normal top-level nav entry and
//      page, satisfying the hackathon's "at least one meaningful page
//      accessible from the openIMIS navigation menu" requirement on its
//      own, independent of the claim panel injection.
const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  refs: [{ key: "claimguard.route.about", ref: ROUTE_ABOUT }],
  "claim.MasterPanel": [ClaimGuardPanel],
  "core.Router": [
    {
      path: ROUTE_ABOUT,
      text: "claimguard.menu.about",
      id: "claimguard.about",
      component: ClaimGuardAboutPage,
      rights: [],
      icon: "Security",
    },
  ],
  // Two-level menu registration, matching openimis-fe-claim_js's
  // ClaimModule convention exactly: the top-level entry just declares an
  // id, and that id becomes a second contribution key holding the actual
  // route(s) shown under it.
  "core.MainMenu": [
    {
      name: "ClaimGuardMainMenu",
      id: "claimguard.MainMenu",
      text: "claimguard.mainMenu",
      icon: "Security",
    },
  ],
  "claimguard.MainMenu": [{ route: ROUTE_ABOUT }],
};

export const ClaimGuardModule = (cfg) => ({ ...DEFAULT_CONFIG, ...cfg });
