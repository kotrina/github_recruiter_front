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
import { API_CONFIG } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConfigPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfigPanel({ open, onOpenChange }: ConfigPanelProps) {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.baseUrl);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSave = () => {
    toast({
      title: t('config.saved'),
      description: t('config.savedDesc'),
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultUrl = 'https://github-recruiter-ten.vercel.app';
    setApiUrl(defaultUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('config.title')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">{t('config.label')}</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder={t('config.placeholder')}
            />
            <p className="text-xs text-muted-foreground">
              {t('config.description')}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleReset}>
            {t('config.reset')}
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('config.cancel')}
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            {t('config.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}