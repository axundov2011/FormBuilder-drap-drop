import { useState, useCallback } from 'react';

export interface Element {
  extension: string;
  settings: {
    [key: string]: any;
  };
}

export interface Extension {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  settings: {
    [key: string]: any;
  };
  renderSettings: (settings: any) => React.ReactNode;
  render: (settings: any) => React.ReactNode;
}

interface FormBuilder {
  content: Element[];
  addElement: (element: Element) => void;
  removeElement: (index: number) => void;
}

const useFormBuilder = (): FormBuilder => {
  const [content, setContent] = useState<Element[]>([]);

  const addElement = useCallback((element: Element) => {
    setContent((prevContent) => [...prevContent, element]);
  }, []);

  const removeElement = useCallback((index: number) => {
    setContent((prevContent) => {
      const newContent = [...prevContent];
      newContent.splice(index, 1);
      return newContent;
    });
  }, []);

  return {
    content,
    addElement,
    removeElement,
  };
};

export default useFormBuilder;