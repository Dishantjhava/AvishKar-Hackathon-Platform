import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => (
  <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
    <span className="text-7xl font-black text-[#E02567] mb-2 font-mono">404</span>
    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">Page Not Found</h1>
    <p className="text-slate-600 text-sm max-w-md mb-8 leading-relaxed">
      Oops! The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/">
      <Button variant="primary" size="md">
        ← Back to Home
      </Button>
    </Link>
  </div>
);

export default NotFound;
