import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchSection } from '@/components/SearchSection';
import { UserProfile } from '@/components/UserProfile';
import { LanguageChart } from '@/components/LanguageChart';
import { LanguageFilters, FilterOptions } from '@/components/LanguageFilters';
import { CommunitySection } from '@/components/CommunitySection';
import { ErrorCard } from '@/components/ErrorCard';
import { LoadingCard } from '@/components/LoadingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  analyzeProfile,
  getLanguages,
  getCommunity,
  getActivity,
  getAIAnalysis,
  getCachedAIAnalysis,
  setCachedAIAnalysis,
  addRecentSearch,
  getRecentSearches,
  getActivityDays,
  AnalyzeResponse,
  LanguagesResponse,
  CommunityResponse,
  ActivityResponse,
  AIAnalysisResponse,
  ApiError,
} from '@/utils/api';
import { ActivitySection } from '@/components/ActivitySection';
import { AIAnalysisSection } from '@/components/AIAnalysisSection';
import { useToast } from '@/hooks/use-toast';

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
  community: {
    data: CommunityResponse | null;
    loading: boolean;
    error: Error | null;
  };
  activity: {
    data: ActivityResponse | null;
    loading: boolean;
    error: Error | null;
  };
  aiAnalysis: {
    data: AIAnalysisResponse | null;
    loading: boolean;
    error: Error | null;
  };
}

