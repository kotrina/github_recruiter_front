import { useState } from 'react';
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
export function LanguageFilters({
  filters,
  onFiltersChange,
  isLoading
}: LanguageFiltersProps) {
  const [localRepoLimit, setLocalRepoLimit] = useState(filters.repoLimit);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };
  const recentMonthsOptions = [{
    value: 3,
    label: '3 months'
  }, {
    value: 6,
    label: '6 months'
  }, {
    value: 12,
    label: '12 months'
  }, {
    value: 24,
    label: '24 months'
  }, {
    value: 0,
    label: 'All time'
  }];
  return <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base flex items-center gap-2">
          Analysis Filters
          <span className="text-xs font-normal text-muted-foreground">
        </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label htmlFor="repo-limit">Repository limit</Label>
            <Input 
              id="repo-limit" 
              type="number" 
              min="1" 
              max="20" 
              value={localRepoLimit} 
              onChange={e => {
                const value = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                setLocalRepoLimit(value);
              }}
              onBlur={() => {
                updateFilter('repoLimit', localRepoLimit);
              }}
              disabled={isLoading} 
              className="h-9" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recent-months">Time period</Label>
            <Select value={filters.recentMonths.toString()} onValueChange={value => updateFilter('recentMonths', parseInt(value))} disabled={isLoading}>
              <SelectTrigger id="recent-months" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {recentMonthsOptions.map(option => <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Switch id="include-forks" checked={filters.includeForks} onCheckedChange={checked => updateFilter('includeForks', checked)} disabled={isLoading} />
            <Label htmlFor="include-forks" className="text-sm">
              Include forks
            </Label>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Switch id="include-archived" checked={filters.includeArchived} onCheckedChange={checked => updateFilter('includeArchived', checked)} disabled={isLoading} />
            <Label htmlFor="include-archived" className="text-sm">
              Include archived
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>;
}