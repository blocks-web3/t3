import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { SessionContext } from "./auth/AuthContextProvider";
import CreatePost from "./views/pages/project/CreatePost";
import ProjectDetails from "./views/pages/project/ProjectDetails";
import ProjectList from "./views/pages/project/ProjectList";
import Mypage from "./views/pages/user/Mypage";
import VoteHistory from "./views/pages/user/mypage/VoteHistory";

function App() {
  const [session] = useContext(SessionContext);

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
      </Routes>
      {JSON.stringify(session.userId)}
    </div>
  );
}

export default App;
