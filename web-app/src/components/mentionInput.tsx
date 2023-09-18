import React, { useEffect, useRef, useState } from "react";
import { TextArea } from "./textArea";
import InfiniteScroll from "./infiniteScroll";
import Image from "next/image";
import {
  boldOnSearch,
  getStaticImageUrl,
  removeSubstring,
} from "@/util/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { useDebounce } from "@/hooks";

interface InfiniteScrollProps {
  className?: string;
  callBack: (search?: string) => Promise<void>;
  children?: React.ReactNode;
  hasMoreData: boolean;
  showLoading?: boolean;
}

interface textAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  name?: string;
  className?: string;
  label?: string | React.JSX.Element;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  isFormikField?: boolean;
}

interface DataOptions {
  accessKey?: string;
  primaryKey?: string;
  imageKey?: string;
  label?: string | string[];
}

interface MentionInputProps<T = any> {
  triggerOn?: string;
  suggetions: T[];
  dataOptions: DataOptions;
  allowSpaceInQuery?: boolean;
  useInfiniteScroll?: boolean;
  hightlightOnSearch?: boolean;
  infiniteScrollProps?: InfiniteScrollProps;
  textAreaProps?: textAreaProps;
  value: string;
  selectedMentions: T[];
  setSuggetions: React.Dispatch<React.SetStateAction<T[]>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setMentions: React.Dispatch<React.SetStateAction<T[]>>;
  triggerCallback: (searchKeyword: string) => void;
  onSelect: (value: T) => void;
  onRemoveMention?: (value: T) => void;
}

