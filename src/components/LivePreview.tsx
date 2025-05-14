
import { useEditor } from '@/contexts/EditorContext';
import { useEffect, useRef, useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';

interface LivePreviewProps {
  className?: string;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export function LivePreview({ className }: LivePreviewProps) {
  const { files } = useEditor();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const { toast } = useToast();
  
  // Update preview when files change
  useEffect(() => {
    updatePreview();
  }, [files]);
  
  const updatePreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    try {
      // Get HTML file content, or create basic HTML if none exists
      const htmlFile = files.find(file => file.name.endsWith('.html'));
      let htmlContent = htmlFile?.content || '<!DOCTYPE html><html><head></head><body></body></html>';
      
      // Inject CSS files
      const cssFiles = files.filter(file => file.name.endsWith('.css'));
      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map(file => `<style>${file.content}</style>`).join('');
        htmlContent = htmlContent.replace('</head>', `${cssContent}</head>`);
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
      }
    } catch (error) {
      console.error('Error updating preview:', error);
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
        <ToggleGroup type="single" value={viewportSize} onValueChange={(value: ViewportSize) => value && setViewportSize(value)}>
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
      <div className="flex-1 overflow-auto bg-white dark:bg-black p-4">
        <div className={getViewportClass()}>
          <iframe 
            ref={iframeRef}
            className="w-full h-full bg-white"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
