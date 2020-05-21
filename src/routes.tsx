import { HomePage } from "./pages/HomePage";
import { ViewerPage } from "./pages/ViewerPage";

export const routes = [
  { path: "/", exact: true, component: HomePage },
  { path: "/viewer", exact: true, component: ViewerPage },
];