const MentionInput: React.FC<MentionInputProps> = ({
  triggerOn = "@",
  suggetions = [],
  dataOptions,
  allowSpaceInQuery,
  hightlightOnSearch,
  useInfiniteScroll = false,
  infiniteScrollProps,
  textAreaProps,
  value,
  selectedMentions,
  setSuggetions,
  setValue,
  triggerCallback,
  onSelect,
  onRemoveMention,
  setMentions,
}) => {
  const [mentionValue, setMentionValue] = useState<string>("");
  const [shouldTrigger, setShouldTrigger] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // const [suggestionBoxPosition, setSuggestionBoxPosition] = useState<{
  //   left?: string | number;
  //   right?: string | number;
  //   top?: string | number;
  //   bottom?: string | number;
  // }>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const debouncedMentionValue = useDebounce(mentionValue, 1000);

  const makeTriggerRegex = (): RegExp => {
    const spaceInQuery = allowSpaceInQuery ? "" : "\\s";
    return new RegExp(
      `(?:^|\\s)(${triggerOn}([^${spaceInQuery}${triggerOn}]*))$`
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const userInput = e.target.value;
    if (!userInput?.length && selectedMentions?.length) setMentions?.([]);
    setValue(userInput);
    const mentionRegex = makeTriggerRegex();
    const matches = userInput.match(mentionRegex);

    if (matches) {
      let startIndex = userInput.lastIndexOf(triggerOn);
      let searchKeyword = userInput?.slice(startIndex + 1);
      setMentionValue(searchKeyword);
      setShouldTrigger(true);
      setSelectedIndex(0);
    } else {
      setSuggetions?.([]);
      setShouldTrigger(false);
    }
  };

  const handleSelection = (value: any) => {
    setValue((prevState) => {
      const triggerIndex = prevState?.lastIndexOf(triggerOn);
      let prefix = `${triggerOn}${value?.[dataOptions?.accessKey as string]}`;
      const newValue =
        prevState.slice(0, triggerIndex) +
        prefix +
        prevState.slice(triggerIndex + 1 + mentionValue.length);

      return `${newValue} `;
    });

    setMentionValue("");
    setShouldTrigger(false);
    onSelect?.(value);
    inputRef?.current?.focus();
  };

  const handleRemoveMention = (e: React.MouseEvent, value: any) => {
    e.stopPropagation();
    e.preventDefault();
    let prefix = `${triggerOn}${value?.[dataOptions?.accessKey as string]}`;
    setValue((preState) => removeSubstring(preState, prefix));
    onRemoveMention?.(value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!shouldTrigger || !suggetions?.length) return;
    let index = selectedIndex;
    switch (event.key) {
      case "Escape": {
        setSuggetions?.([]);
        break;
      }
      case "Backspace": {
        if (!mentionValue?.length) break;
        let user = selectedMentions?.find((m) =>
            m?.[dataOptions?.accessKey as string]?.includes(mentionValue)
          ),
          searchPlaceholder = `${
            user?.[dataOptions?.accessKey as keyof typeof user]
          }`;
        setValue((preState) => removeSubstring(preState, searchPlaceholder));
        onRemoveMention?.(user);
      }
      case "ArrowUp": {
        if (index === 0) {
          index = suggetions?.length - 1;
          break;
        }
        index -= 1;
        break;
      }
      case "ArrowDown": {
        if (index >= suggetions?.length - 1) {
          index = 0;
          break;
        } else {
          index += 1;
          break;
        }
      }
      case "Enter": {
        event?.preventDefault();
        let isAlreadySelected = selectedMentions?.some(
          (m) =>
            m?.[dataOptions?.primaryKey as string] ===
            suggetions[index]?.[dataOptions?.primaryKey as string]
        );
        if (isAlreadySelected) break;
        handleSelection(suggetions[index]);
        break;
      }
      default:
        break;
    }
    let element = document?.getElementById(
      `${dataOptions?.primaryKey}_${suggetions[index]?._id}`
    );
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setSelectedIndex(index);
  };

  const infiniteScrollCallback = async () =>
    infiniteScrollProps?.callBack?.(mentionValue);

  const SuggestionTemplate = ({
    item,
    index,
  }: {
    item: any;
    index?: number;
  }): React.ReactElement => {
    let isSelected = selectedMentions?.some(
      (mention: any) =>
        mention?.[dataOptions?.primaryKey as keyof typeof mention] ===
        item?.[dataOptions?.primaryKey as keyof typeof item]
    );
    return (
      <div
        onClick={() => !isSelected && handleSelection(item)}
        className={`flex rounded-md gap-2 items-center p-1 px-2 ${
          isSelected
            ? "bg-white/30"
            : selectedIndex === index
            ? "bg-[#0F366D]"
            : "bg-white/10"
        }`}
        id={`${dataOptions?.primaryKey}_${item?._id}`}
      >
        <span className="flex overflow-hidden w-7 h-7 justify-center items-center text-primary rounded-full bg-white">
          {item?.[dataOptions?.imageKey as keyof typeof item] ? (
            <Image
              src={getStaticImageUrl(item?.[dataOptions?.imageKey as string])}
              alt="user_profile_img"
              width={100}
              height={100}
            />
          ) : (
            <FontAwesomeIcon icon={faUserAlt} />
          )}
        </span>
        <span className="flex-col flex text-sm flex-1">
          {Array.isArray(dataOptions?.label)
            ? dataOptions?.label?.map((label: string) => `${item?.[label]} `)
            : item?.[dataOptions?.label as string]}
          <span className="text-primary text-xs">
            {triggerOn}
            {hightlightOnSearch
              ? boldOnSearch(
                  item?.[dataOptions?.accessKey as keyof typeof item],
                  mentionValue
                )
              : item?.[dataOptions?.accessKey as keyof typeof item]}
          </span>
        </span>
        {isSelected && onRemoveMention && (
          <FontAwesomeIcon
            icon={faXmarkCircle}
            className="text-primary opacity-100 cursor-pointer animate-scale-in text-sm"
            onClick={(e) => handleRemoveMention(e, item)}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!shouldTrigger) return;
    triggerCallback(mentionValue);
  }, [debouncedMentionValue, shouldTrigger]);

  return (
    <React.Fragment>
      <div className="relative">
        <TextArea
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown as any}
          ref={inputRef}
          {...textAreaProps}
        />
        {shouldTrigger && suggetions?.length > 0 && (
          <div
            style={{
              top: "100%",
              position: "absolute",
            }}
            className="z-50"
          >
            {useInfiniteScroll && infiniteScrollProps ? (
              <InfiniteScroll
                {...infiniteScrollProps}
                callBack={infiniteScrollCallback}
              >
                {suggetions.map((item, index) => (
                  <SuggestionTemplate
                    item={item}
                    index={index}
                    key={item?.[dataOptions?.primaryKey as keyof typeof item]}
                  />
                ))}
              </InfiniteScroll>
            ) : (
              <div className="flex flex-auto gap-2 flex-col text-white">
                {suggetions.map((item, index) => (
                  <SuggestionTemplate
                    item={item}
                    index={index}
                    key={item?.[dataOptions?.primaryKey as keyof typeof item]}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default MentionInput;
