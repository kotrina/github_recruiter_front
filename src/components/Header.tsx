import { Settings, Share } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  onConfigOpen: () => void;
  currentUsername?: string;
}

export function Header({ onConfigOpen, currentUsername }: HeaderProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (!currentUsername) {
      toast({
        title: "No profile to share",
        description: "Search for a GitHub profile first.",
        variant: "destructive",
      });
      return;
    }

    const shareUrl = `${window.location.origin}?u=${encodeURIComponent(currentUsername)}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard.",
        variant:  "destructive",
      });
    }
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <img src="/lovable-uploads/a4e96b70-f092-4308-9382-794770be8b04.png" alt="Hermes Logo" className="h-8 w-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">Hermes</span>
            <span className="text-xs text-muted-foreground leading-tight">Github Interpreter</span>
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
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onConfigOpen}
            className="h-9 w-9 p-0"
          >
            <Settings className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Open configuration</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}