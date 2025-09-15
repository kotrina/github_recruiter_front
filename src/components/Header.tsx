import { Github, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onConfigOpen: () => void;
}

export function Header({ onConfigOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Github className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">GitHub Repo Interpreter</span>
        </div>
        
        <div className="flex items-center gap-2">
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