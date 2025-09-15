import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchSection } from '@/components/SearchSection';
import { UserProfile } from '@/components/UserProfile';
import { RepositoryList } from '@/components/RepositoryList';
import { LanguageChart } from '@/components/LanguageChart';
import { LanguageFilters, FilterOptions } from '@/components/LanguageFilters';
import { ConfigPanel } from '@/components/ConfigPanel';
import { ErrorCard } from '@/components/ErrorCard';
import { LoadingCard } from '@/components/LoadingCard';
import {
  analyzeProfile,
  getLanguages,
  addRecentSearch,
  getRecentSearches,
  loadApiConfig,
  AnalyzeResponse,
  LanguagesResponse,
  ApiError,
} from '@/utils/api';

interface SearchResults {
  analyze: {
    data: AnalyzeResponse | null;
    loading: boolean;
    error: Error | null;
  };
  languages: {
    data: LanguagesResponse | null;
    loading: boolean;
    error: Error | null;
  };
}

const Index = () => {
  const [configOpen, setConfigOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    analyze: { data: null, loading: false, error: null },
    languages: { data: null, loading: false, error: null },
  });
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    recentMonths: 12,
    includeForks: false,
    includeArchived: false,
    repoLimit: 20, // Cambiar de 30 a 20 (máximo permitido por la API)
  });

  // Load initial data and handle shared URLs
  useEffect(() => {
    loadApiConfig();
    setRecentSearches(getRecentSearches());
    
    // Handle shared profile URLs
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUsername = urlParams.get('u');
    if (sharedUsername) {
      setCurrentUsername(sharedUsername);
      addRecentSearch(sharedUsername);
      setRecentSearches(getRecentSearches());
    }
  }, []);

  // Fetch both analyze and language data when filters change or initial load from URL
  useEffect(() => {
    if (currentUsername) {
      fetchAnalyze(currentUsername);
      fetchLanguages(currentUsername);
    }
  }, [filters, currentUsername]);

  const resetResults = () => {
    setSearchResults({
      analyze: { data: null, loading: false, error: null },
      languages: { data: null, loading: false, error: null },
    });
    setCurrentUsername('');
  };

  const fetchAnalyze = async (username: string) => {
    setSearchResults(prev => ({
      ...prev,
      analyze: { data: null, loading: true, error: null }
    }));

    try {
      const data = await analyzeProfile(username, { reposLimit: filters.repoLimit });
      setSearchResults(prev => ({
        ...prev,
        analyze: { data, loading: false, error: null }
      }));
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        analyze: { data: null, loading: false, error: error as Error }
      }));
    }
  };

  const fetchLanguages = async (username: string) => {
    setSearchResults(prev => ({
      ...prev,
      languages: { data: null, loading: true, error: null }
    }));

    try {
      const data = await getLanguages(username, filters);
      setSearchResults(prev => ({
        ...prev,
        languages: { data, loading: false, error: null }
      }));
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        languages: { data: null, loading: false, error: error as Error }
      }));
    }
  };

  const handleSearch = async (username: string) => {
    setCurrentUsername(username);
    addRecentSearch(username);
    setRecentSearches(getRecentSearches());

    // Reset results
    resetResults();

    // Fetch both analyze and languages data in parallel
    await Promise.all([
      fetchAnalyze(username),
      fetchLanguages(username),
    ]);
  };

  const handleRetryAnalyze = () => {
    if (currentUsername) {
      fetchAnalyze(currentUsername);
    }
  };

  const handleRetryLanguages = () => {
    if (currentUsername) {
      fetchLanguages(currentUsername);
    }
  };

  const isLoading = searchResults.analyze.loading || searchResults.languages.loading;
  const hasResults = searchResults.analyze.data || searchResults.languages.data;

  return (
    <div className="min-h-screen bg-background">
      <Header onConfigOpen={() => setConfigOpen(true)} currentUsername={currentUsername} />
      
      <main>
        <SearchSection 
          onSearch={handleSearch}
          isLoading={isLoading}
          recentSearches={recentSearches}
        />

        {/* Filters Section - Always Visible */}
        <section className="py-4 px-4 bg-surface/50">
          <div className="container mx-auto max-w-7xl">
            <LanguageFilters
              filters={filters}
              onFiltersChange={setFilters}
              isLoading={isLoading}
            />
          </div>
        </section>

        {hasResults && (
          <section className="py-8 px-4">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - User Profile & Repositories */}
                <div className="space-y-6">
                  {searchResults.analyze.loading && (
                    <LoadingCard title="Candidate Summary" type="profile" />
                  )}
                  
                  {searchResults.analyze.error && (
                    <ErrorCard 
                      error={searchResults.analyze.error}
                      title="Failed to load profile"
                      onRetry={handleRetryAnalyze}
                    />
                  )}
                  
                  {searchResults.analyze.data && (
                    <>
                      <UserProfile user={searchResults.analyze.data.user} />
                      <RepositoryList repositories={searchResults.analyze.data.repos} />
                    </>
                  )}
                </div>

                {/* Right Column - Language Analysis */}
                <div className="space-y-6">
                  {searchResults.languages.loading && (
                    <LoadingCard title="Language Mix (%)" type="chart" />
                  )}
                  
                  {searchResults.languages.error && (
                    <ErrorCard 
                      error={searchResults.languages.error}
                      title="Failed to load languages"
                      onRetry={handleRetryLanguages}
                    />
                  )}
                  
                  {searchResults.languages.data && (
                    <LanguageChart data={searchResults.languages.data} />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <ConfigPanel 
        open={configOpen} 
        onOpenChange={setConfigOpen} 
      />
    </div>
  );
};

export default Index;
