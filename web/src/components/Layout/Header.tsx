import byCu7iousWatermark from "~/assets/svg/by-Cu7ious-watermark-white.svg";
import githubIcon from "~/assets/svg/github.svg";
import { THEME_COLORS, useTheme } from "~/themeProvider";
import { css } from "@emotion/react";
import { useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const navButton = css`
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQAAAAB/ecQqAAAAAnRSTlMAAHaTzTgAAAAWSURBVHgBY6AFYP4PBAewUoPbFMoBAE11OPW6yVcZAAAAAElFTkSuQmCC)
    no-repeat 50%;
  display: inline-block;
  width: 57px;
  height: 57px;
  cursor: pointer;
  padding: 10px;
  outline: none;
  background-size: 65%;
  border: 0;
`;

const headerLeft = css`
  grid-area: header-left;
`;
const headerCenter = css`
  grid-area: header-center;
  text-align: center;
`;
const headerRight = css`
  grid-area: header-right;
`;

const brandLogo = css`
  display: inline-block;
  width: 150px;
  margin: 21px 0 0;

  @media screen and (max-width: 700px) {
    text-align: right;
  }

  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const githubBadge = css`
  position: absolute;
  top: 12px;
  right: 15px;
`;

const header = css`
  position: fixed;
  display: grid;
  width: 100%;
  height: 55px;
  top: 0;
  z-index: 1;

  grid-template-columns: 25% 50% 25%;
  grid-template-rows: auto;
  grid-template-areas: "header-left header-center header-right";
  transition: background-image 0.2s ease-in-out;

  box-shadow: 0 0 2px #000000;
`;
const H1 = css`
  margin: 0;
`;
const logoText = css`
  font-weight: 100;
  font-style: italic;
  position: absolute;
  top: 16px;
  color: #fff;
  font-size: 24px;
  left: 55px;
`;
const logoSVG = css`
  position: absolute;
  left: 230px;
  top: 20px;
`;

const headerLogo = css`
  @media screen and (max-width: 700px) {
    & svg {
      width: 60%;
    }
  }
`;

export default function Header(props: any) {
  const authContext = useContext(AuthContext);
  const [{ appTheme }] = useTheme();
  const openSidebar = useCallback(() => props.setActivePanel(true), [props]);

  const headerColors = css`
    background-image: linear-gradient(
      to right,
      ${(THEME_COLORS as any)[appTheme].MAIN_COLOR},
      ${(THEME_COLORS as any)[appTheme].MAIN_COLOR_DARK}
    );
    border-bottom: 4px solid ${(THEME_COLORS as any)[appTheme].MAIN_COLOR_DARK};
  `;

  const { user } = authContext;

  return (
    <header css={[header, headerColors]}>
      <div css={headerLogo}>
        <h1
          css={[headerLeft, H1]}
          title="TaskMaster Pro"
        >
          <button
            css={navButton}
            onClick={openSidebar}
          />
          <span css={logoText}>TaskMaster Pro</span>
          <svg
            css={logoSVG}
            width="27px"
            height="20px"
            viewBox="0 0 27 20"
          >
            <g
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                transform="translate(-396.000000, -3254.000000)"
                fill="#FFFFFF"
              >
                <polygon
                  transform="translate(409.502930, 3263.995337) scale(1, -1) translate(-409.502930, -3263.995337)"
                  points="406.412678 3254.8501 422.207764 3269.49995 418.511719 3273.14058 406.412678 3261.72944
                    400.39917 3267.03779 396.798096 3263.45283"
                />
              </g>
            </g>
          </svg>
        </h1>
      </div>
      <div css={headerCenter}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cu7io.us/"
        >
          <img
            css={brandLogo}
            src={byCu7iousWatermark}
            alt="Created by CU7IOUS"
          />
        </a>
      </div>
      <div css={headerRight}>
        {user ? (
          <img
            css={userAvatar}
            src={user.profilePic}
            alt="User Avatar"
          />
        ) : (
          <a
            css={githubBadge}
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Cu7ious/"
          >
            <img
              src={githubIcon}
              alt="See more on GitHub"
            />
          </a>
        )}
      </div>
    </header>
  );
}

const userAvatar = css`
  ${githubBadge}
  width: 32px;
  border-radius: 32px;
`;
