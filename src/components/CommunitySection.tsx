import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Star, GitFork, Eye, ExternalLink, Info, Check, X } from 'lucide-react';
import { CommunityResponse, CommunityRepository } from '@/utils/api';
import { formatDistanceToNow } from 'date-fns';

interface CommunitySectionProps {
  data: CommunityResponse;
}

type SortOption = 'score' | 'stars' | 'updated';

export function CommunitySection({ data }: CommunitySectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('score');

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getTrafficLightColor = (trafficLight: string) => {
    switch (trafficLight) {
      case 'green':
        return 'bg-success';
      case 'yellow':
        return 'bg-warning';
      case 'red':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const sortRepositories = (repositories: CommunityRepository[]): CommunityRepository[] => {
    const sorted = [...repositories];
    switch (sortBy) {
      case 'score':
        return sorted.sort((a, b) => (b.community_score || 0) - (a.community_score || 0));
      case 'stars':
        return sorted.sort((a, b) => (b.stars || 0) - (a.stars || 0));
      case 'updated':
        return sorted.sort((a, b) => 
          new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime()
        );
      default:
        return sorted;
    }
  };

  const sortedRepositories = sortRepositories(data.repos || []);

  const InfoTooltip = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help inline" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3">
          <div className="space-y-2">
            <p className="font-medium">{title}</p>
            <div className="text-sm">{children}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <section className="py-8 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-semibold">Community (OSS Health)</h2>
          <InfoTooltip title="What am I seeing?">
            <p>Repository health for recruiters.</p>
            <p><strong>Popularity (70%)</strong> rewards traction: stars, forks, and watchers (sqrt-scaled so ~50 stars already maxes the stars portion).</p>
            <p><strong>Governance (30%)</strong> checks documentation and collaboration signals (README, license or COPYING, contributing guide, maintainers, issue/PR templates, security policy, docs folder).</p>
            <p><strong>Traffic light:</strong> Green (≥60), Yellow (35–59), Red (&lt;35).</p>
          </InfoTooltip>
        </div>

        {/* Sorting Control */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {sortedRepositories.length} repositories
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score (desc)</SelectItem>
                <SelectItem value="stars">Stars (desc)</SelectItem>
                <SelectItem value="updated">Last updated (desc)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Repository Grid */}
        {sortedRepositories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No repositories for the selected filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedRepositories.map((repo) => (
              <Card key={repo.full_name} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        <a
                          href={`https://github.com/${repo.full_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-github-blue hover:underline"
                        >
                          {repo.full_name.split('/')[1]}
                        </a>
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`w-3 h-3 rounded-full ${getTrafficLightColor(repo.traffic_light)}`} />
                      <Badge variant="secondary" className="text-xs">
                        {repo.community_score || 0}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{formatNumber(repo.stars || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      <span>{formatNumber(repo.forks || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(repo.watchers || 0)}</span>
                    </div>
                  </div>

                  {/* Popularity Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">Popularity ({Math.round(repo.breakdown?.popularity_0_70 || 0)}/70)</span>
                      <InfoTooltip title="How it's computed">
                        <p><strong>Stars (0–40)</strong>, <strong>Forks (0–20)</strong>, <strong>Watchers (0–10)</strong>.</p>
                        <p>Each uses square-root scaling toward a small target (≈50/20/10) to emphasize impactful but realistic community numbers for individual developers.</p>
                      </InfoTooltip>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={((repo.breakdown?.popularity_0_70 || 0) / 70) * 100} 
                        className="h-2" 
                      />
                      {repo.popularity_meta && (
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>★ {Math.round(repo.popularity_meta.parts?.stars_part || 0)}</span>
                          <span>⑂ {Math.round(repo.popularity_meta.parts?.forks_part || 0)}</span>
                          <span>👁 {Math.round(repo.popularity_meta.parts?.watch_part || 0)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Governance Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">Governance ({Math.round(repo.breakdown?.governance_scaled_0_30 || 0)}/30)</span>
                      <InfoTooltip title="Why it matters">
                        <p>Repositories with clear documentation, basic governance and templates are easier to evaluate and collaborate on.</p>
                      </InfoTooltip>
                    </div>
                    <Progress 
                      value={((repo.breakdown?.governance_scaled_0_30 || 0) / 30) * 100} 
                      className="h-2" 
                    />
                  </div>

                  {/* Governance Checklist */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Governance Checklist</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {repo.checks && Object.entries(repo.checks).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1">
                          {value ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={value ? '' : 'text-muted-foreground'}>
                            {key.replace(/_/g, ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                    <span>
                      Last push:{' '}
                      {repo.pushed_at ? formatDistanceToNow(new Date(repo.pushed_at), { addSuffix: true }) : 'N/A'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1"
                      asChild
                    >
                      <a
                        href={`https://github.com/${repo.full_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}