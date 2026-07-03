// A selection action contributed to "claim.SelectionAction" -- the same
// contribution key openimis-fe-claim_js's own HealthFacilitiesPage.jsx uses
// for its "Submit all" / "Submit selected" / "Delete selected" toolbar
// buttons on the claims list. This is a real, generic extension point on
// the shared Searcher component (fe-core), NOT something specific to the
// claim module's own code -- so this needs no fork of openimis-fe-claim_js,
// unlike a literal inline per-row button, which the claims table's row
// rendering has no extension point for at all (it's a hardcoded
// itemFormatters() array inside ClaimSearcher.jsx).
//
// Select exactly one claim -> "Get AI Analysis" appears in the toolbar,
// opens that claim in ClaimGuard with ?autoAnalyze=1. Static object (not a
// component), registered directly in the module config -- no access to
// modulesManager.getConf() at this point in the load sequence, so the base
// URL is a plain constant here rather than reading the same override the
// other two ClaimGuard buttons support. Update CLAIMGUARD_BASE_URL below
// once ClaimGuard has a real deployed URL.
const CLAIMGUARD_BASE_URL = "https://claimguard.demo";

export const claimGuardSelectionAction = {
  label: "Get AI Analysis (ClaimGuard)",
  enabled: (selection) => !!selection && selection.length === 1,
  action: (selection) => {
    const claim = selection?.[0];
    if (!claim?.uuid) return;
    window.open(
      `${CLAIMGUARD_BASE_URL}/dashboard/claims/${claim.uuid}?autoAnalyze=1`,
      "_blank",
      "noopener,noreferrer"
    );
  },
};
