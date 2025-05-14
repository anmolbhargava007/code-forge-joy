
import { useEditor } from '@/contexts/EditorContext';
import { useTheme } from '@/contexts/ThemeContext';
import Editor, { Monaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  className?: string;
}

export function CodeEditor({ className }: CodeEditorProps) {
  const { activeFile, updateFile, editorTheme } = useEditor();
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Set editor options
    editor.updateOptions({
      fontFamily: 'Fira Code',
      fontLigatures: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      padding: { top: 16, bottom: 16 },
    });
    
    // Add custom editor themes if needed
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1A202C',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#2D3748',
        'editor.selectionBackground': '#4299E1',
        'editor.selectionHighlightBackground': '#4299E150'
      }
    });
  };
  
  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFile(activeFile.id, value);
    }
  };
  
  useEffect(() => {
    // Auto-save version after 3 seconds of inactivity
    if (!activeFile) return;
    
    const timeoutId = setTimeout(() => {
      // We would normally createVersion here, but to avoid too many versions
      // in this demo, we'll just log it
      console.log('Auto-saved');
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [activeFile?.content]);
  
  if (!activeFile) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-muted-foreground">No file selected</p>
      </div>
    );
  }
  
  return (
    <div className={`editor-wrapper h-full ${className}`}>
      <Editor
        height="100%"
        width="100%"
        language={activeFile.language}
        value={activeFile.content}
        theme={editorTheme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontFamily: 'Fira Code',
          fontLigatures: true,
        }}
      />
    </div>
  );
}
