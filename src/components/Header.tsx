import { Share, FileDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  currentUsername?: string;
  onExportPDF?: () => void;
}

export function Header({ currentUsername, onExportPDF }: HeaderProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleShare = async () => {
    if (!currentUsername) {
      toast({
        title: t('header.noProfile'),
        description: t('header.searchFirst'),
        variant: "destructive",
      });
      return;
    }

    const shareUrl = `${window.location.origin}?u=${encodeURIComponent(currentUsername)}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('header.linkCopied'),
        description: t('header.linkDescription'),
      });
    } catch (err) {
      toast({
        title: t('header.copyFailed'),
        description: t('header.copyFailedDescription'),
        variant:  "destructive",
      });
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src="/lovable-uploads/a4e96b70-f092-4308-9382-794770be8b04.png" alt="Hermes Logo" className="h-10 w-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">{t('header.title')}</span>
            <span className="text-xs text-muted-foreground leading-tight">{t('header.subtitle')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-9 px-3"
          >
            <Share className="h-[1.2rem] w-[1.2rem] mr-2" />
            {t('header.share')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportPDF}
            disabled={!currentUsername}
            className="h-9 px-3"
          >
            <FileDown className="h-[1.2rem] w-[1.2rem] mr-2" />
            {t('header.export')}
          </Button>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}