
import { useEditor } from '@/contexts/EditorContext';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { X, Plus, File, FileCode, FileText } from 'lucide-react';
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FileTabs() {
  const { files, activeFileId, setActiveFileId, deleteFile, addFile } = useEditor();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('html');
  
  const getFileIcon = (language: string) => {
    switch (language) {
      case 'html':
        return <FileCode className="h-4 w-4 mr-1" />;
      case 'css':
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return <File className="h-4 w-4 mr-1" />;
    }
  };
  
  const getFileExtension = (fileType: string) => {
    switch (fileType) {
      case 'html': return '.html';
      case 'css': return '.css';
      case 'javascript': return '.js';
      case 'typescript': return '.ts';
      case 'jsx': return '.jsx';
      case 'tsx': return '.tsx';
      default: return '';
    }
  };
  
  const getDefaultContent = (fileType: string) => {
    switch (fileType) {
      case 'html':
        return '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
      case 'css':
        return '/* styles */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}';
      case 'javascript':
        return '// JavaScript code\nconsole.log("Hello world!");';
      case 'jsx':
        return 'import React from "react";\n\nfunction Component() {\n  return <div>Hello World</div>;\n}\n\nexport default Component;';
      default:
        return '';
    }
  };
  
  const handleAddFile = () => {
    if (!fileName) return;
    
    const extension = getFileExtension(fileType);
    const name = fileName.includes('.') ? fileName : fileName + extension;
    
    addFile({
      name,
      language: fileType,
      content: getDefaultContent(fileType),
    });
    
    setFileName('');
    setFileType('html');
    setOpen(false);
  };
  
  return (
    <div className="flex items-center border-b">
      <div className="flex-1 overflow-x-auto">
        <Tabs value={activeFileId || ''} onValueChange={setActiveFileId}>
          <TabsList className="bg-transparent h-10">
            {files.map((file) => (
              <TabsTrigger
                key={file.id}
                value={file.id}
                className="data-[state=active]:bg-background h-10 px-4 flex items-center gap-1"
              >
                {getFileIcon(file.language)}
                {file.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Close tab</span>
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="jsx">JSX (React)</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="tsx">TSX (React + TS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddFile} className="w-full">Create File</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
