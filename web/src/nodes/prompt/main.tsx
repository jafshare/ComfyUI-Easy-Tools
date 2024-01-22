import ReactDOM from "react-dom/client";
import { Button } from "antd";
const rootDom = document.createElement("div");
document.body.appendChild(rootDom);
ReactDOM.createRoot(rootDom).render(
  <Button
    className="TestButton"
    style={{ position: "absolute", left: 0, bottom: 0, zIndex: 991999 }}
  >
    test22233312312333
  </Button>
);
