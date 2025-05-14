
import { EditorLayout } from '@/components/EditorLayout';
import { EditorProvider } from '@/contexts/EditorContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  return (
    <ThemeProvider>
      <EditorProvider>
        <EditorLayout />
      </EditorProvider>
    </ThemeProvider>
  );
};

export default Index;
