import { Link } from "react-router-dom";
import Brand from "../components/Brand";
import Button from "../components/Button";

function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F6F4EE] px-4 py-10 text-center">
      <div className="max-w-md">
        <div className="flex justify-center"><Brand /></div>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[#C96A4A]">404</p>
        <h1 className="mt-3 font-serif-display text-5xl text-[#1F1A17]">This table is not set.</h1>
        <p className="mt-4 leading-7 text-[#1F1A17]/65">The page you requested does not exist in this Scan2Order service.</p>
        <Link to="/" className="mt-7 inline-flex"><Button>Return Home</Button></Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
