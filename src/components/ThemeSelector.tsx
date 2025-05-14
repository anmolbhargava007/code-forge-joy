
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const editorThemes = [
  { name: 'Light', value: 'vs' },
  { name: 'Dark', value: 'vs-dark' },
  { name: 'High Contrast', value: 'hc-black' },
  { name: 'Monokai', value: 'monokai' },
  { name: 'Dracula', value: 'dracula' },
  { name: 'One Dark', value: 'one-dark' },
  { name: 'Solarized Light', value: 'solarized-light' },
  { name: 'Solarized Dark', value: 'solarized-dark' },
];

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { editorTheme, setEditorTheme } = useEditor();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(newTheme);
      setIsAnimating(false);
    }, 100);
  };
  
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            {theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark') ? (
              <Moon className="h-4 w-4" />
            ) : theme === 'system' ? (
              <Monitor className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>App Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleThemeChange('light')}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === 'light' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleThemeChange('dark')}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === 'dark' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleThemeChange('system')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
            {theme === 'system' && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span>Editor Theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Editor Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {editorThemes.map((theme) => (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => setEditorTheme(theme.value)}
              className="flex items-center gap-2"
            >
              <span>{theme.name}</span>
              {editorTheme === theme.value && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {isAnimating && (
        <div className="fixed inset-0 bg-background transition-opacity duration-300 z-50 animate-fade-in" />
      )}
    </div>
  );
}
