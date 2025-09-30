import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityResponse, getActivityDays, setActivityDays } from '@/utils/api';
import { format } from 'date-fns';

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

  const totalEvents = data.roles.build.count + data.roles.review.count + data.roles.feedback.count;

  return (
    <section className="py-8 px-4 border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Activity</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-sm">
                        Recent public GitHub activity. We group events into three roles:
                        <br />
                        <strong>Build</strong> (pushes & pull requests),{' '}
                        <strong>Review</strong> (PR reviews & comments on PRs),{' '}
                        <strong>Feedback</strong> (issues & comments on issues).
                        <br />
                        External ratio shows how much of the activity happens outside the candidate's own repositories.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
            <CardDescription>Last {data.window_days} days</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1">
                    Last active
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Time since the most recent public event</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardDescription>
                  <div className="text-2xl font-bold">
                    {formatLastActive(data.kpis.last_active_days_ago)}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1">
                    Active weeks (12w)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Number of weeks (last 12) with ≥1 event</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.active_weeks_12w}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1">
                    External ratio
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Share of events on repositories not owned by the candidate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardDescription>
                  <div className="text-2xl font-bold">
                    {data.kpis.external_ratio_pct.toFixed(0)}% external
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Activity by Role */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Activity by Role</h3>
              
              {totalEvents === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center border rounded-md">
                  No public activity in the selected window.
                </div>
              ) : (
                <>
                  <div className="relative h-8 rounded-md overflow-hidden border">
                    <TooltipProvider>
                      {data.roles.build.count > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-0 left-0 h-full bg-blue-500 hover:opacity-90 transition-opacity cursor-help"
                              style={{ width: `${data.roles.build.pct}%` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Build: {data.roles.build.count} ({data.roles.build.pct.toFixed(1)}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {data.roles.review.count > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-0 h-full bg-green-500 hover:opacity-90 transition-opacity cursor-help"
                              style={{ 
                                left: `${data.roles.build.pct}%`,
                                width: `${data.roles.review.pct}%` 
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Review: {data.roles.review.count} ({data.roles.review.pct.toFixed(1)}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {data.roles.feedback.count > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-0 h-full bg-purple-500 hover:opacity-90 transition-opacity cursor-help"
                              style={{ 
                                left: `${data.roles.build.pct + data.roles.review.pct}%`,
                                width: `${data.roles.feedback.pct}%` 
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Feedback: {data.roles.feedback.count} ({data.roles.feedback.pct.toFixed(1)}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TooltipProvider>
                  </div>

                  {/* Legend */}
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-blue-500" />
                      <span>Build: {data.roles.build.count} ({data.roles.build.pct.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-green-500" />
                      <span>Review: {data.roles.review.count} ({data.roles.review.pct.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded bg-purple-500" />
                      <span>Feedback: {data.roles.feedback.count} ({data.roles.feedback.pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                </>
              )}
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