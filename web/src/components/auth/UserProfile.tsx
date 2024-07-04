import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { apiURL } from "../../API";
import { css } from "@emotion/react";

const UserProfile: React.FC<any> = ({ onLogout }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Error: AuthContext not available</p>;
  }

  const { user, setUser } = authContext;

  const handleLogout = async () => {
    await axios.get(apiURL + "/user/logout", { withCredentials: true });
    setUser(null);
    onLogout(false);
  };

  return (
    <div css={userProfile}>
      {user && (
        <div>
          <h1>Hello, {user.username}</h1>
          <img
            src={user.profilePic}
            alt="Profile"
          />
          <p>
            <button onClick={handleLogout}>Logout</button>
          </p>
        </div>
      )}
    </div>
  );
};

const userProfile = css`
  text-align: center;

  img {
    max-width: 160px;
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

export default UserProfile;
