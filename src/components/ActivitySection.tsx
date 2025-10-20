import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ActivityResponse, getActivityDays, setActivityDays } from '@/utils/api';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryData {
  key: string; // English key for API
  name: string; // Translated name for display
  color: string;
  description: string;
}

interface ActivitySectionProps {
  data: ActivityResponse;
  onDaysChange: (days: number) => void;
}

export function ActivitySection({ data, onDaysChange }: ActivitySectionProps) {
  const [selectedDays, setSelectedDays] = useState(getActivityDays());
  const { t } = useLanguage();

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
    setActivityDays(days);
    onDaysChange(days);
  };

  const formatLastActive = (daysAgo: number | null): string => {
    if (daysAgo === null) return t('activity.noActivity');
    if (daysAgo === 0) return t('activity.today');
    if (daysAgo === 1) return t('activity.yesterday');
    return `${daysAgo} ${t('activity.daysAgo')}`;
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
    { key: 'build', name: t('activity.build'), color: '#2188ff', description: t('activity.buildDesc') },
    { key: 'review', name: t('activity.review'), color: '#2ea44f', description: t('activity.reviewDesc') },
    { key: 'feedback', name: t('activity.feedback'), color: '#9f7aea', description: t('activity.feedbackDesc') },
    { key: 'explore', name: t('activity.explore'), color: '#9ca3af', description: t('activity.exploreDesc') },
    { key: 'release', name: t('activity.release'), color: '#f59e0b', description: t('activity.releaseDesc') },
    { key: 'admin', name: t('activity.admin'), color: '#ef4444', description: t('activity.adminDesc') },
  ];

  const getCategoryData = (categoryKey: string): { count: number; pct_total: number } => {
    const key = categoryKey as keyof Omit<typeof data.all_categories, 'total_events'>;
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
                <CardTitle>{t('activity.title')}</CardTitle>
                <CardDescription>{t('activity.subtitle')} {data.window_days} {t('activity.days')}</CardDescription>
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
                  <CardDescription>{t('activity.lastActive')}</CardDescription>
                  <div className="text-2xl font-bold">
                    {formatLastActive(data.kpis.last_active_days_ago)}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>{t('activity.activeWeeks')}</CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.active_weeks_12w}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>{t('activity.externalRatio')}</CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.external_ratio_pct.toFixed(0)}% {t('activity.externalRatio')}
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Vertical Bar Chart */}
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground text-center">
                {t('activity.allActivity')} — {formatCount(totalEvents)} {t('activity.events')}
              </div>
              
              {totalEvents === 0 ? (
                <div className="text-sm text-muted-foreground py-16 text-center border rounded-xl">
                  {t('activity.noActivity')}
                </div>
              ) : (
                <div className="flex items-end justify-around gap-2 sm:gap-4 px-2" style={{ height: '16rem' }}>
                  {categories.map((category) => {
                    const categoryData = getCategoryData(category.key);
                    const heightPct = categoryData.pct_total > 0 ? categoryData.pct_total : 0;
                    
                    return (
                      <Popover key={category.name}>
                        <PopoverTrigger asChild>
                          <button
                            className="flex flex-col items-center gap-2 flex-1 group h-full"
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
                            <div className="flex-1 w-full flex items-end">
                              <div
                                className="w-full rounded-md transition-all duration-300 hover:opacity-80"
                                style={{
                                  backgroundColor: category.color,
                                  height: heightPct > 0 ? `${heightPct}%` : '2px',
                                  animation: 'grow 0.6s ease-out',
                                }}
                              />
                            </div>
                            <div className="text-xs font-medium text-center">
                              {category.name}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-3">
                          <p className="text-sm">
                            <span className="font-medium">{category.name}</span>: {categoryData.count} {t('activity.events')} ({categoryData.pct_total.toFixed(1)}%)
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {category.description}
                          </p>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              )}

              {/* Explanatory Block - Always Visible */}
              <div className="rounded-xl p-4 bg-muted/30">
                <h4 className="text-sm font-semibold mb-3">{t('activity.whatMeans')}</h4>
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
              <h3 className="text-sm font-medium">{t('activity.topCollabs')}</h3>
              
              {data.top_collabs.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                  {t('activity.noActivity')}
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
                              {t('activity.prs')} {collab.prs}
                            </Badge>
                          )}
                          {collab.reviews > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {t('activity.reviews')} {collab.reviews}
                            </Badge>
                          )}
                          {collab.issues > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {t('activity.issues')} {collab.issues}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('activity.last')}: {formatDate(collab.last)}
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