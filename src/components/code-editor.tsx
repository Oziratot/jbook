import 'bulmaswatch/superhero/bulmaswatch.min.css'
import './code-editor.css'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import React from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = React.useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    })

    monacoEditor.getModel()?.updateOptions({ tabSize: 2});
  }

  const onFormatClick = () => {
    // get current value from the editor
    const unformattedValue = editorRef.current.getModel().getValue();

    // format the value using prettier
    const formattedValue = prettier.format(unformattedValue, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/g, '')

    // set the formatted value back to the editor
    editorRef.current.getModel().setValue(formattedValue);
  }

  return (
    <div className="editor-wrapper">
      <button className="button button-format is-primary is-small" onClick={onFormatClick}>Format</button>

      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        height="100%"
        language="javascript"
        theme="dark"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  )
}

export default CodeEditor;
