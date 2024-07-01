import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/react";
import { useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const modalRoot = document.getElementById("modal-root");
export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.type === "keyup" && e.code === "Escape") {
        onClose && onClose();
      }
    }
    window.addEventListener("keyup", callback);
    return () => {
      window.removeEventListener("keyup", callback);
    };
  });

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div css={modalCSS}>{children}</div>
        <div
          onClick={onClose}
          css={modalOverlay}
        />
      </>,
      modalRoot
    );
  }
};

const modalCSS = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 45vw;
  min-height: 15vh;
  background-color: #fff;
  padding: 33px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const modalOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0;
  cursor: pointer;
  -webkit-transition: visibility, opacity 0.5s ease-in-out;
  transition: visibility, opacity 0.5s ease-in-out;
  visibility: visible;
  z-index: 1;
  opacity: 0.6;
`;
