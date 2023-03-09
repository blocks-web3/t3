import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreatePost from "./views/pages/project/CreatePost";
import ProjectDetails from "./views/pages/project/ProjectDetails";
import ProjectList from "./views/pages/project/ProjectList";
import Sample from "./views/pages/test/sample";
import Mypage from "./views/pages/user/Mypage";
import VoteHistory from "./views/pages/user/mypage/VoteHistory";

function App() {
  return (
    <div className="App">
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
        <Route path="sample" element={<Sample />} />
      </Routes>
    </div>
  );
}

export default App;
