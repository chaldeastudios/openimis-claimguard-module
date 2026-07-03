import { injectIntl } from "react-intl";
import { Paper, Typography, Button, Box } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Helmet,
  FormattedMessage,
  withModulesManager,
  formatMessage,
} from "@openimis/fe-core";

const MODULE_NAME = "fe-claimguard";
const DEFAULT_BASE_URL = "https://claimguard.demo";

// The module's own page, registered on the main nav menu (see ../index.jsx)
// -- satisfies the "at least one meaningful page accessible from the
// openIMIS navigation menu" requirement independently of the per-claim
// panel injected into the Claim module's own pages.
function ClaimGuardAboutPage({ modulesManager, intl }) {
  const baseUrl = modulesManager.getConf(
    MODULE_NAME,
    "claimguardBaseUrl",
    DEFAULT_BASE_URL
  );

  return (
    <div className="page">
      <Helmet title={formatMessage(intl, "claimguard", "about.page.title")} />
      <Paper style={{ padding: 24, maxWidth: 640 }}>
        <Typography variant="h5">
          <FormattedMessage module="claimguard" id="about.title" />
        </Typography>
        <Typography variant="body1" style={{ marginTop: 16 }}>
          <FormattedMessage module="claimguard" id="about.body" />
        </Typography>
        <Box style={{ marginTop: 24 }}>
          <Button
            variant="contained"
            startIcon={<OpenInNewIcon />}
            onClick={() =>
              window.open(
                `${baseUrl}/dashboard`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <FormattedMessage module="claimguard" id="about.openDashboard" />
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default withModulesManager(injectIntl(ClaimGuardAboutPage));
