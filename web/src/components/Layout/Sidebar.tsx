import byCU7IOUSWatermark from "~/assets/svg/by-Cu7ious-watermark-black.svg";
import { THEME_COLORS, useTheme } from "~/themeProvider";
import { css } from "@emotion/react";
import { useCallback } from "react";
import UserProfile from "~/components/Auth/UserProfile";

export default function Sidebar(props: any) {
  const [{ appTheme }] = useTheme();
  const color = { color: `${THEME_COLORS[appTheme].MAIN_COLOR}` };
  const closeSidebar = useCallback(() => props.setActivePanel(false), [props.activePanel]);

  return (
    <>
      <aside css={[sidebar, props.activePanel && activeSidebar]}>
        <h2 style={color}>Task Master Pro</h2>
        <h3 style={color}>Plan Smart, Solve Better.</h3>
        <button
          css={closeButton}
          onClick={closeSidebar}
        >
          ⨯
        </button>
        <section css={content}>
          <UserProfile onLogout={props.setActivePanel} />
          {/* <ul>
            <li>
              Cutting edge frontend stack, <b>simplified</b>
            </li>
          </ul> */}
        </section>
        <footer css={footer}>
          <p>
            Designed &amp; coded with &hearts;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://cu7io.us/"
            >
              <img
                src={byCU7IOUSWatermark}
                alt="Created by CU7IOUS"
              />
            </a>
          </p>
        </footer>
      </aside>
      <div
        css={[magOverlay, props.activePanel && activeOverlay]}
        id="magnet-overlay"
        onClick={closeSidebar}
      />
    </>
  );
}

const footer = css`
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;

  p {
    margin-left: -175px;
    font-size: 12px;
    font-style: italic;
    color: #3d4255;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;

    & img {
      width: 100px;
      position: absolute;
      margin-left: 5px;
      margin-top: 3px;
    }

    svg {
      width: 100px;
      bottom: -6px;
      position: absolute;
      margin-left: 5px;
    }
  }
`;

const content = css`
  max-width: 100%;
  margin-top: 30px;
  overflow-y: auto;

  ul {
    list-style-position: inside;
  }
`;

const CORRECTED_TRANSLATION = "40px";
const sidebar = css`
  width: 400px;
  height: calc(100vh - 110px);
  position: fixed;
  top: 0;
  display: block;
  left: 0;
  background: #fff;
  padding: 30px 30px 80px 30px;
  z-index: 999;
  transform: translateX(-460px);
  transition: transform 0.5s ease-in-out;

  h2,
  h3 {
    font-weight: 100;
    font-style: italic;
    text-align: center;
    color: #006db6;
  }

  @media screen and (max-width: 600px) {
    width: calc(100% - ${CORRECTED_TRANSLATION});
    box-sizing: border-box;
    height: 100vh;
  }

  .wrapper {
    min-height: 100%;
    color: #3d4255;
    background-color: #e0e0e0;
  }
`;

const closeButton = css`
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

const activeSidebar = css`
  transform: translateX(0);
  overflow-y: hidden;

  @media screen and (max-width: 600px) {
    width: 100% !important;
  }
`;

const magOverlay = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #000;
  visibility: hidden;
  opacity: 0;
  cursor: pointer;
  transition: visibility, opacity 0.5s ease-in-out;
`;

const activeOverlay = css`
  visibility: visible;
  z-index: 99;
  opacity: 0.6;
`;
