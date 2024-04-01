import "@govtechsg/sgds-masthead/dist/sgds-masthead/sgds-masthead.css";
import { SgdsMasthead } from "@govtechsg/sgds-masthead-react";

const Masthead: React.FC = () => {
  return (
    <header className="bg-[#EFEFEF]">
      <div className="container">
        <div className="flex flex-wrap py-0.5">
          <SgdsMasthead placeholder={"Singapore Government Design System Masthead"} onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }} />
        </div>
      </div>
    </header>
  );
};

export default Masthead;
