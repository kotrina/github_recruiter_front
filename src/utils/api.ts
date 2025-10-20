import { API_BASE_URL, API_TIMEOUT } from '@/config/api.config';

// Configuration
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
};

// Types
export interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  public_repos: number;
  created_at: string;
  html_url: string;
  email: string;
  blog: string;
  twitter_username: string;
}

export interface Repository {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  pushed_at: string;
  description: string;
}

export interface AnalyzeResponse {
  user: GitHubUser;
  repos: Repository[];
}

export interface LanguageItem {
  name: string;
  bytes: number;
  percent: number;
}

export interface LanguagesResponse {
  username: string;
  analyzed_repos: string[];
  total_bytes: number;
  languages: LanguageItem[];
  percentages: { [key: string]: number };
  params: {
    repo_limit: number;
    include_forks: boolean;
    include_archived: boolean;
    recent_months: number;
  };
}

export interface CommunityRepository {
  full_name: string;
  stars: number;
  forks: number;
  watchers: number;
  pushed_at: string;
  community_score: number;
  traffic_light: 'green' | 'yellow' | 'red';
  traffic_reason: string;
  breakdown: {
    governance_0_90: number;
    governance_scaled_0_30: number;
    popularity_0_70: number;
  };
  popularity_meta: {
    inputs: {
      stars: number;
      forks: number;
      watchers: number;
    };
    targets: {
      stars: number;
      forks: number;
      watchers: number;
    };
    weights: {
      stars: number;
      forks: number;
      watchers: number;
    };
    parts: {
      stars_part: number;
      forks_part: number;
      watch_part: number;
    };
  };
  checks: {
    readme: boolean;
    license_like: boolean;
    contributing: boolean;
    maintainers: boolean;
    issue_template: boolean;
    pull_request_template: boolean;
    security_policy_like: boolean;
    docs_folder: boolean;
  };
}

export interface CommunityResponse {
  username: string;
  repos: CommunityRepository[];
  params: {
    repo_limit: number;
    include_forks: boolean;
    include_archived: boolean;
    recent_months: number;
  };
}

export interface ActivityKPIs {
  last_active_days_ago: number | null;
  active_weeks_12w: number;
  external_ratio_pct: number;
}

export interface ActivityRole {
  count: number;
  pct: number;
}

export interface ActivityRoles {
  build: ActivityRole;
  review: ActivityRole;
  feedback: ActivityRole;
  roles_total: number;
}

export interface CategoryActivity {
  count: number;
  pct_total: number;
}

export interface AllCategories {
  build: CategoryActivity;
  review: CategoryActivity;
  feedback: CategoryActivity;
  explore: CategoryActivity;
  release: CategoryActivity;
  admin: CategoryActivity;
  total_events: number;
}

export interface TopCollaboration {
  repo: string;
  prs: number;
  reviews: number;
  issues: number;
  score: number;
  last: string;
  html_url: string;
}

export interface ActivityResponse {
  username: string;
  window_days: number;
  kpis: ActivityKPIs;
  roles: ActivityRoles;
  all_categories: AllCategories;
  top_collabs: TopCollaboration[];
}

export interface AIAnalysisResponse {
  username: string;
  github_url: string;
  analysis: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function
export async function fetchJson<T>(url: string, timeoutMs?: number): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs || API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError("We couldn't find this profile on GitHub.", 404, 'NOT_FOUND');
      }
      if (response.status === 403) {
        throw new ApiError('API rate limit reached. Try again later.', 403, 'RATE_LIMIT');
      }
      if (response.status === 422) {
        // Handle validation errors from the API
        try {
          const errorData = await response.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const firstError = errorData.detail[0];
            if (firstError.msg) {
              throw new ApiError(`API validation error: ${firstError.msg}`, 422, 'VALIDATION_ERROR');
            }
          }
        } catch (jsonError) {
          // If we can't parse the error, fall back to generic message
        }
        throw new ApiError('Invalid parameters sent to API. Please check your settings.', 422, 'VALIDATION_ERROR');
      }
      if (response.status === 502 || response.status === 500) {
        // Try to get detailed error message from backend
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            throw new ApiError(errorData.detail, response.status, 'SERVER_ERROR');
          }
        } catch (jsonError) {
          // If we can't parse the error, fall back to generic message
        }
      }
      throw new ApiError('Something went wrong while fetching data.', response.status);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.');
    }
    
    throw new ApiError('Something went wrong while fetching data.');
  }
}

