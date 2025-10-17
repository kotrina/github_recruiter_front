import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityResponse, getActivityDays, setActivityDays } from '@/utils/api';
import { format } from 'date-fns';

interface CategoryData {
  name: string;
  color: string;
  description: string;
}

interface ActivitySectionProps {
  data: ActivityResponse;
  onDaysChange: (days: number) => void;
}

export function ActivitySection({ data, onDaysChange }: ActivitySectionProps) {
  const [selectedDays, setSelectedDays] = useState(getActivityDays());

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
    setActivityDays(days);
    onDaysChange(days);
  };

  const formatLastActive = (daysAgo: number | null): string => {
    if (daysAgo === null) return 'No recent public activity';
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    return `${daysAgo} days ago`;
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const categories: CategoryData[] = [
    { name: 'Build', color: '#2188ff', description: 'Writes code & pushes commits (hands-on contribution).' },
    { name: 'Review', color: '#2ea44f', description: 'Reviews pull requests or code (quality & collaboration).' },
    { name: 'Feedback', color: '#9f7aea', description: 'Comments on PRs/issues (discussion, mentoring).' },
    { name: 'Explore', color: '#9ca3af', description: 'Stars/forks other repos (curiosity, learning).' },
    { name: 'Release', color: '#f59e0b', description: 'Publishes versions/tags (delivery cadence).' },
    { name: 'Admin', color: '#ef4444', description: 'Maintains/merges/manages repos (project stewardship).' },
  ];

  const getCategoryData = (categoryName: string): { count: number; pct_total: number } => {
    const key = categoryName.toLowerCase() as keyof Omit<typeof data.all_categories, 'total_events'>;
    const categoryData = data.all_categories[key];
    if (typeof categoryData === 'object' && 'count' in categoryData) {
      return categoryData;
    }
    return { count: 0, pct_total: 0 };
  };

  const totalEvents = data.all_categories.total_events;

  return (
    <section className="py-8 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Last {data.window_days} days</CardDescription>
              </div>

              {/* Days Selector */}
              <div className="flex gap-1 border rounded-md p-1">
                {[30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleDaysChange(days)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      selectedDays === days
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Last active</CardDescription>
                  <div className="text-2xl font-bold">
                    {formatLastActive(data.kpis.last_active_days_ago)}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active weeks (12w)</CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.active_weeks_12w}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>External ratio</CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.external_ratio_pct.toFixed(0)}% external
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Vertical Bar Chart */}
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground text-center">
                All activity — {formatCount(totalEvents)} events
              </div>
              
              {totalEvents === 0 ? (
                <div className="text-sm text-muted-foreground py-16 text-center border rounded-xl">
                  No public activity in the selected window.
                </div>
              ) : (
                <div className="flex items-end justify-around gap-2 sm:gap-4 h-64 px-2">
                  <TooltipProvider>
                    {categories.map((category) => {
                      const categoryData = getCategoryData(category.name);
                      const height = categoryData.pct_total > 0 ? categoryData.pct_total : 0;
                      const barHeight = height > 0 ? `${height}%` : '2px';
                      
                      return (
                        <Tooltip key={category.name}>
                          <TooltipTrigger asChild>
                            <button
                              className="flex flex-col items-center gap-2 flex-1 group"
                              aria-label={`${category.name}: ${categoryData.count} events, ${categoryData.pct_total.toFixed(1)}% of total`}
                            >
                              <div className="text-xs font-semibold min-h-[2.5rem] flex items-end">
                                {categoryData.count > 0 && (
                                  <span>
                                    {formatCount(categoryData.count)}
                                    <span className="text-muted-foreground ml-1">
                                      ({categoryData.pct_total.toFixed(1)}%)
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div
                                className="w-full rounded-md transition-all duration-300 hover:opacity-80"
                                style={{
                                  backgroundColor: category.color,
                                  height: barHeight,
                                  minHeight: height === 0 ? '2px' : '8px',
                                  animation: 'grow 0.6s ease-out',
                                }}
                              />
                              <div className="text-xs font-medium text-center">
                                {category.name}
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              {category.name}: {categoryData.count} events ({categoryData.pct_total.toFixed(1)}%)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              )}

              {/* Explanatory Block - Always Visible */}
              <div className="rounded-xl p-4 bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">What each bar means</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {categories.map((category) => (
                    <div key={category.name} className="flex items-start gap-2">
                      <div
                        className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <span className="font-medium">{category.name}</span>
                        <span className="text-muted-foreground"> — {category.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Collaborations */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Top collaborations (external)</h3>
              
              {data.top_collabs.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                  No external collaborations found.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.top_collabs.slice(0, 3).map((collab, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <a
                          href={collab.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          {collab.repo}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <div className="flex gap-2">
                          {collab.prs > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              PRs {collab.prs}
                            </Badge>
                          )}
                          {collab.reviews > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Reviews {collab.reviews}
                            </Badge>
                          )}
                          {collab.issues > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Issues {collab.issues}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last: {formatDate(collab.last)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}