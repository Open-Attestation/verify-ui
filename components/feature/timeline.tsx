import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface StepperItem {
  title: string;
  description: string;
}

interface StepperTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StepperItem[];
}

const genStepperItem = ({ title, description }: StepperItem, key: number, isLast: boolean) => (
  <li key={key} className="relative mb-6 sm:mb-0">
    <div className="flex items-center">
      <div className="flex z-10 justify-center items-center w-8 h-8 rounded-full bg-white text-secondary border-4 border-secondary">
        <FontAwesomeIcon icon={faCheck} />
      </div>
      {!isLast && <div className="hidden sm:block absolute ml-4 w-full bg-secondary h-4"></div>}
    </div>
    <div className="mt-4 sm:pr-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-base font-normal">{description}</p>
    </div>
  </li>
);

const StepperTimeline: React.FC<StepperTimelineProps> = ({ items }) => (
  <ol className="sm:flex">
    {items.map((item, i, arr) => {
      const isLast = arr.length - 1 === i;
      return genStepperItem(item, i, isLast);
    })}
  </ol>
);

export default StepperTimeline;
