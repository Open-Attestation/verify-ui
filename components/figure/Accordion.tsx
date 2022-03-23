import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";

export interface AccordianProps {
  title: string;
  content: string;
}

const Accordion: React.FC<AccordianProps> = ({ title, content }) => {
  const [isOpen, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen((o) => !o), []);

  return (
    <article className="bg-white rounded-lg border-2">
      <div
        className="flex justify-between items-center gap-4 m-6 hover:text-primary hover:cursor-pointer"
        onClick={handleClick}
      >
        <h3 className="font-sans text-xl">{title}</h3>
        <FontAwesomeIcon
          icon={faChevronCircleDown}
          className={`text-2xl transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      <div
        className={`mx-6 transition-all text-left overflow-hidden ${isOpen ? "max-h-[500px] my-6" : "max-h-0 my-0"}`}
      >
        {content}
      </div>
    </article>
  );
};

export default Accordion;
