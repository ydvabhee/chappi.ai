import React from 'react';
import { createRoot } from 'react-dom/client';
import Panel from '@pages/panel/Panel';
import '@pages/panel/index.css';



function init() {
  try {
    console.log('panel script loaded >> ', document.body.innerText);
  } catch (e) {
    console.error(e);
  }
  
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Panel root element");
  const root = createRoot(rootContainer);
  root.render(<Panel />);
}

init();

