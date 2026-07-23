import React from "react";
import type { IAuditLogStats } from "../types/log.types";
import { formatNumber, calculatePercentage } from "../utils/formatting";
import {
  ShieldAlert,
  Activity,
  Globe,
  XCircle,
  Inbox,
  Globe2,
} from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface DashboardStatsProps {
  stats: IAuditLogStats | null;
  loading: boolean;
}

/** Small reusable "nothing to show" block used inside chart panels */
const EmptyPanelState: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      padding: "var(--space-6) 0",
      color: "var(--text-muted)",
    }}
  >
    <Inbox size={22} strokeWidth={1.5} />
    <div style={{ fontSize: "0.75rem", textAlign: "center" }}>{message}</div>
  </div>
);

const panelStyle: React.CSSProperties = {
  padding: "var(--space-5)",
  backgroundColor: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  display: "flex",
  flexDirection: "column",
  minHeight: "280px",
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  marginBottom: "var(--space-4)",
  color: "var(--text-primary)",
};

const getRegionCoordinates = (regionName: string): [number, number] | null => {
  const coordinates: Record<string, [number, number]> = {
    "ap-south-1": [78.9629, 20.5937],
    "us-east-1": [-77.0369, 38.9072],
    "us-west-1": [-119.4179, 36.7783],
    "eu-west-1": [-8.2439, 53.4129],
    "ap-southeast-1": [103.8198, 1.3521],
    "ap-northeast-1": [139.6917, 35.6895],
  };

  return coordinates[regionName] || null;
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  loading,
}) => {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div className="kpi-grid">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: "110px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
              }}
            />
          ))}
        </div>
        <div className="analytics-grid">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: "280px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Guard against null stats and treat "no logs yet" as an explicit empty state
  // rather than rendering blank/stale-looking cards.
  const hasData = !!stats && stats.totalLogs > 0;
  const severity = stats?.severity ?? [];
  const status = stats?.status ?? [];
  const region = stats?.region ?? [];
  const totalLogs = stats?.totalLogs ?? 0;

  const getSeverityColor = (sev: string) => {
    switch (String(sev).toUpperCase()) {
      case "CRITICAL":
        return "var(--severity-critical-text)";
      case "HIGH":
        return "var(--severity-high-text)";
      case "MEDIUM":
        return "var(--severity-medium-text)";
      case "LOW":
        return "var(--severity-low-text)";
      default:
        return "var(--severity-info-text)";
    }
  };

  const getStatusColor = (st: string) => {
    switch (String(st).toLowerCase()) {
      case "success":
        return "var(--status-success-text)";
      case "failure":
        return "var(--status-failure-text)";
      case "warning":
        return "var(--status-warning-text)";
      default:
        return "var(--text-muted)";
    }
  };

  // const REGION_PALETTE = [
  //   'var(--primary)',
  //   'var(--accent-cyan)',
  //   'var(--severity-high-text)',
  //   'var(--status-success-text)',
  //   'var(--severity-medium-text)',
  //   'var(--severity-critical-text)',
  // ];

  const criticalHighCount =
    (severity.find((s) => String(s._id).toUpperCase() === "CRITICAL")?.count ||
      0) +
    (severity.find((s) => String(s._id).toUpperCase() === "HIGH")?.count || 0);

  const successCount =
    status.find((s) => String(s._id).toLowerCase() === "success")?.count || 0;
  const failureCount =
    status.find((s) => String(s._id).toLowerCase() === "failure")?.count || 0;
  // calculatePercentage's return type isn't guaranteed to be a plain number
  // (some implementations return a formatted string), so normalize it before
  // doing arithmetic with it.
  const toPct = (count: number, total: number): number =>
    total > 0 ? Number(calculatePercentage(count, total)) || 0 : 0;
  const successPct = hasData ? toPct(successCount, totalLogs) : 0;

  // Build cumulative offsets for the severity donut chart (CSS-tricks style
  // stacked-circle donut: circumference normalized to 100).
  let cumulativeSeverityPct = 0;
  const severitySegments = severity.map((item) => {
    const pct = hasData ? toPct(item.count, totalLogs) : 0;
    const offsetBefore = cumulativeSeverityPct;
    cumulativeSeverityPct += pct;
    return { ...item, pct, offsetBefore };
  });

  const kpiCards = [
    {
      label: "Total Log Events",
      value: formatNumber(totalLogs),
      caption: hasData
        ? "Indexed across all regions"
        : "No log events recorded yet",
      valueColor: "var(--text-primary)",
      iconBg: "rgba(59, 130, 246, 0.15)",
      iconColor: "var(--primary)",
      icon: <Activity size={20} />,
    },
    {
      label: "Critical / High Alerts",
      value: formatNumber(criticalHighCount),
      caption: hasData ? "Requires security triage" : "No alerts to triage",
      valueColor: "var(--severity-critical-text)",
      iconBg: "rgba(239, 68, 68, 0.15)",
      iconColor: "var(--severity-critical-text)",
      icon: <ShieldAlert size={20} />,
    },
    {
      label: "Failed Executions",
      value: formatNumber(failureCount),
      caption: hasData
        ? "Unsuccessful status executions"
        : "No executions recorded",
      valueColor: "var(--status-failure-text)",
      iconBg: "rgba(239, 68, 68, 0.15)",
      iconColor: "var(--status-failure-text)",
      icon: <XCircle size={20} />,
    },
    {
      label: "Active Regions",
      value: hasData ? String(region.length) : "0",
      caption: hasData ? "Global cloud zones" : "No regions reporting",
      valueColor: "var(--text-primary)",
      iconBg: "rgba(6, 182, 212, 0.15)",
      iconColor: "var(--accent-cyan)",
      icon: <Globe size={20} />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {!hasData && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--space-5)",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
          }}
        >
          <Inbox size={18} color="var(--text-muted)" />
          <span>
            No audit log data is available yet. Once logs are ingested, KPIs and
            charts will populate here automatically.
          </span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            style={{
              padding: "var(--space-5)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              boxShadow: "var(--shadow-sm)",
              transition:
                "transform var(--transition-fast), border-color var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  marginTop: "var(--space-1)",
                  color: hasData ? card.valueColor : "var(--text-muted)",
                }}
                className="mono"
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-1)",
                }}
              >
                {card.caption}
              </div>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-md)",
                backgroundColor: hasData ? card.iconBg : "var(--bg-main)",
                color: hasData ? card.iconColor : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Breakdown */}
      <div className="analytics-grid">
        {/* Severity Distribution — donut chart */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Severity Distribution</div>
          {!hasData || severity.length === 0 ? (
            <EmptyPanelState message="No severity data to display" />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-4)",
                flex: 1,
                width: "100%",
              }}
            >
              {/* Donut Chart */}
              <div
                style={{
                  position: "relative",
                  width: "200px",
                  height: "200px",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 42 42"
                  style={{
                    transform: "rotate(-90deg)",
                  }}
                >
                  {/* Background Ring */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="var(--bg-main)"
                    strokeWidth="4.5"
                  />

                  {/* Severity Segments */}
                  {severitySegments.map((seg) => (
                    <circle
                      key={String(seg._id)}
                      cx="21"
                      cy="21"
                      r="15.9155"
                      fill="transparent"
                      stroke={getSeverityColor(seg._id)}
                      strokeWidth="4.5"
                      strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                      strokeDashoffset={25 - seg.offsetBefore}
                      strokeLinecap="round"
                      style={{
                        transition: "stroke-dasharray 0.5s ease",
                      }}
                    />
                  ))}
                </svg>

                {/* Center Content */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                    className="mono"
                  >
                    {formatNumber(totalLogs)}
                  </div>

                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total
                  </div>
                </div>
              </div>

              {/* Legends */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                  gap: "var(--space-3)",
                  width: "100%",
                  padding: "0 var(--space-2)",
                }}
              >
                {severitySegments.map((seg) => (
                  <div
                    key={String(seg._id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "5px",
                      minWidth: 0,
                    }}
                  >
                    {/* Color Indicator */}
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: getSeverityColor(seg._id),
                        boxShadow: `0 0 8px ${getSeverityColor(seg._id)}`,
                      }}
                    />

                    {/* Severity Name */}
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {seg._id}
                    </span>

                    {/* Count */}
                    <span
                      className="mono"
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {seg.count} ({seg.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Summary — radial gauge */}
        <div style={panelStyle}>
          <div style={panelTitleStyle}>Status Summary</div>
          {!hasData || status.length === 0 ? (
            <EmptyPanelState message="No execution status data to display" />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-3)",
                flex: 1,
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "200px",
                  height: "200px",
                }}
              >
                <svg width="200" height="200" viewBox="0 0 42 42">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke="var(--bg-main)"
                    strokeWidth="4.5"
                  />
                  <circle
                    cx="21"
                    cy="21"
                    r="15.9155"
                    fill="transparent"
                    stroke={getStatusColor("success")}
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={`${successPct} ${100 - successPct}`}
                    strokeDashoffset="25"
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: getStatusColor("success"),
                    }}
                    className="mono"
                  >
                    {successPct}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Successful
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-6)" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: getStatusColor("success"),
                    }}
                  >
                    {formatNumber(successCount)}
                  </div>
                  <div
                    style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                  >
                    Success
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: getStatusColor("failure"),
                    }}
                  >
                    {formatNumber(failureCount)}
                  </div>
                  <div
                    style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}
                  >
                    Failed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Region Breakdown */}
        <div style={panelStyle}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-3)",
            }}
          >
            <div style={panelTitleStyle}>Region Breakdown</div>

            {hasData && region.length > 0 && (
              <span
                className="mono"
                style={{
                  fontSize: "0.7rem",
                  color: "var(--accent-cyan)",
                  backgroundColor: "rgba(0, 200, 255, 0.08)",
                  border: "1px solid rgba(0, 200, 255, 0.18)",
                  borderRadius: "999px",
                  padding: "4px 9px",
                }}
              >
                {region.length} Active Region{region.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {!hasData || region.length === 0 ? (
            <div
              style={{
                minHeight: "340px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              <Globe2
                size={42}
                strokeWidth={1.2}
                style={{
                  color: "var(--accent-cyan)",
                  opacity: 0.35,
                }}
              />

              <div
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                No regional activity detected
              </div>

              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                }}
              >
                Upload audit logs to view geographic activity
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
              {/* World Map */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "230px",
                  overflow: "hidden",
                  borderRadius: "var(--radius-md)",
                  background:
                    "radial-gradient(circle at center, rgba(30, 70, 110, 0.12), transparent 65%)",
                }}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 145,
                    center: [10, 10],
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: "rgba(38, 56, 78, 0.75)",
                              stroke: "rgba(120, 150, 180, 0.22)",
                              strokeWidth: 0.45,
                              outline: "none",
                            },
                            hover: {
                              fill: "rgba(45, 130, 190, 0.65)",
                              stroke: "rgba(90, 200, 255, 0.8)",
                              strokeWidth: 0.7,
                              outline: "none",
                            },
                            pressed: {
                              fill: "var(--accent-blue)",
                              outline: "none",
                            },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Active Region Markers */}
                  {region.map((item) => {
                    const coordinates = getRegionCoordinates(String(item._id));

                    if (!coordinates) return null;

                    return (
                      <Marker key={String(item._id)} coordinates={coordinates}>
                        {/* Outer glow */}
                        <circle
                          r={13}
                          fill="var(--accent-cyan)"
                          opacity={0.12}
                        />

                        {/* Pulse ring */}
                        <circle
                          r={8}
                          fill="none"
                          stroke="var(--accent-cyan)"
                          strokeWidth={1}
                          opacity={0.5}
                        />

                        {/* Main marker */}
                        <circle
                          r={4}
                          fill="var(--accent-cyan)"
                          stroke="var(--bg-card)"
                          strokeWidth={1.5}
                        />

                        {/* Region label */}
                        <text
                          textAnchor="middle"
                          y={-12}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fill: "var(--text-primary)",
                            fontSize: "7px",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {String(item._id)}
                        </text>
                      </Marker>
                    );
                  })}
                </ComposableMap>
              </div>

              {/* Region Activity Summary */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "var(--space-3)",
                }}
              >
                {region
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 3)
                  .map((item) => {
                    const pct = toPct(item.count, totalLogs);

                    return (
                      <div
                        key={String(item._id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: "0.72rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: "var(--accent-cyan)",
                                boxShadow: "0 0 8px rgba(0, 200, 255, 0.6)",
                              }}
                            />

                            <span
                              className="mono"
                              style={{
                                color: "var(--text-secondary)",
                                fontWeight: 600,
                              }}
                            >
                              {String(item._id)}
                            </span>
                          </div>

                          <span
                            className="mono"
                            style={{
                              color: "var(--text-muted)",
                            }}
                          >
                            {item.count} events ({pct}%)
                          </span>
                        </div>

                        <div
                          style={{
                            width: "100%",
                            height: "5px",
                            backgroundColor: "var(--bg-main)",
                            borderRadius: "999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))",
                              borderRadius: "999px",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
