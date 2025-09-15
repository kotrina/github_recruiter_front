import { Star, GitFork, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Repository } from '@/utils/api';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryListProps {
  repositories: Repository[];
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Repositories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repositories.map((repo) => (
          <div
            key={repo.name}
            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-github-blue hover:underline font-semibold flex items-center gap-1"
              >
                {repo.name}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            {repo.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {repo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-github-orange text-github-orange" />
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  <span>{repo.forks_count.toLocaleString()}</span>
                </div>
                {repo.language && (
                  <Badge variant="secondary" className="text-xs">
                    {repo.language}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(repo.pushed_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
        
        {repositories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No repositories found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}