import React, {useCallback, useEffect, useRef} from 'react';
import './preview.css'

interface PreviewProps {
 code: string;
 error: string;
}

const html = `
    <html>
      <head>
        <style>
          html { background-color: #FFF }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red;">' + err + '</div>';
            console.log(err);
          };
        
          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              handleError(error);
            }
          }, false)
        </script>
      </body>
    </html>
  `

const Preview = ({ code, error }: PreviewProps) => {
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


  return (
    <div className="preview-wrapper">
      <iframe
        title="iframe"
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {error && (
        <div className="error-message">{error}</div>
      )}
    </div>
  )
}

export default Preview;
