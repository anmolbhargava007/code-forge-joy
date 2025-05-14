
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { FileTabs } from './FileTabs';
import { EditorToolbar } from './EditorToolbar';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export function EditorLayout() {
  return (
    <div className="h-screen flex flex-col">
      <EditorToolbar />
      <FileTabs />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={25}>
            <CodeEditor className="h-full" />
          </ResizablePanel>
          <ResizablePanel defaultSize={50} minSize={25}>
            <LivePreview className="h-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
