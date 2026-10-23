import { useState, useEffect, useCallback } from 'react';
import type { AppItem } from '@/types';
import { FALLBACK_APPS } from '@/data';
import type { AppRepo } from '@/hooks/useRepos';
import { DEFAULT_FDROID_REPO } from '@/hooks/useRepos';

interface UseAppsResult {
  apps: AppItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function normalizeApp(raw: Record<string, unknown>, sourceRepo: string): AppItem | null {
  if (!raw.id || !raw.name) return null;
  const result: AppItem = {
    id: String(raw.id),
    name: String(raw.name),
    packageName: String(raw.packageName ?? raw.package_name ?? ''),
    summary: String(raw.summary ?? ''),
    description: String(raw.description ?? ''),
    author: String(raw.author ?? ''),
    authorEmail: String(raw.authorEmail ?? raw.author_email ?? ''),
    categories: Array.isArray(raw.categories) ? raw.categories.map(String) : [],
    iconUrl: String(raw.iconUrl ?? raw.icon_url ?? ''),
    screenshots: Array.isArray(raw.screenshots) ? raw.screenshots.map(String) : [],
    license: String(raw.license ?? ''),
    sourceCodeUrl: String(raw.sourceCodeUrl ?? raw.source_code_url ?? ''),
    issueTrackerUrl: String(raw.issueTrackerUrl ?? raw.issue_tracker_url ?? ''),
    websiteUrl: String(raw.websiteUrl ?? raw.website_url ?? ''),
    addedDate: String(raw.addedDate ?? raw.added_date ?? ''),
    lastUpdatedDate: String(raw.lastUpdatedDate ?? raw.last_updated_date ?? ''),
    downloads: Number(raw.downloads ?? 0),
    rating: Number(raw.rating ?? 0),
    ratingCount: Number(raw.ratingCount ?? raw.rating_count ?? 0),
    antiFeatures: Array.isArray(raw.antiFeatures) ? raw.antiFeatures.map(String) : [],
    suggestedVersion: String(raw.suggestedVersion ?? raw.suggested_version ?? ''),
    releases: Array.isArray(raw.releases)
      ? raw.releases.map((r) => {
          const rel = r as Record<string, unknown>;
          return {
            version: String(rel.version ?? ''),
            versionCode: Number(rel.versionCode ?? 0),
            downloadUrl: String(rel.downloadUrl ?? rel.download_url ?? ''),
            size: String(rel.size ?? ''),
            date: String(rel.date ?? ''),
            changelog: String(rel.changelog ?? ''),
            minAndroidVersion: String(rel.minAndroidVersion ?? rel.min_android_version ?? ''),
            signature: String(rel.signature ?? ''),
          };
        })
      : [],
  };
  return result;
}

export function useApps(userRepos: AppRepo[]): UseAppsResult {
  const [apps, setApps] = useState<AppItem[]>(FALLBACK_APPS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError(null);

    const sources: { name: string; url: string }[] = [];

    // Always include the default F-Droid source
    sources.push({ name: DEFAULT_FDROID_REPO.name, url: DEFAULT_FDROID_REPO.url });

    // Add enabled user repos
    for (const repo of userRepos) {
      if (repo.enabled) {
        sources.push({ name: repo.name, url: repo.url });
      }
    }

    const allApps: AppItem[] = [];
    const errors: string[] = [];

    // Fetch from all sources in parallel
    const results = await Promise.allSettled(
      sources.map(async (src) => {
        const response = await fetch(`${src.url}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`${src.name}: HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error(`${src.name}: Geçersiz veri formatı`);
        return data.map((raw: Record<string, unknown>) => normalizeApp(raw, src.name)).filter(Boolean) as AppItem[];
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allApps.push(...result.value);
      } else {
        errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
      }
    }

    if (allApps.length > 0) {
      // Deduplicate by id, preferring the first occurrence
      const seen = new Set<string>();
      const deduped = allApps.filter((a) => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
      setApps(deduped);
      if (errors.length > 0) {
        setError(`${errors.length} kaynak yüklenemedi: ${errors.join(', ')}`);
      }
    } else {
      // All sources failed — use fallback
      setApps(FALLBACK_APPS);
      setError('Hiçbir veri kaynağına ulaşılamadı. Yerel veri gösteriliyor.');
    }

    setLoading(false);
  }, [userRepos]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return { apps, loading, error, refetch: fetchApps };
}
