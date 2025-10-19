import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchSectionProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  recentSearches: string[];
}

const EXAMPLE_USERS = ['torvalds', 'vercel', 'microsoft', 'facebook', 'google'];

export function SearchSection({ onSearch, isLoading, recentSearches }: SearchSectionProps) {
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const extractUsername = (input: string): string => {
    const githubUrlMatch = input.match(/^https?:\/\/github\.com\/([^\/]+)/);
    if (githubUrlMatch) {
      return githubUrlMatch[1];
    }
    return input.trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const username = extractUsername(input.trim());
      onSearch(username);
    }
  };

  const handleChipClick = (username: string) => {
    setInput(username);
    onSearch(username);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t('search.title')}
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          {t('search.placeholder')}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('search.placeholder')}
              className="pl-10 h-12 text-base"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            size="lg" 
            disabled={!input.trim() || isLoading}
            className="h-12 px-6"
          >
            {isLoading ? t('search.analyzing') : t('search.button')}
          </Button>
        </form>

        <div className="space-y-4">
          {recentSearches.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentSearches.map((username) => (
                  <Badge
                    key={username}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary-hover"
                    onClick={() => handleChipClick(username)}
                  >
                    {username}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_USERS.map((username) => (
                <Badge
                  key={username}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleChipClick(username)}
                >
                  {username}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}