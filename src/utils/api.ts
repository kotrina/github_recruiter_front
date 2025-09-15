// Configuration
export const API_CONFIG = {
  baseUrl: 'https://github-recruiter.onrender.com',
  timeout: 10000,
};

export const updateApiConfig = (newBaseUrl: string) => {
  API_CONFIG.baseUrl = newBaseUrl;
  localStorage.setItem('github-interpreter-api-url', newBaseUrl);
};

export const loadApiConfig = () => {
  const savedUrl = localStorage.getItem('github-interpreter-api-url');
  if (savedUrl) {
    API_CONFIG.baseUrl = savedUrl;
  }
};

// Types
export interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
  location: string;
  company: string;
  followers: number;
  created_at: string;
  html_url: string;
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

export interface LanguageData {
  [language: string]: number;
}

export interface LanguagesResponse {
  languages: LanguageData;
  total_bytes: number;
  repo_count: number;
  skipped_forks: number;
  skipped_archived: number;
  skipped_old: number;
}

// Error types
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
export async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

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
export const analyzeProfile = async (username: string): Promise<AnalyzeResponse> => {
  const url = `${API_CONFIG.baseUrl}/analyze?username=${encodeURIComponent(username)}&repos_limit=5`;
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
    repo_limit: (options.repoLimit || 30).toString(),
    recent_months: (options.recentMonths || 12).toString(),
    include_forks: (options.includeForks || false).toString(),
    include_archived: (options.includeArchived || false).toString(),
  });

  const url = `${API_CONFIG.baseUrl}/languages?${params.toString()}`;
  return fetchJson<LanguagesResponse>(url);
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