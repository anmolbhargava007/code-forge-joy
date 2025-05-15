
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { FileTabs } from './FileTabs';
import { EditorToolbar } from './EditorToolbar';
import { ChatBox } from './ChatBox';
import { VersionHistory } from './VersionHistory';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/button';
import { Code, Eye, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
  
  return (
    <div className="h-screen flex flex-col">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b bg-background">
        {/* Left side: Project Name + Navigation */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-purple-500 to-pink-500 mr-2"></div>
            <span className="font-medium">code-forge-joy</span>
          </div>
        </div>
        
        {/* Center: Breadcrumb/Path */}
        <div className="flex-1 flex justify-center">
          <div className="bg-muted/30 rounded-md px-4 py-1 flex items-center">
            <span className="text-sm">Home</span>
          </div>
        </div>
        
        {/* Right side: Tools */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>{viewMode === 'code' ? 'UI' : 'Code'}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <span>Connect to GitHub</span>
          </Button>
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Publish
          </Button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Chat */}
        <div className="w-80 border-r bg-background flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Chat</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ChatBox className="h-full" />
          </div>
        </div>
        
        {/* Right panel - Editor/Preview */}
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
          
          {/* Editor/Preview Container */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'code' ? (
              <CodeEditor className="h-full" />
            ) : (
              <LivePreview className="h-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
