import React from 'react';
import './App.css';
import FormBuilder from './components/FormBuilder';
import Editor from './components/Editor';
import Settings from './components/Settings';

const App: React.FC = () => {
  const initialContent = [
    {
      extension: 'input',
      settings: {
        type: 'text',
        placeholder: 'Your name',
      },
    },
    {
      extension: 'input',
      settings: {
        type: 'text',
        placeholder: 'Surname',
      },
    },
    {
      extension: 'input',
      settings: {
        type: 'number',
        placeholder: 'Your page',
      },
    },
    {
      extension: 'select',
      settings: {
        options: ['male', 'female'],
        multiple: false,
      },
    },
  ];

  const [content, setContent] = React.useState(initialContent);

  return (
    <div className="container">
      <FormBuilder onSave={content => setContent(content)} />
    </div>
  );
};

export default App;