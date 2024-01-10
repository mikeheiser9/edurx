import { Loader } from "@/app/signup/commonBlocks";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LoadMore = ({
  onClick,
  isLoading,
}: {
  onClick?: () => void;
  isLoading: boolean;
}) => (
  <div className="flex flex-col justify-center items-center p-2 my-3">
    {isLoading ? (
      <Loader />
    ) : (
      <div
        onClick={onClick}
        className="text-eduBlack cursor-pointer animate-fade-in-down flex-col flex"
      >
        <span>More</span>
        <FontAwesomeIcon icon={faChevronCircleDown} />
      </div>
    )}
  </div>
);
