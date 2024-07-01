import React from "react";
import { apiURL } from "../../API";
import { css } from "@emotion/react";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = apiURL + "/user/login";
  };

  return (
    <div css={login}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;

const login = css`
  padding: 30px;
  margin: 10vh auto 0;
  min-width: 40vw;
  max-width: 40vw;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    margin-top: 0;
  }

  button {
    margin: 0 3px;
    padding: 10px;
    border: 0;
    cursor: pointer;
    outline: none;
    background-color: #fff;
    transition: background-color 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    box-shadow: rgba(0, 0, 0, 0.117647) 0 1px 4px, rgba(0, 0, 0, 0.117647) 0 1px 2px;
    border-radius: 2px;
    border-bottom: 2px solid #d8d8d8;
  }
`;
