import { injectIntl } from "react-intl";
import { Grid, Paper, Typography, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FormattedMessage, withModulesManager } from "@openimis/fe-core";

const MODULE_NAME = "fe-claimguard";
const DEFAULT_BASE_URL = "https://claimguard.demo";

// Rendered on the openIMIS home page via the "home.HomePage.Blocks"
// contribution point (see ../index.jsx and openimis-fe-home_js's
// HomePageContainer.jsx, which renders every registered block inside its
// welcome-message Grid). Deliberately simple -- one card, one link out to
// the ClaimGuard dashboard -- matching the hackathon's "at least one
// meaningful page/component accessible from openIMIS" bar rather than
// trying to duplicate ClaimGuard's own dashboard here.
function ClaimGuardHomeCard({ modulesManager }) {
  const baseUrl = modulesManager.getConf(
    MODULE_NAME,
    "claimguardBaseUrl",
    DEFAULT_BASE_URL
  );

  return (
    <Grid size={12}>
      <Paper style={{ padding: 24, marginTop: 16 }}>
        <Typography variant="h6">
          <FormattedMessage module="claimguard" id="home.title" />
        </Typography>
        <Typography variant="body2" style={{ marginTop: 8, maxWidth: 640 }}>
          <FormattedMessage module="claimguard" id="home.body" />
        </Typography>
        <Button
          variant="contained"
          size="small"
          style={{ marginTop: 16 }}
          startIcon={<OpenInNewIcon />}
          onClick={() =>
            window.open(`${baseUrl}/dashboard`, "_blank", "noopener,noreferrer")
          }
        >
          <FormattedMessage module="claimguard" id="home.openDashboard" />
        </Button>
      </Paper>
    </Grid>
  );
}

export default withModulesManager(injectIntl(ClaimGuardHomeCard));
