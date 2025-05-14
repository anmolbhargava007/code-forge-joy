
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { FileTabs } from './FileTabs';
import { EditorToolbar } from './EditorToolbar';
import { ChatBox } from './ChatBox';
import { VersionHistory } from './VersionHistory';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Sidebar } from './Sidebar';

export function EditorLayout() {
  const [showChat, setShowChat] = useState(true);
  
  return (
    <div className="h-screen flex">
      {/* Left sidebar */}
      <Sidebar className="w-60 h-full border-r flex-shrink-0" />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <EditorToolbar />
        <FileTabs />
        <VersionHistory className="border-b" />
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={60} minSize={25}>
              <CodeEditor className="h-full" />
            </ResizablePanel>
            <ResizablePanel defaultSize={40} minSize={25}>
              <LivePreview className="h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      
      {/* Chat panel fixed at bottom */}
      {showChat && (
        <ChatBox className="fixed bottom-0 left-0 right-0 z-50" />
      )}
    </div>
  );
}
