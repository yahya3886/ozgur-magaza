const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FDROID_INDEX_URL = "https://f-droid.org/repo/index-v1.json";
const FDROID_REPO_BASE = "https://f-droid.org/repo";
const FDROID_ICON_BASE = "https://f-droid.org/repo/icons-640";
const MAX_APPS = 4000;

interface FDroidApp {
  packageName: string;
  authorName?: string;
  authorEmail?: string;
  authorWebSite?: string;
  categories?: string[];
  suggestedVersionName?: string;
  suggestedVersionCode?: string;
  issueTracker?: string;
  license?: string;
  sourceCode?: string;
  added?: number;
  icon?: string;
  lastUpdated?: number;
  localized?: Record<string, {
    name?: string;
    summary?: string;
    description?: string;
    whatsNew?: string;
  }>;
  antiFeatures?: string[];
  webSite?: string;
}

interface FDroidPackage {
  versionName?: string;
  versionCode?: number;
  size?: number;
  minSdkVersion?: number;
  sig?: string;
  apkName?: string;
}

function getLocalized(meta: Record<string, unknown> | undefined, field: string): string {
  if (!meta) return "";
  const enUS = (meta["en-US"] ?? meta["en"] ?? {}) as Record<string, unknown>;
  if (typeof enUS[field] === "string") return enUS[field] as string;
  const firstKey = Object.keys(meta)[0];
  if (firstKey) {
    const first = meta[firstKey] as Record<string, unknown>;
    if (typeof first[field] === "string") return first[field] as string;
  }
  return "";
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
}

function timestampToDate(ts: number): string {
  try { return new Date(ts).toISOString().split("T")[0]; } catch { return ""; }
}

function minSdkToAndroidVersion(sdk?: number): string {
  if (!sdk) return "";
  const map: Record<number, string> = {
    3: "1.5", 4: "1.6", 5: "2.0", 7: "2.1", 8: "2.2", 9: "2.3", 10: "2.3.3",
    11: "3.0", 14: "4.0", 15: "4.0.3", 16: "4.1", 17: "4.2", 18: "4.3",
    19: "4.4", 21: "5.0", 22: "5.1", 23: "6.0", 24: "7.0", 26: "8.0",
    27: "8.1", 28: "9.0", 29: "10", 30: "11", 31: "12", 33: "13", 34: "14",
  };
  return map[sdk] ?? `API ${sdk}`;
}

function transformApp(app: FDroidApp, packages: FDroidPackage[]): Record<string, unknown> | null {
  if (!app.packageName) return null;
  const name = getLocalized(app.localized, "name") || app.packageName.split(".").pop() || app.packageName;
  const summary = getLocalized(app.localized, "summary");
  const description = getLocalized(app.localized, "description");
  const whatsNew = getLocalized(app.localized, "whatsNew");

  let suggestedPkg: FDroidPackage | undefined;
  const suggCode = app.suggestedVersionCode;
  if (suggCode && packages.length > 0) {
    suggestedPkg = packages.find((p) => String(p.versionCode) === String(suggCode));
  }
  if (!suggestedPkg && packages.length > 0) suggestedPkg = packages[0];

  return {
    id: app.packageName,
    name,
    packageName: app.packageName,
    summary,
    description: description.slice(0, 5000),
    author: app.authorName || "",
    authorEmail: app.authorEmail || "",
    categories: (app.categories || []).map((c) => c.toLowerCase().replace(/\s+/g, "_")),
    iconUrl: app.icon ? `${FDROID_ICON_BASE}/${app.icon}` : "",
    screenshots: [],
    license: app.license || "",
    sourceCodeUrl: app.sourceCode || "",
    issueTrackerUrl: app.issueTracker || "",
    websiteUrl: app.authorWebSite || app.webSite || "",
    addedDate: timestampToDate(app.added ?? 0),
    lastUpdatedDate: timestampToDate(app.lastUpdated ?? 0),
    downloads: 0,
    rating: 0,
    ratingCount: 0,
    antiFeatures: app.antiFeatures || [],
    suggestedVersion: app.suggestedVersionName || suggestedPkg?.versionName || "",
    releases: suggestedPkg ? [{
      version: suggestedPkg.versionName || "",
      versionCode: suggestedPkg.versionCode || 0,
      downloadUrl: suggestedPkg.apkName ? `${FDROID_REPO_BASE}/${suggestedPkg.apkName}` : "",
      size: formatBytes(suggestedPkg.size ?? 0),
      date: timestampToDate(app.lastUpdated ?? 0),
      changelog: whatsNew,
      minAndroidVersion: minSdkToAndroidVersion(suggestedPkg.minSdkVersion),
      signature: suggestedPkg.sig || "",
    }] : [],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || MAX_APPS, MAX_APPS) : MAX_APPS;

    const response = await fetch(FDROID_INDEX_URL, {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`F-Droid index fetch failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    const fdroidApps: FDroidApp[] = data.apps || [];
    const fdroidPackages: Record<string, FDroidPackage[]> = data.packages || {};

    const transformed: Record<string, unknown>[] = [];
    for (const app of fdroidApps) {
      if (transformed.length >= limit) break;
      const pkgVersions = fdroidPackages[app.packageName] || [];
      const result = transformApp(app, pkgVersions);
      if (result) transformed.push(result);
    }

    return new Response(JSON.stringify(transformed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
