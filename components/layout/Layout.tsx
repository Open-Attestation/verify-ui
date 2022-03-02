import Masthead from "./Masthead";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

const Layout: React.FC<React.HTMLAttributes<HTMLElement>> = ({ children, className }) => (
  <>
    <Masthead />
    <NavigationBar />
    <main className={className}>{children}</main>
    <Footer />
  </>
);

export default Layout;
