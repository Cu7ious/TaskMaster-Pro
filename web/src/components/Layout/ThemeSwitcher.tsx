import { THEME, THEME_COLORS, useTheme } from "~/themeProvider";
import { css } from "@emotion/react";
import { useState } from "react";

const ThemeSwitchBtn = css`
  width: 40px;
  height: 40px;
  outline: none;
  border: 1px solid #fff;
  font-size: 0;
  cursor: pointer;
`;

const WORKDAY_BLUE = css`
  background-image: linear-gradient(
    to right,
    ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR},
    ${THEME_COLORS.WORKDAY_BLUE.MAIN_COLOR_DARK}
  );
`;
const ANGULAR_RED = css`
  background-image: linear-gradient(
    to right,
    ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR},
    ${THEME_COLORS.ANGULAR_RED.MAIN_COLOR_DARK}
  );
`;
const BRAVE_SKY = css`
  background-image: linear-gradient(
    to right,
    ${THEME_COLORS.BRAVE_SKY.MAIN_COLOR},
    ${THEME_COLORS.BRAVE_SKY.MAIN_COLOR_DARK}
  );
`;

const AnimatedSpecialChar = css`
  animation: spin 5000ms infinite linear;
  background-color: transparent;
  border-radius: 30px;
  padding: 0;
  font-size: 32px;
  display: block;
  outline: none;
  border: none;
  cursor: pointer;
  position: relative;
  top: 15px;
  left: 10px;
  max-width: 30px;
  max-height: 30px;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ThemeSwitcherCSS = css`
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 32px 0 0 32px;
  background-color: #fff;
  position: fixed;
  border: none;
  right: 0;
  top: 50vh;
  display: grid;
  grid-template-columns: 20% 80%;
  width: 175px;
  transition: translateX, 0.3s linear;

  ul {
    list-style: none;
    padding: 9px 0;
    margin: 0;
    text-align: center;

    li {
      display: inline-block;
    }
  }
`;

function ThemeSelected(theme: THEME) {
  switch (theme) {
    case THEME.WORKDAY_BLUE:
      return 1;
    case THEME.ANGULAR_RED:
      return 2;
    case THEME.BRAVE_SKY:
      return 3;
  }
}

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [{ appTheme }, dispatch] = useTheme();

  const switchAppTheme = (e: any) => {
    dispatch({ type: "SWITCH_APP_THEME", payload: e.target.innerText });
  };

  const ThemeSwitcherTransform = css`
    transform: translateX(${!isOpen ? "134px" : 0});
  `;
  const li = css`
    li:nth-of-type(${ThemeSelected(appTheme)}) {
      border: 1px solid;
    }
  `;

  return (
    <div css={[ThemeSwitcherCSS, ThemeSwitcherTransform]}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        css={AnimatedSpecialChar}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 20 20"
          aria-hidden="true"
          height="30px"
          width="30px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.024 9.25c.47 0 .827-.433.637-.863a4 4 0 0 0-4.094-2.364c-.468.05-.665.576-.43.984l1.08 1.868a.75.75 0 0 0 .649.375h2.158ZM7.84 7.758c-.236-.408-.79-.5-1.068-.12A3.982 3.982 0 0 0 6 10c0 .884.287 1.7.772 2.363.278.38.832.287 1.068-.12l1.078-1.868a.75.75 0 0 0 0-.75L7.839 7.758ZM9.138 12.993c-.235.408-.039.934.43.984a4 4 0 0 0 4.094-2.364c.19-.43-.168-.863-.638-.863h-2.158a.75.75 0 0 0-.65.375l-1.078 1.868Z"></path>
          <path
            fillRule="evenodd"
            d="m14.13 4.347.644-1.117a.75.75 0 0 0-1.299-.75l-.644 1.116a6.954 6.954 0 0 0-2.081-.556V1.75a.75.75 0 0 0-1.5 0v1.29a6.954 6.954 0 0 0-2.081.556L6.525 2.48a.75.75 0 1 0-1.3.75l.645 1.117A7.04 7.04 0 0 0 4.347 5.87L3.23 5.225a.75.75 0 1 0-.75 1.3l1.116.644A6.954 6.954 0 0 0 3.04 9.25H1.75a.75.75 0 0 0 0 1.5h1.29c.078.733.27 1.433.556 2.081l-1.116.645a.75.75 0 1 0 .75 1.298l1.117-.644a7.04 7.04 0 0 0 1.523 1.523l-.645 1.117a.75.75 0 1 0 1.3.75l.644-1.116a6.954 6.954 0 0 0 2.081.556v1.29a.75.75 0 0 0 1.5 0v-1.29a6.954 6.954 0 0 0 2.081-.556l.645 1.116a.75.75 0 0 0 1.299-.75l-.645-1.117a7.042 7.042 0 0 0 1.523-1.523l1.117.644a.75.75 0 0 0 .75-1.298l-1.116-.645a6.954 6.954 0 0 0 .556-2.081h1.29a.75.75 0 0 0 0-1.5h-1.29a6.954 6.954 0 0 0-.556-2.081l1.116-.644a.75.75 0 0 0-.75-1.3l-1.117.645a7.04 7.04 0 0 0-1.524-1.523ZM10 4.5a5.475 5.475 0 0 0-2.781.754A5.527 5.527 0 0 0 5.22 7.277 5.475 5.475 0 0 0 4.5 10a5.475 5.475 0 0 0 .752 2.777 5.527 5.527 0 0 0 2.028 2.004c.802.458 1.73.719 2.72.719a5.474 5.474 0 0 0 2.78-.753 5.527 5.527 0 0 0 2.001-2.027c.458-.802.719-1.73.719-2.72a5.475 5.475 0 0 0-.753-2.78 5.528 5.528 0 0 0-2.028-2.002A5.475 5.475 0 0 0 10 4.5Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <ul
        css={li}
        onClick={switchAppTheme}
      >
        <li>
          <button css={[ThemeSwitchBtn, WORKDAY_BLUE]}>WORKDAY_BLUE</button>
        </li>
        <li>
          <button css={[ThemeSwitchBtn, ANGULAR_RED]}>ANGULAR_RED</button>
        </li>
        <li>
          <button css={[ThemeSwitchBtn, BRAVE_SKY]}>BRAVE_SKY</button>
        </li>
      </ul>
    </div>
  );
}
