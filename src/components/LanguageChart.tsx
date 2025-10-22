import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LanguagesResponse } from '@/utils/api';

interface LanguageChartProps {
  data: LanguagesResponse;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#239120',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  R: '#198CE7',
  Lua: '#000080',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Clojure: '#db5855',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  Assembly: '#6E4C13',
  Makefile: '#427819',
  Roff: '#ecdebe',
};

const getLanguageColor = (language: string, index: number): string => {
  if (LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }
  
  // Generate a consistent color for unknown languages
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98',
  ];
  return colors[index % colors.length];
};

export function LanguageChart({ data }: LanguageChartProps) {
  const { languages, total_bytes, analyzed_repos, params } = data;

  if (total_bytes === 0 || !languages || languages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Language Mix (%)</span>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Programming language distribution based on code bytes in repositories. Helps assess technical skills and experience areas.</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No detectable languages in the selected repositories/filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert to chart data with percentages
  const chartData = languages
    .map((language) => ({
      name: language.name,
      value: language.bytes,
      percentage: language.percent.toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.percentage}% ({formatBytes(data.value)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Language Mix (%)</span>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Programming language distribution based on code bytes in repositories. Helps assess technical skills and experience areas.</p>
              </TooltipContent>
            </UITooltip>
          </CardTitle>
        </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="h-64 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getLanguageColor(entry.name, index)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 w-full md:w-1/2">
            <h4 className="font-semibold text-sm">Top Languages:</h4>
            <div className="grid gap-2">
              {chartData.slice(0, 8).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getLanguageColor(item.name, index) }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.percentage}% • {formatBytes(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
          <p>
            Analyzed repositories: {analyzed_repos?.length || 0}
            {analyzed_repos && analyzed_repos.length > 0 && (
              <span className="block mt-1">
                Latest: {analyzed_repos.slice(0, 3).map(repo => repo.split('/')[1]).join(', ')}
                {analyzed_repos.length > 3 && ` +${analyzed_repos.length - 3} more`}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}