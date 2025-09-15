import { useState } from 'react';
import { X, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { API_CONFIG, updateApiConfig } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface ConfigPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigPanel({ open, onOpenChange }: ConfigPanelProps) {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.baseUrl);
  const { toast } = useToast();

  const handleSave = () => {
    try {
      new URL(apiUrl); // Validate URL format
      updateApiConfig(apiUrl);
      toast({
        title: 'Configuration saved',
        description: 'API base URL has been updated successfully.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    const defaultUrl = 'https://github-recruiter.onrender.com';
    setApiUrl(defaultUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://github-recruiter.onrender.com"
            />
            <p className="text-xs text-muted-foreground">
              The base URL for the GitHub Repo Interpreter API.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}