const Index = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    analyze: { data: null, loading: false, error: null },
    languages: { data: null, loading: false, error: null },
    community: { data: null, loading: false, error: null },
    activity: { data: null, loading: false, error: null },
    aiAnalysis: { data: null, loading: false, error: null },
  });
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    recentMonths: 12,
    includeForks: false,
    includeArchived: false,
    repoLimit: 5,
  });

  // Load initial data and handle shared URLs
  useEffect(() => {
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

  // Fetch all data when filters change or initial load from URL
  useEffect(() => {
    if (currentUsername) {
      fetchAnalyze(currentUsername);
      fetchLanguages(currentUsername);
      fetchCommunity(currentUsername);
      fetchActivity(currentUsername);
      fetchAIAnalysis(currentUsername);
    }
  }, [filters, currentUsername]);

  // Re-fetch AI analysis when language changes
  useEffect(() => {
    if (currentUsername) {
      fetchAIAnalysis(currentUsername, false); // Don't use cache on language change
    }
  }, [language]);

  const resetResults = () => {
    setSearchResults({
      analyze: { data: null, loading: false, error: null },
      languages: { data: null, loading: false, error: null },
      community: { data: null, loading: false, error: null },
      activity: { data: null, loading: false, error: null },
      aiAnalysis: { data: null, loading: false, error: null },
    });
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

  const handleExportPDF = () => {
    window.print();
  };

  const handleSearch = async (username: string) => {
    setCurrentUsername(username);
    addRecentSearch(username);
    setRecentSearches(getRecentSearches());

    // Reset results
    resetResults();

    // Fetch core data in parallel
    await Promise.all([
      fetchAnalyze(username),
      fetchLanguages(username),
      fetchCommunity(username),
      fetchActivity(username),
    ]);

    // Fetch AI analysis after core data (lower priority)
    fetchAIAnalysis(username);
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

  const fetchCommunity = async (username: string) => {
    setSearchResults(prev => ({
      ...prev,
      community: { data: null, loading: true, error: null }
    }));

    try {
      const data = await getCommunity(username, filters);
      console.log('Community API Response:', data);
      console.log('Community repositories count:', data?.repos?.length || 0);
      setSearchResults(prev => ({
        ...prev,
        community: { data, loading: false, error: null }
      }));
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        community: { data: null, loading: false, error: error as Error }
      }));
    }
  };

  const handleRetryCommunity = () => {
    if (currentUsername) {
      fetchCommunity(currentUsername);
    }
  };

  const fetchActivity = async (username: string, days?: number) => {
    setSearchResults(prev => ({
      ...prev,
      activity: { data: null, loading: true, error: null }
    }));

    try {
      const data = await getActivity(username, { days: days || getActivityDays() });
      setSearchResults(prev => ({
        ...prev,
        activity: { data, loading: false, error: null }
      }));
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        activity: { data: null, loading: false, error: error as Error }
      }));
    }
  };

  const handleRetryActivity = () => {
    if (currentUsername) {
      fetchActivity(currentUsername);
    }
  };

  const handleActivityDaysChange = (days: number) => {
    if (currentUsername) {
      fetchActivity(currentUsername, days);
    }
  };

  const fetchAIAnalysis = async (username: string, useCache = true) => {
    // Check cache first
    if (useCache) {
      const cached = getCachedAIAnalysis(username, language);
      if (cached) {
        setSearchResults(prev => ({
          ...prev,
          aiAnalysis: { data: cached, loading: false, error: null }
        }));
        // Background refresh
        fetchAIAnalysisFromAPI(username);
        return;
      }
    }

    await fetchAIAnalysisFromAPI(username);
  };

  const fetchAIAnalysisFromAPI = async (username: string) => {
    setSearchResults(prev => ({
      ...prev,
      aiAnalysis: { data: prev.aiAnalysis.data, loading: true, error: null }
    }));

    try {
      const data = await getAIAnalysis(username, language);
      setCachedAIAnalysis(username, data, language);
      setSearchResults(prev => ({
        ...prev,
        aiAnalysis: { data, loading: false, error: null }
      }));
    } catch (error) {
      setSearchResults(prev => ({
        ...prev,
        aiAnalysis: { data: null, loading: false, error: error as Error }
      }));
    }
  };

  const handleRetryAIAnalysis = () => {
    if (currentUsername) {
      fetchAIAnalysis(currentUsername, false);
    }
  };

  const isLoading = searchResults.analyze.loading || searchResults.languages.loading || searchResults.community.loading || searchResults.activity.loading;
  const hasResults = searchResults.analyze.data || searchResults.languages.data || searchResults.community.data || searchResults.activity.data;

  return (
    <div className="min-h-screen bg-background">
      <Header currentUsername={currentUsername} onExportPDF={handleExportPDF} />
      
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
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* User Profile */}
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
                  <UserProfile user={searchResults.analyze.data.user} />
                )}

                {/* Language Analysis */}
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
          </section>
        )}

        {/* Community Section - Full Width */}
        {searchResults.community.loading && (
          <section className="py-8 px-4 border-t border-border">
            <div className="container mx-auto max-w-7xl">
              <LoadingCard title="Community (OSS Health)" type="chart" />
            </div>
          </section>
        )}
        
        {searchResults.community.error && (
          <section className="py-8 px-4 border-t border-border">
            <div className="container mx-auto max-w-7xl">
              <ErrorCard 
                error={searchResults.community.error}
                title="Failed to load community data"
                onRetry={handleRetryCommunity}
              />
            </div>
          </section>
        )}
        
        {searchResults.community.data && (
          <CommunitySection data={searchResults.community.data} />
        )}

        {/* Activity Section - Full Width */}
        {searchResults.activity.loading && (
          <section className="py-8 px-4 border-t border-border">
            <div className="container mx-auto max-w-7xl">
              <LoadingCard title="Activity" type="chart" />
            </div>
          </section>
        )}
        
        {searchResults.activity.error && (
          <section className="py-8 px-4 border-t border-border">
            <div className="container mx-auto max-w-7xl">
              <ErrorCard 
                error={searchResults.activity.error}
                title="Failed to load activity data"
                onRetry={handleRetryActivity}
              />
            </div>
          </section>
        )}
        
        {searchResults.activity.data && (
          <ActivitySection 
            data={searchResults.activity.data}
            onDaysChange={handleActivityDaysChange}
          />
        )}

        {/* AI Analysis Section - Full Width */}
        {(searchResults.aiAnalysis.loading || searchResults.aiAnalysis.data || searchResults.aiAnalysis.error) && (
          <AIAnalysisSection
            data={searchResults.aiAnalysis.data!}
            onRefresh={handleRetryAIAnalysis}
            isLoading={searchResults.aiAnalysis.loading}
            error={searchResults.aiAnalysis.error}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
