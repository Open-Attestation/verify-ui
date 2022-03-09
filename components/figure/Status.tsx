import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export interface StatusProps {
  type: "NIL" | "LOADING" | "ERROR";
  message?: JSX.Element;
}

const genIcon = (type: StatusProps["type"]) => {
  switch (type) {
    case "LOADING":
      return <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-gray-500/80" />;
    case "ERROR":
    default:
      return <FontAwesomeIcon icon={faCircleXmark} className="text-2xl text-red-500/80" />;
  }
};

const genColour = (type: StatusProps["type"]) => {
  switch (type) {
    case "LOADING":
      return "bg-secondary/10 border-t-secondary";
    case "ERROR":
    default:
      return "text-red-700 bg-red-100/50 border-t-red-500";
  }
};

const Status: React.FC<StatusProps> = ({ type, message }) => {
  if (type === "NIL" || !message) return null;

  return (
    <section className="container my-10">
      <div
        className={`flex gap-2 items-center justify-center
        px-4 py-10
        border-t-4 ${genColour(type)}`}
      >
        {/* {genIcon(type)} */}
        {message}
      </div>
    </section>
  );
};

export default Status;
