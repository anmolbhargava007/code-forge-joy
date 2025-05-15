
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { FileTabs } from './FileTabs';
import { EditorToolbar } from './EditorToolbar';
import { ChatBox } from './ChatBox';
import { VersionHistory } from './VersionHistory';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Code, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EditorLayout() {
  const [showChat, setShowChat] = useState(true);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
  
  return (
    <div className="h-screen flex">
      {/* Left sidebar */}
      <Sidebar className="w-60 h-full border-r flex-shrink-0" />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar />
        <FileTabs />
        <VersionHistory className="border-b" />
        
        {/* View mode toggle */}
        <div className="border-b p-1 flex justify-between items-center">
          <div className="flex items-center gap-2 px-2">
            <Button 
              variant={viewMode === 'code' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('code')}
              className="flex items-center gap-1"
            >
              <Code size={16} />
              <span>Code</span>
            </Button>
            <Button 
              variant={viewMode === 'preview' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('preview')}
              className="flex items-center gap-1"
            >
              <Eye size={16} />
              <span>Preview</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {viewMode === 'code' ? (
            <CodeEditor className="h-full" />
          ) : (
            <LivePreview className="h-full" />
          )}
        </div>
      </div>
      
      {/* Chat panel fixed at bottom */}
      {showChat && (
        <ChatBox className="fixed bottom-0 left-60 right-0 z-50" />
      )}
    </div>
  );
}
