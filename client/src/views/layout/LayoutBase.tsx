/** @jsxImportSource @emotion/react */
import { Route, Routes } from "react-router-dom";
import { useSession } from "../../auth/AuthContext";
import { useLoading } from "../../loading/LoadingContext";
import { LoadingMask } from "../components/LoadingMask";
import SideMenu from "../components/SideMenu";
import CreateOutcome from "../pages/project/CreateOutcome";
import CreatePost from "../pages/project/CreatePost";
import ProjectDetails from "../pages/project/ProjectDetails";
import ProjectList from "../pages/project/ProjectList";
import Sample from "../pages/test/sample";
import Mypage from "../pages/user/Mypage";
import VoteHistory from "../pages/user/mypage/VoteHistory";

const LayoutBase: React.FC = () => {
  const { session } = useSession();
  const { isLoading } = useLoading();

  return (
    <div>
      <SideMenu title="">
        <Routes>
          <Route path="/" element={<ProjectList />}></Route>
          <Route path="project">
            <Route path="create-post" element={<CreatePost />} />
            <Route path="list" element={<ProjectList />} />
            <Route path="details">
              <Route path=":projectId">
                <Route path="" element={<ProjectDetails />} />
                <Route path="create-outcome" element={<CreateOutcome />} />
              </Route>
            </Route>
          </Route>
          <Route path="mypage">
            <Route path="" element={<Mypage />} />
            <Route path="vote-history" element={<VoteHistory />} />
          </Route>
          <Route path="/sample" element={<Sample />}></Route>
        </Routes>
        {(!session || isLoading) && <LoadingMask></LoadingMask>}
      </SideMenu>
    </div>
  );
};

export default LayoutBase;
