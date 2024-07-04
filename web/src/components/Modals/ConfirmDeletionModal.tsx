import { useEffect } from "react";
import ReactDOM from "react-dom";
import { css } from "@emotion/react";

import { THEME_COLORS } from "~/themeProvider";

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

const modalRoot = document.getElementById("modal-root");
export const ConfirmDeletionModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.type === "keyup" && e.code === "Escape") {
        onClose();
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
        <div css={modalCSS}>
          <button
            onClick={onClose}
            css={modalCloseBtn}
          >
            ⨯
          </button>
          <h3>Confirm Deletion</h3>
          <h4>The project has unsolved tasks. Delete anyway?</h4>
          <footer css={footerCSS}>
            <button
              onClick={onClose}
              css={[footerButton, footerButtonCancel]}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              css={[footerButton, footerButtonCreate]}
            >
              Delete
            </button>
          </footer>
        </div>
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
  transition: visibility, opacity 0.5s ease-in-out;
  visibility: visible;
  z-index: 1;
  opacity: 0.6;
`;

const modalCloseBtn = css`
  position: absolute;
  top: 0;
  right: 15px;
  padding: 0;
  border: 0;
  color: #a9a9a9;
  background-color: transparent;
  font-size: 32px;
  cursor: pointer;
  outline: none;
  transition: color 0.3s linear;

  :hover {
    color: #6b6b6b;
  }
`;

const footerCSS = css`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 0 0;
`;

const footerButton = css`
  margin: 0 3px;
  padding: 10px 25px;
  border: 0;
  cursor: pointer;
  outline: none;
  transition: background-color 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  box-shadow: rgba(0, 0, 0, 0.117647) 0 1px 4px, rgba(0, 0, 0, 0.117647) 0 1px 2px;
  border-radius: 2px;
  border-bottom: 2px solid ${"#d8d8d8"};
  color: #fff;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.117647) 0 0;
  }
`;

const footerButtonCancel = css`
  color: #000;
  background-color: #fff;
`;
const footerButtonCreate = css`
  background-color: ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR};
  border-bottom: 2px solid ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR_DARK};
`;
