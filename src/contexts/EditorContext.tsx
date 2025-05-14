
import React, { createContext, useState, useContext, useEffect } from 'react';

export interface FileVersion {
  id: string;
  timestamp: number;
  content: string;
  tag?: string;
}

export interface EditorFile {
  id: string;
  name: string;
  language: string;
  content: string;
  versions: FileVersion[];
}

interface EditorContextType {
  files: EditorFile[];
  activeFileId: string | null;
  addFile: (file: Omit<EditorFile, 'id' | 'versions'>) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setActiveFileId: (id: string | null) => void;
  createVersion: (fileId: string, tag?: string) => void;
  restoreVersion: (fileId: string, versionId: string) => void;
  tagVersion: (fileId: string, versionId: string, tag: string) => void;
  activeFile: EditorFile | null;
  editorTheme: string;
  setEditorTheme: (theme: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <style>
    /* Your CSS here */
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #3b82f6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
    }
    button {
      background-color: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to the Code Editor</h1>
    <p>This is a live preview of your HTML, CSS, and JavaScript.</p>
    <p>Edit the code on the left to see changes in real-time!</p>
    <button id="demo-button">Click Me!</button>
  </div>

  <script>
    // Your JavaScript here
    document.getElementById('demo-button').addEventListener('click', function() {
      alert('Button clicked!');
    });
  </script>
</body>
</html>`;

const DEFAULT_REACT = `import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="container">
      <h1>React Counter Example</h1>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));`;

const DEFAULT_CSS = `/* styles.css */
body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f9fafb;
  color: #333;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #3b82f6;
  margin-top: 0;
}

button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}`;

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialFiles: EditorFile[] = [
  {
    id: generateId(),
    name: 'index.html',
    language: 'html',
    content: DEFAULT_HTML,
    versions: [
      {
        id: generateId(),
        timestamp: Date.now(),
        content: DEFAULT_HTML,
        tag: 'initial'
      }
    ]
  },
  {
    id: generateId(),
    name: 'app.jsx',
    language: 'javascript',
    content: DEFAULT_REACT,
    versions: [
      {
        id: generateId(),
        timestamp: Date.now(),
        content: DEFAULT_REACT,
        tag: 'initial'
      }
    ]
  },
  {
    id: generateId(),
    name: 'styles.css',
    language: 'css',
    content: DEFAULT_CSS,
    versions: [
      {
        id: generateId(),
        timestamp: Date.now(),
        content: DEFAULT_CSS,
        tag: 'initial'
      }
    ]
  }
];

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<EditorFile[]>(() => {
    const savedFiles = localStorage.getItem('editor-files');
    return savedFiles ? JSON.parse(savedFiles) : initialFiles;
  });
  
  const [activeFileId, setActiveFileId] = useState<string | null>(() => {
    const savedActiveFileId = localStorage.getItem('active-file-id');
    return savedActiveFileId || (files.length > 0 ? files[0].id : null);
  });
  
  const [editorTheme, setEditorTheme] = useState<string>(() => {
    return localStorage.getItem('editor-theme') || 'vs-dark';
  });
  
  useEffect(() => {
    localStorage.setItem('editor-files', JSON.stringify(files));
  }, [files]);
  
  useEffect(() => {
    if (activeFileId) {
      localStorage.setItem('active-file-id', activeFileId);
    }
  }, [activeFileId]);
  
  useEffect(() => {
    localStorage.setItem('editor-theme', editorTheme);
  }, [editorTheme]);
  
  const activeFile = activeFileId 
    ? files.find(file => file.id === activeFileId) || null 
    : null;
  
  const addFile = (file: Omit<EditorFile, 'id' | 'versions'>) => {
    const newFile: EditorFile = {
      ...file,
      id: generateId(),
      versions: [
        {
          id: generateId(),
          timestamp: Date.now(),
          content: file.content,
          tag: 'initial'
        }
      ]
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };
  
  const updateFile = (id: string, content: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === id 
          ? { ...file, content } 
          : file
      )
    );
  };
  
  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files.length > 1 ? files.find(file => file.id !== id)?.id || null : null);
    }
  };
  
  const createVersion = (fileId: string, tag?: string) => {
    setFiles(prev => 
      prev.map(file => {
        if (file.id !== fileId) return file;
        
        const newVersion: FileVersion = {
          id: generateId(),
          timestamp: Date.now(),
          content: file.content,
          tag
        };
        
        return {
          ...file,
          versions: [...file.versions, newVersion]
        };
      })
    );
  };
  
  const restoreVersion = (fileId: string, versionId: string) => {
    setFiles(prev => 
      prev.map(file => {
        if (file.id !== fileId) return file;
        
        const versionToRestore = file.versions.find(v => v.id === versionId);
        if (!versionToRestore) return file;
        
        return {
          ...file,
          content: versionToRestore.content
        };
      })
    );
  };
  
  const tagVersion = (fileId: string, versionId: string, tag: string) => {
    setFiles(prev => 
      prev.map(file => {
        if (file.id !== fileId) return file;
        
        return {
          ...file,
          versions: file.versions.map(v => 
            v.id === versionId ? { ...v, tag } : v
          )
        };
      })
    );
  };
  
  const value = {
    files,
    activeFileId,
    addFile,
    updateFile,
    deleteFile,
    setActiveFileId,
    createVersion,
    restoreVersion,
    tagVersion,
    activeFile,
    editorTheme,
    setEditorTheme,
  };
  
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
