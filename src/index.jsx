import messages_en from "./translations/en.json";
import ClaimGuardPanel from "./components/ClaimGuardPanel";
import ClaimGuardAboutPage from "./pages/ClaimGuardAboutPage";
import ClaimGuardHomeCard from "./components/ClaimGuardHomeCard";

const ROUTE_ABOUT = "claimguard/about";

// openIMIS frontend modules are npm packages that export a factory
// returning a config object read by the assembly's Contributions/ modules
// manager -- see chaldeastudios/openimis-fe_js (this repo's sibling) and
// the reference openimis-fe-claim_js module this mirrors.
//
// Four integration points:
//   1. "claim.MasterPanel" -- an extension array the claim module itself
//      renders on every claim's detail/edit page (see ClaimMasterPanel.jsx
//      in openimis-fe-claim_js), passing the loaded `claim` (uuid, code,
//      ...) as a prop. This is where the "Open in ClaimGuard" and
//      "Run AI Analysis" buttons live.
//   2. "core.MainMenu" / "core.Router" -- a normal top-level nav entry and
//      page, satisfying the hackathon's "at least one meaningful page
//      accessible from the openIMIS navigation menu" requirement on its
//      own, independent of the claim panel injection.
//   3. "home.HomePage.Blocks" -- an array openimis-fe-home_js's
//      HomePageContainer renders on the post-login landing page, right
//      after the "Welcome <name>" heading.
//
// NOTE: a "claim.SelectionAction" contribution (a toolbar button on the
// claims list) was tried and removed -- fe-core renders contributions
// under that key differently than the plain {label, enabled, action}
// objects the claim module passes via its own `actions` prop, and a plain
// object there white-screened the claims list page. The claim-detail panel
// (#1) already provides the "Run AI Analysis" button, so this cost nothing.
const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  refs: [{ key: "claimguard.route.about", ref: ROUTE_ABOUT }],
  "claim.MasterPanel": [ClaimGuardPanel],
  "home.HomePage.Blocks": [ClaimGuardHomeCard],
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
