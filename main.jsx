import { createRoot } from "react-dom/client";
import App from "./src/App";
import RetouchProvider from "./src/hooks/useRetouch";

const root = createRoot(document.querySelector('#app'))

root.render(
  <RetouchProvider>
    <App />
  </RetouchProvider>
)