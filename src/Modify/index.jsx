import React, { useRef, useEffect } from 'react';
import Editor from './editor.class';

export function EditorPage() {
  const editContainerRef = useRef(null);

  const logSvg = (content) => {
    console.log(content)
  }

  useEffect(() => {
    if(editContainerRef.current !== null){
      const editor = new Editor(editContainerRef.current);
      editor.configure( 'saveHandler', logSvg )
      // editor.load()
      fetch("https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/tiger.svg")
        .then(response => response.text())
        .then(svgContent => editor.load(svgContent))
    }
  }, [])

  return (
    <>
      <h3>SVG-Edit.react sample HTML</h3>
      <div id="container" ref={editContainerRef} style={{width: '100%',height: '100vh'}} />
    </>
  );
}