// API functions
export const analyzeProfile = async (
  username: string, 
  options: { reposLimit?: number } = {}
): Promise<AnalyzeResponse> => {
  const reposLimit = Math.min(20, options.reposLimit || 5); // Asegurar máximo de 20
  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const url = `${baseUrl}/analyze?username=${encodeURIComponent(username)}&repos_limit=${reposLimit}`;
  return fetchJson<AnalyzeResponse>(url);
};

export const getLanguages = async (
  username: string,
  options: {
    repoLimit?: number;
    recentMonths?: number;
    includeForks?: boolean;
    includeArchived?: boolean;
  } = {}
): Promise<LanguagesResponse> => {
  const params = new URLSearchParams({
    username: username,
    repo_limit: Math.min(20, options.repoLimit || 20).toString(), // Cambiar el valor por defecto de 30 a 20
    recent_months: (options.recentMonths || 12).toString(),
    include_forks: (options.includeForks || false).toString(),
    include_archived: (options.includeArchived || false).toString(),
  });

  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const url = `${baseUrl}/languages?${params.toString()}`;
  return fetchJson<LanguagesResponse>(url);
};

export const getCommunity = async (
  username: string,
  options: {
    repoLimit?: number;
    recentMonths?: number;
    includeForks?: boolean;
    includeArchived?: boolean;
  } = {}
): Promise<CommunityResponse> => {
  const params = new URLSearchParams({
    username: username,
    repo_limit: Math.min(100, options.repoLimit || 10).toString(),
    recent_months: (options.recentMonths || 12).toString(),
    include_forks: (options.includeForks || false).toString(),
    include_archived: (options.includeArchived || false).toString(),
  });

  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const url = `${baseUrl}/community?${params.toString()}`;
  return fetchJson<CommunityResponse>(url);
};

// Local storage helpers
export const getRecentSearches = (): string[] => {
  try {
    const saved = localStorage.getItem('github-interpreter-recent-searches');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (username: string) => {
  const recent = getRecentSearches();
  const updated = [username, ...recent.filter(u => u !== username)].slice(0, 5);
  localStorage.setItem('github-interpreter-recent-searches', JSON.stringify(updated));
};

export const getActivity = async (
  username: string,
  options: {
    days?: number;
  } = {}
): Promise<ActivityResponse> => {
  const params = new URLSearchParams({
    username: username,
    days: (options.days || 90).toString(),
  });

  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const url = `${baseUrl}/activity?${params.toString()}`;
  return fetchJson<ActivityResponse>(url);
};

// Activity days persistence
export const getActivityDays = (): number => {
  try {
    const saved = localStorage.getItem('activityDays');
    return saved ? parseInt(saved, 10) : 90;
  } catch {
    return 90;
  }
};

export const setActivityDays = (days: number) => {
  localStorage.setItem('activityDays', days.toString());
};

export const getAIAnalysis = async (username: string, language: 'en' | 'es' = 'en'): Promise<AIAnalysisResponse> => {
  const baseUrl = API_CONFIG.baseUrl.endsWith('/') ? API_CONFIG.baseUrl.slice(0, -1) : API_CONFIG.baseUrl;
  const lang = language === 'es' ? 'ES' : 'EN';
  const url = `${baseUrl}/ai_analysis?profile=${encodeURIComponent(username)}&lang=${lang}`;
  return fetchJson<AIAnalysisResponse>(url, 60000); // 60 seconds timeout for AI analysis
};

// AI Analysis cache helpers
interface CachedAIAnalysis {
  data: AIAnalysisResponse;
  timestamp: number;
}

export const getCachedAIAnalysis = (username: string, language: 'en' | 'es' = 'en'): AIAnalysisResponse | null => {
  try {
    const lang = language === 'es' ? 'ES' : 'EN';
    const key = `aiAnalysis_${username}_${lang}`;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const parsed: CachedAIAnalysis = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    if (age < twentyFourHours) {
      return parsed.data;
    }
    
    // Clear expired cache
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

export const setCachedAIAnalysis = (username: string, data: AIAnalysisResponse, language: 'en' | 'es' = 'en') => {
  try {
    const lang = language === 'es' ? 'ES' : 'EN';
    const key = `aiAnalysis_${username}_${lang}`;
    const cached: CachedAIAnalysis = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cached));
  } catch {
    // Ignore cache errors
  }
};