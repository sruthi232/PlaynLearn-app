import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from './button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';

interface LanguageSwitcherButtonProps {
  className?: string;
}

export function LanguageSwitcherButton({ className }: LanguageSwitcherButtonProps) {
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-10 w-10 sm:mt-0.5', className)}
        onClick={() => setIsLanguageSelectorOpen(true)}
        title="Change Language"
      >
        <Globe className="h-5 w-5" />
        <span className="sr-only">Change language</span>
      </Button>

      <LanguageSelector
        isOpen={isLanguageSelectorOpen}
        onClose={() => setIsLanguageSelectorOpen(false)}
      />
    </>
  );
}
