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
  <li key={key} className="relative mb-6">
    <div className="flex items-center">
      <div className="flex z-10 justify-center items-center w-8 h-8 rounded-full bg-white text-secondary border-4 border-secondary">
        <FontAwesomeIcon icon={faCheck} />
      </div>
      {!isLast && <div className="absolute ml-4 w-full bg-secondary h-4"></div>}
    </div>
    <div className="mt-4 pr-5">
      <h2 className="text-xl font-roboto-bold">{title}</h2>
      <p className="text-base font-normal">{description}</p>
    </div>
  </li>
);

const StepperTimeline: React.FC<StepperTimelineProps> = ({ items }) => (
  <ol className="flex">
    {items.map((item, i, arr) => {
      const isLast = arr.length - 1 === i;
      return genStepperItem(item, i, isLast);
    })}
  </ol>
);

export default StepperTimeline;
