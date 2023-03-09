/** @jsxImportSource @emotion/react */
import { Route, Routes } from "react-router-dom";
import { useSession } from "../../auth/AuthContextProvider";
import { LoadingMask } from "../components/LoadingMask";
import SideMenu from "../components/SideMenu";
import CreatePost from "../pages/project/CreatePost";
import ProjectDetails from "../pages/project/ProjectDetails";
import ProjectList from "../pages/project/ProjectList";
import Mypage from "../pages/user/Mypage";
import VoteHistory from "../pages/user/mypage/VoteHistory";

const LayoutBase: React.FC = () => {
  const { session } = useSession();
  return (
    <div>
      <SideMenu title="T3 Project">
        {session ? (
          <Routes>
            <Route path="/" element={<ProjectList />}></Route>
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
        ) : (
          <LoadingMask></LoadingMask>
        )}
      </SideMenu>
    </div>
  );
};

export default LayoutBase;