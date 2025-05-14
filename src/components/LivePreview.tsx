
import { useEditor } from '@/contexts/EditorContext';
import { useEffect, useRef, useState } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface LivePreviewProps {
  className?: string;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export function LivePreview({ className }: LivePreviewProps) {
  const { files } = useEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const [loading, setLoading] = useState(true);
  const [darkPreview, setDarkPreview] = useState(false);
  const { resolvedTheme } = useTheme();
  const { toast } = useToast();
  
  // Update preview when files change
  useEffect(() => {
    updatePreview();
  }, [files]);
  
  const updatePreview = () => {
    setLoading(true);
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    try {
      // Get HTML file content, or create basic HTML if none exists
      const htmlFile = files.find(file => file.name.endsWith('.html'));
      let htmlContent = htmlFile?.content || '<!DOCTYPE html><html><head></head><body></body></html>';
      
      // Add viewport meta tag for responsive design
      if (!htmlContent.includes('<meta name="viewport"')) {
        htmlContent = htmlContent.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=1.0">');
      }
      
      // Inject CSS files
      const cssFiles = files.filter(file => file.name.endsWith('.css'));
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map(file => `<style>${file.content}</style>`).join('');
        htmlContent = htmlContent.replace('</head>', `${cssContent}</head>`);
      }
      
      // Inject dark mode class if enabled
      if (darkPreview) {
        htmlContent = htmlContent.replace('<html', '<html class="dark"');
      }
      
      // Inject JS files
      const jsFiles = files.filter(file => 
        file.name.endsWith('.js') || 
        file.name.endsWith('.jsx') || 
        file.name.endsWith('.ts') || 
        file.name.endsWith('.tsx')
      );
      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map(file => `<script type="text/javascript">${file.content}</script>`).join('');
        htmlContent = htmlContent.replace('</body>', `${jsContent}</body>`);
      }
      
      // Write to iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
        
        // Add listener for iframe load event
        iframe.onload = () => {
          setLoading(false);
        };
        
        // Fallback in case the onload event doesn't fire
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating preview:', error);
      setLoading(false);
      toast({
        title: 'Preview Error',
        description: 'There was an error rendering the preview',
        variant: 'destructive'
      });
    }
  };
  
  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile': return 'w-[320px] mx-auto border-x border-border';
      case 'tablet': return 'w-[768px] mx-auto border-x border-border';
      case 'desktop': return 'w-full';
      default: return 'w-full';
    }
  };
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-2 flex justify-between items-center border-b">
        <h2 className="text-sm font-medium">Preview</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDarkPreview(!darkPreview)}
            title={darkPreview ? "Light mode preview" : "Dark mode preview"}
          >
            {darkPreview ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={updatePreview}
            title="Refresh preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <ToggleGroup 
            type="single" 
            value={viewportSize} 
            onValueChange={(value: ViewportSize) => value && setViewportSize(value)}
          >
            <ToggleGroupItem value="mobile" aria-label="Mobile view">
              <Smartphone className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="tablet" aria-label="Tablet view">
              <Tablet className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="desktop" aria-label="Desktop view">
              <Monitor className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className={`flex-1 overflow-auto p-4 ${darkPreview ? 'bg-gray-900' : 'bg-white'}`}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 w-full max-w-md">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-1/2 mx-auto" />
            </div>
          </div>
        ) : (
          <div className={getViewportClass()}>
            <iframe 
              ref={iframeRef}
              className="w-full h-full bg-white dark:bg-gray-900"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing import
import { Sun, Moon } from 'lucide-react';
