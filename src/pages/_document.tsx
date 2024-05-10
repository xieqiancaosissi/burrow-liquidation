import { Html, Head, Main, NextScript } from "next/document";
import Modal from "react-modal";
Modal.defaultStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
    outline: "none",
  },
  content: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -65%)",
    outline: "none",
  },
};
if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div id="root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
