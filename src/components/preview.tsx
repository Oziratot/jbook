import React, {useCallback, useEffect, useRef} from 'react';

interface PreviewProps {
 code: string;
}

const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.getElementById('root');
              root.innerHTML = '<div style="color: red;">' + error + '</div>';
              throw(error);
            }
          }, false)
        </script>
      </body>
    </html>
  `

const Preview = ({ code }: PreviewProps) => {
  const iframeRef = useRef<any>();
  const handleLoad = useCallback(() => {
      iframeRef.current.contentWindow.postMessage(code, '*')
    }, [code]);

  useEffect(() => {
    const iframe = iframeRef.current;

    iframe.srcdoc = html;
    iframe.onload = handleLoad;

    return () => {
      iframe.onload = null;
    };
  }, [code, handleLoad]);


  return <iframe style={{ backgroundColor: 'white' }} title="iframe" ref={iframeRef} srcDoc={html} sandbox="allow-scripts"/>
}

export default Preview;
