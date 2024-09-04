import {useEffect, useState} from 'react';
import bundle from '../bundler'

import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

const CodeCell = () => {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { code, err } = await bundle(input);
      setCode(code);
      setError(err);
    }, 1000);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="console.log(1);"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  )
};

export default CodeCell;
