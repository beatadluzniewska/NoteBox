import { Link } from "react-router-dom";
import Logo from "../assets/note-box.svg";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen">
      {/* Fixed header at the top-left corner */}
      <header className="fixed top-0 left-0 flex items-center space-x-2 p-4 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Work Journal Logo" className="h-8 w-8" />
          <span className="text-2l font-bold text-gray-800">NoteBox</span>
        </Link>
      </header>

      {/* Main content centered both vertically and horizontally */}
      <main className="flex justify-center items-center min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
