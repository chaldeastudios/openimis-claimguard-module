import { injectIntl } from "react-intl";
import { Grid, Typography, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  FormattedMessage,
  withModulesManager,
  GRID_RESPONSIVE_STANDARD,
} from "@openimis/fe-core";

const MODULE_NAME = "fe-claimguard";
// Overridable via this module's cfg block (see README). Both openIMIS and
// ClaimGuard run locally on the same machine for this demo, so this points
// straight at ClaimGuard's local dev port rather than a hosted domain.
const DEFAULT_BASE_URL = "http://localhost:5173";

// Rendered inside the claim detail page via the "claim.MasterPanel"
// contribution point (see ../index.jsx and openimis-fe-claim_js's
// ClaimMasterPanel.jsx, which renders every registered contribution here
// with the loaded claim -- including its uuid -- as a prop). Two actions,
// both opening ClaimGuard's own claim detail page in a new tab, keyed by
// the openIMIS claim uuid so the two systems are looking at the same
// claim: a plain link, and a link that also auto-triggers AI analysis.
function ClaimGuardPanel({ claim, modulesManager, intl }) {
  if (!claim?.uuid) return null;

  const baseUrl = modulesManager.getConf(
    MODULE_NAME,
    "claimguardBaseUrl",
    DEFAULT_BASE_URL
  );
  const claimUrl = `${baseUrl}/dashboard/claims/${claim.uuid}`;

  return (
    <Grid size={GRID_RESPONSIVE_STANDARD} className="item">
      <Typography variant="subtitle1">
        <FormattedMessage module="claimguard" id="ClaimGuardPanel.title" />
      </Typography>
      <Grid container spacing={1} style={{ marginTop: 4 }}>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={() =>
              window.open(claimUrl, "_blank", "noopener,noreferrer")
            }
          >
            <FormattedMessage
              module="claimguard"
              id="ClaimGuardPanel.openInClaimGuard"
            />
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="small"
            startIcon={<AutoAwesomeIcon />}
            onClick={() =>
              window.open(
                `${claimUrl}?autoAnalyze=1`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <FormattedMessage
              module="claimguard"
              id="ClaimGuardPanel.runAiAnalysis"
            />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withModulesManager(injectIntl(ClaimGuardPanel));
