
import { useState } from 'react';
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  History, 
  RotateCcw, 
  Tag, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export function VersionHistory({ className }: { className?: string }) {
  const { activeFile, createVersion, restoreVersion, tagVersion } = useEditor();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [tag, setTag] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  
  if (!activeFile) return null;
  
  const handleCreateVersion = () => {
    if (activeFile) {
      createVersion(activeFile.id);
      toast({
        title: "Version created",
        description: "A new version has been saved"
      });
    }
  };
  
  const handleRestore = (versionId: string) => {
    if (activeFile) {
      restoreVersion(activeFile.id, versionId);
      setDialogOpen(false);
      toast({
        title: "Version restored",
        description: "The selected version has been restored"
      });
    }
  };
  
  const handleTag = () => {
    if (activeFile && selectedVersion && tag) {
      tagVersion(activeFile.id, selectedVersion, tag);
      setTagDialogOpen(false);
      setTag('');
      toast({
        title: "Version tagged",
        description: `Version has been tagged as "${tag}"`
      });
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const renderDiff = (currentContent: string, versionContent: string) => {
    // This is a simplified diff view for demonstration
    // In a real app, you would use a library like diff or jsdiff
    
    const lines1 = currentContent.split('\n');
    const lines2 = versionContent.split('\n');
    const diffLines: JSX.Element[] = [];
    
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diffLines.push(
          <div key={`same-${i}`} className="text-sm font-mono whitespace-pre">
            {line1}
          </div>
        );
      } else {
        diffLines.push(
          <div key={`diff-${i}`} className="flex">
            <div className="w-1/2 text-sm font-mono whitespace-pre bg-red-100 dark:bg-red-900/20 px-2">
              {line1}
            </div>
            <div className="w-1/2 text-sm font-mono whitespace-pre bg-green-100 dark:bg-green-900/20 px-2">
              {line2}
            </div>
          </div>
        );
      }
    }
    
    return diffLines;
  };
  
  return (
    <div className={className}>
      <div className="flex items-center justify-between p-1 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-xs gap-1"
        >
          <History className="h-3 w-3" />
          History
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCreateVersion}>
          Save Version
        </Button>
      </div>
      
      {expanded && (
        <div className="p-2 max-h-[200px] overflow-y-auto">
          {activeFile.versions.length === 0 ? (
            <div className="text-center p-4 text-sm text-muted-foreground">
              No versions saved yet
            </div>
          ) : (
            <div className="space-y-2">
              {activeFile.versions.map((version) => (
                <div 
                  key={version.id} 
                  className="flex items-center justify-between p-2 text-xs border rounded-md"
                >
                  <div>
                    <div className="font-medium">{version.tag || 'Unnamed version'}</div>
                    <div className="text-muted-foreground">{formatTimestamp(version.timestamp)}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => {
                        setSelectedVersion(version.id);
                        setDialogOpen(true);
                      }}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => {
                        setSelectedVersion(version.id);
                        setTagDialogOpen(true);
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      Tag
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version Diff</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto border rounded-md p-2">
            {selectedVersion ? (
              renderDiff(
                activeFile.content,
                activeFile.versions.find(v => v.id === selectedVersion)?.content || ''
              )
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => selectedVersion && handleRestore(selectedVersion)}>
              Restore This Version
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="tag">Version Tag</Label>
              <Input
                id="tag"
                placeholder="e.g., v1.0, Working Draft"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTag}>Save Tag</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
