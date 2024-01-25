import ReactDOM from "react-dom/client";
import PresetDrawer from "./PresetDrawer";
import 'virtual:uno.css'
const rootDom = document.createElement("div");
document.body.appendChild(rootDom);
ReactDOM.createRoot(rootDom).render(<PresetDrawer />);
