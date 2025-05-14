import { Button } from '@/components/ui/button';
import { useEditor } from '@/contexts/EditorContext';
import { ThemeSelector } from './ThemeSelector';
import {
  Save,
  Download,
  Share,
  History,
  Code,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function EditorToolbar() {
  const { activeFile, createVersion, files, editorTheme, setEditorTheme } = useEditor();
  const { toast } = useToast();
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  const handleSave = () => {
    if (activeFile) {
      createVersion(activeFile.id);
      toast({
        title: 'File Saved',
        description: `${activeFile.name} has been saved`,
      });
    }
  };
  
  const handleDownload = () => {
    if (activeFile) {
      const blob = new Blob([activeFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'File Downloaded',
        description: `${activeFile.name} has been downloaded`,
      });
    }
  };
  
  const handleShare = () => {
    // In a real app, we'd generate a shareable link
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: 'Link Copied',
      description: 'Share link has been copied to clipboard',
    });
  };
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div className="flex items-center p-2 border-b gap-2">
      <div className="flex-1 flex gap-2">
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={!activeFile}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={!activeFile}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
            </DialogHeader>
            {activeFile && (
              <div className="max-h-[400px] overflow-y-auto">
                {activeFile.versions.map((version) => (
                  <div key={version.id} className="p-2 border-b flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{version.tag || 'Unnamed version'}</div>
                      <div className="text-xs text-muted-foreground">{formatTimestamp(version.timestamp)}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      // Restore version logic would go here in a full app
                      toast({
                        title: "Version Restored",
                        description: `Restored to version from ${formatTimestamp(version.timestamp)}`
                      });
                      setHistoryDialogOpen(false);
                    }}>
                      Restore
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeSelector />
      </div>
    </div>
  );
}
