import { createRoot } from 'react-dom/client';
const div = document.createElement('div');
document.body.appendChild(div);

const root = createRoot(div);
root.render(
    <div>
     
    </div>
);

try {
  // console.log('content script loaded >>', document.body.title);
} catch (e) {
  console.error(e);
}
