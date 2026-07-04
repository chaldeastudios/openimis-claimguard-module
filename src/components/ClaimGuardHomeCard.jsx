import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { Grid, Paper, Typography, Button, Chip, CircularProgress } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FormattedMessage, withModulesManager } from "@openimis/fe-core";

const MODULE_NAME = "fe-claimguard";
// Both openIMIS and ClaimGuard run locally on the same machine for this
// demo, so this points straight at ClaimGuard's local dev port.
const DEFAULT_BASE_URL = "http://localhost:5173";

const RISK_COLORS = { High: "#c0392b", Medium: "#c8791f", Low: "#5a7d4b" };

function fmtKES(n) {
  return "KES " + Number(n || 0).toLocaleString("en-KE");
}

function StatTile({ label, value, accent }) {
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <div style={{ padding: 14, borderRadius: 10, background: "rgba(0,0,0,0.035)" }}>
        <Typography variant="h5" style={accent ? { color: accent } : undefined}>
          {value}
        </Typography>
        <Typography variant="caption" style={{ opacity: 0.7 }}>
          {label}
        </Typography>
      </div>
    </Grid>
  );
}

// Rendered on the openIMIS home page via the "home.HomePage.Blocks"
// contribution point (see ../index.jsx and openimis-fe-home_js's
// HomePageContainer.jsx, which renders every registered block inside its
// welcome-message Grid). Fetches a live, pre-aggregated summary straight
// from ClaimGuard's own backend (a public server route -- see
// claimguard-vision-dash's src/routes/api.claimguard-summary.ts) so this
// card shows real, current numbers rather than a static blurb, plus a
// button through to the full dashboard for anything deeper.
function ClaimGuardHomeCard({ modulesManager }) {
  const baseUrl = modulesManager.getConf(
    MODULE_NAME,
    "claimguardBaseUrl",
    DEFAULT_BASE_URL
  );
  const [state, setState] = useState({ loading: true, error: false, data: null });

  useEffect(() => {
    let cancelled = false;
    fetch(`${baseUrl}/api/claimguard-summary`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: false, data });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, error: true, data: null });
      });
    return () => {
      cancelled = true;
    };
  }, [baseUrl]);

  return (
    <Grid size={12}>
      <Paper style={{ padding: 24, marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <Typography variant="h6">
              <FormattedMessage module="claimguard" id="home.title" />
            </Typography>
            <Typography variant="body2" style={{ marginTop: 8, opacity: 0.85 }}>
              <FormattedMessage module="claimguard" id="home.body" />
            </Typography>
          </div>
          <Button
            variant="contained"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={() =>
              window.open(`${baseUrl}/dashboard`, "_blank", "noopener,noreferrer")
            }
          >
            <FormattedMessage module="claimguard" id="home.openDashboard" />
          </Button>
        </div>

        {state.loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">
              <FormattedMessage module="claimguard" id="home.loading" />
            </Typography>
          </div>
        )}

        {state.error && (
          <Typography variant="body2" color="error" style={{ marginTop: 24 }}>
            <FormattedMessage module="claimguard" id="home.loadError" />
          </Typography>
        )}

        {state.data && (
          <>
            <Grid container spacing={2} style={{ marginTop: 8 }}>
              <StatTile
                label={<FormattedMessage module="claimguard" id="home.stat.queue" />}
                value={state.data.totalClaims}
              />
              <StatTile
                label={<FormattedMessage module="claimguard" id="home.stat.highRisk" />}
                value={state.data.high}
                accent={RISK_COLORS.High}
              />
              <StatTile
                label={<FormattedMessage module="claimguard" id="home.stat.valueAtRisk" />}
                value={fmtKES(state.data.valueAtRisk)}
              />
              <StatTile
                label={<FormattedMessage module="claimguard" id="home.stat.pending" />}
                value={state.data.pendingClaims}
              />
            </Grid>

            <Typography variant="subtitle2" style={{ marginTop: 28 }}>
              <FormattedMessage module="claimguard" id="home.recentFlagged" />
            </Typography>
            <div style={{ marginTop: 4 }}>
              {state.data.recentFlagged.length === 0 && (
                <Typography variant="body2" style={{ opacity: 0.7, marginTop: 8 }}>
                  <FormattedMessage module="claimguard" id="home.noFlagged" />
                </Typography>
              )}
              {state.data.recentFlagged.map((c) => (
                <div
                  key={c.uuid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 0",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Typography variant="body2" style={{ fontWeight: 600 }} noWrap>
                      {c.code} — {c.patient}
                    </Typography>
                    <Typography variant="caption" style={{ opacity: 0.7 }} noWrap>
                      {c.facility} · {fmtKES(c.amount)}
                    </Typography>
                  </div>
                  <Chip
                    size="small"
                    label={`${c.riskLevel} · ${c.riskScore}`}
                    style={{
                      backgroundColor: RISK_COLORS[c.riskLevel] || "#888",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Paper>
    </Grid>
  );
}

export default withModulesManager(injectIntl(ClaimGuardHomeCard));
