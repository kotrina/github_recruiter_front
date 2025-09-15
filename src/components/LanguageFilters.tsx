import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface FilterOptions {
  recentMonths: number;
  includeForks: boolean;
  includeArchived: boolean;
  repoLimit: number;
}

interface LanguageFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isLoading: boolean;
}

export function LanguageFilters({ filters, onFiltersChange, isLoading }: LanguageFiltersProps) {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const recentMonthsOptions = [
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '12 months' },
    { value: 24, label: '24 months' },
    { value: 0, label: 'All time' },
  ];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recent-months">Recent months</Label>
            <Select
              value={filters.recentMonths.toString()}
              onValueChange={(value) => updateFilter('recentMonths', parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="recent-months">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recentMonthsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo-limit">Repository limit</Label>
            <Input
              id="repo-limit"
              type="number"
              min="1"
              max="100"
              value={filters.repoLimit}
              onChange={(e) => {
                const value = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                updateFilter('repoLimit', value);
              }}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="include-forks"
              checked={filters.includeForks}
              onCheckedChange={(checked) => updateFilter('includeForks', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="include-forks" className="text-sm">
              Include forks
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="include-archived"
              checked={filters.includeArchived}
              onCheckedChange={(checked) => updateFilter('includeArchived', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="include-archived" className="text-sm">
              Include archived
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}