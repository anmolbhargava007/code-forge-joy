
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
    
    // Define custom editor themes
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
    
    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '75715E' },
        { token: 'string', foreground: 'E6DB74' },
        { token: 'keyword', foreground: 'F92672' },
        { token: 'number', foreground: 'AE81FF' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#F8F8F2',
        'editorLineNumber.foreground': '#8F908A',
        'editor.selectionBackground': '#49483E',
        'editor.lineHighlightBackground': '#3E3D32',
      }
    });
    
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272A4' },
        { token: 'string', foreground: 'F1FA8C' },
        { token: 'keyword', foreground: 'FF79C6' },
        { token: 'number', foreground: 'BD93F9' },
      ],
      colors: {
        'editor.background': '#282A36',
        'editor.foreground': '#F8F8F2',
        'editorLineNumber.foreground': '#6D8A88',
        'editor.selectionBackground': '#44475A',
        'editor.lineHighlightBackground': '#44475A',
      }
    });
    
    monaco.editor.defineTheme('one-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5C6370' },
        { token: 'string', foreground: '98C379' },
        { token: 'keyword', foreground: 'C678DD' },
        { token: 'number', foreground: 'D19A66' },
      ],
      colors: {
        'editor.background': '#282C34',
        'editor.foreground': '#ABB2BF',
        'editorLineNumber.foreground': '#4B5363',
        'editor.selectionBackground': '#3E4452',
        'editor.lineHighlightBackground': '#2C323C',
      }
    });
    
    monaco.editor.defineTheme('solarized-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '93A1A1' },
        { token: 'string', foreground: '2AA198' },
        { token: 'keyword', foreground: 'CB4B16' },
      ],
      colors: {
        'editor.background': '#FDF6E3',
        'editor.foreground': '#657B83',
        'editorLineNumber.foreground': '#93A1A1',
        'editor.selectionBackground': '#EEE8D5',
        'editor.lineHighlightBackground': '#EEE8D5',
      }
    });
    
    monaco.editor.defineTheme('solarized-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '586E75' },
        { token: 'string', foreground: '2AA198' },
        { token: 'keyword', foreground: 'CB4B16' },
      ],
      colors: {
        'editor.background': '#002B36',
        'editor.foreground': '#839496',
        'editorLineNumber.foreground': '#586E75',
        'editor.selectionBackground': '#073642',
        'editor.lineHighlightBackground': '#073642',
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
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}
