/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import CreatePost from "../pages/project/CreatePost";
import ProjectDetails from "../pages/project/ProjectDetails";
import ProjectList from "../pages/project/ProjectList";
import Mypage from "../pages/user/Mypage";
import VoteHistory from "../pages/user/mypage/VoteHistory";

const LayoutBase: React.FC = () => {
  return (
    <div>
      {/* <header style={styles.header}>head</header> */}
      <header css={headerStyle}>
        <Header></Header>
      </header>
      <main>
        <Routes>
          <Route path="project">
            <Route path="create-post" element={<CreatePost />} />
            <Route path="list" element={<ProjectList />} />
            <Route path="details">
              <Route path=":projectId" element={<ProjectDetails />} />
            </Route>
          </Route>
          <Route path="mypage">
            <Route path="" element={<Mypage />} />
            <Route path="vote-history" element={<VoteHistory />} />
          </Route>
        </Routes>
      </main>
      <footer>footer</footer>
    </div>
  );
};

export default LayoutBase;

//css
// const styles = {
//   header: {
//     height: 100,
//     background: "#ddd",
//   },
//   main: {
//     height: 200,
//   },
//   footer: {
//     height: 100,
//     background: "#ddd",
//   },
// };

// const headerStyle = css({
//   right: 0,
//   left: 0,
//   padding: 0,
//   margin: 0,
// });

const headerStyle = css`
  top: 0;
  right: 0;
  left: 0;
  padding: 0;
  margin: 0;
  position: absolute;
`;

const styles = {
  header: {
    top: 0,
    right: 0,
    left: 0,
    padding: 0,
    margin: 0,
    position: "absolute",
  },
};
