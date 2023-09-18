import { Button } from "@/components/button";
import { postStatus } from "@/util/constant";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavOption {
  // link: string;
  onClick?: () => void;
  icon: IconProp;
  label: string;
}

const ModalHeader = (): React.ReactElement => {
  return (
    <div className="flex p-3 items-center bg-primary">
      <span className="text-xl flex-1 font-medium justify-self-start">
        New Post
      </span>
      <span className="text-xs inline-flex gap-2 font-semibold">
        Drafts
        <span className="flex w-4 h-4 justify-center text-primary rounded-sm bg-black">
          <b>0</b>
        </span>
      </span>
    </div>
  );
};

const ModalFooter = ({
  message,
  setFieldValue,
}: {
  message: string | null;
  setFieldValue: (field: string, value: string) => void;
}): React.ReactElement => {
  return (
    <div className="flex flex-col gap-2 py-3 bg-primary-dark">
      <div className="flex justify-center gap-4">
        <Button
          label="Save Draft"
          type="submit"
          className="!m-0 w-1/4 bg-transparent border hover:text-black text-sm hover:!bg-primary border-primary outline-primary text-white"
          onMouseEnter={() => setFieldValue("postStatus", postStatus[0])}
        />
        <Button
          label="Post"
          type="submit"
          className="w-1/4 !m-0 text-sm"
          onMouseEnter={() => setFieldValue("postStatus", postStatus[1])}
        />
      </div>
      {message && (
        <div className="inline-flex justify-center">
          <span className="text-primary capitalize text-xs text-center animate-fade-in-down">
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

const DropDownPopover = ({
  options,
  isVisible,
  itemClassName,
  wrapperClass = "",
}: {
  options: NavOption[];
  isVisible: boolean;
  itemClassName?: string;
  wrapperClass?: string;
}): React.ReactElement => {
  return (
    <ul
      className={`${wrapperClass} flex p-2 relative rounded-md gap-2 bg-primary/50 text-white flex-col ease-in-out ${
        isVisible ? "animate-fade-in-down" : "hidden"
      }`}
    >
      {options?.map((item: NavOption, index: number) => (
        <li
          className={itemClassName || "px-1 text-sm flex items-center gap-2"}
          key={index}
          onClick={item?.onClick}
        >
          {item?.icon && <FontAwesomeIcon icon={item.icon} />} {item.label}
        </li>
      ))}
    </ul>
  );
};

export { ModalHeader, ModalFooter, DropDownPopover };
