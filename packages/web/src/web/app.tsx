import { Switch, Route } from "wouter";
import Layout from "./components/Layout";
import HomePage from "./pages/index";
import ProblemsPage from "./pages/problems";
import ProblemDetailPage from "./pages/problem-detail";
import StatsPage from "./pages/stats";
import BookmarksPage from "./pages/bookmarks";
import SignInPage from "./pages/sign-in";
import DrillPage from "./pages/drill";
import InterviewPage from "./pages/interview";
import PlaylistsPage from "./pages/playlists";
import PlaylistDetailPage from "./pages/playlist-detail";
import CheatsheetPage from "./pages/cheatsheet";
import ResourcesPage from "./pages/resources";
import FermiPage from "./pages/fermi";

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/problems" component={ProblemsPage} />
        <Route path="/problems/:id" component={ProblemDetailPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/bookmarks" component={BookmarksPage} />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/drill" component={DrillPage} />
        <Route path="/interview" component={InterviewPage} />
        <Route path="/playlists" component={PlaylistsPage} />
        <Route path="/playlists/:id" component={PlaylistDetailPage} />
        <Route path="/cheatsheet" component={CheatsheetPage} />
        <Route path="/resources" component={ResourcesPage} />
        <Route path="/fermi" component={FermiPage} />
      </Switch>
    </Layout>
  );
}
