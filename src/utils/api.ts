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