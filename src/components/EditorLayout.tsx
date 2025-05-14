
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { FileTabs } from './FileTabs';
import { EditorToolbar } from './EditorToolbar';
import { ChatBox } from './ChatBox';
import { VersionHistory } from './VersionHistory';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export function EditorLayout() {
  const [showChat, setShowChat] = useState(true);
  
  return (
    <div className="h-screen flex flex-col">
      <EditorToolbar />
      <FileTabs />
      <VersionHistory className="border-b" />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60} minSize={25}>
            <CodeEditor className="h-full" />
          </ResizablePanel>
          <ResizablePanel defaultSize={40} minSize={25}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={70} minSize={30}>
                <LivePreview className="h-full" />
              </ResizablePanel>
              {showChat && (
                <ResizablePanel defaultSize={30} minSize={20}>
                  <ChatBox className="h-full" />
                </ResizablePanel>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
