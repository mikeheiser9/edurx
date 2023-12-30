import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";

interface TabItem {
  label: string;
  component: () => React.ReactElement;
  icon?: IconProp;
  isDisabled?: boolean;
}

interface Props {
  options: TabItem[];
  defaultActiveTab?: number;
  tabItemClass?: string;
  tabContainerClass?: string;
  activeTabClass?: string;
  componentWrapperClass?: string;
  iconClass?: string;
  formikFieldName?: string;
}

export const TabMenu = (props: Props): React.ReactElement => {
  const initialValues = useFormikContext?.()?.values;
  const { setFieldValue } = props.formikFieldName
    ? useFormikContext()
    : {
        setFieldValue: (value: string) => null,
      };
  const [activeTab, setActiveTab] = useState<number>(0);
  
  useEffect(() => {
    if ((initialValues as any)?.postType == "poll") {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [(initialValues as any)?.postType]);
  const handleTabClick = (index: number) => {
    if (!props.options[index].isDisabled) {
      setActiveTab(index);
      const selectedTabName = props.options[index].label;
      props.formikFieldName &&
        setFieldValue(props.formikFieldName, selectedTabName?.toLowerCase());
    }
  };

  return (
    <React.Fragment>
      <div className={props.tabContainerClass || "flex md:gap-4 gap-2"}>
        {props.options.map((tabItem, index) => (
          <div
            onClick={() => handleTabClick(index)}
            role="presentation"
            className={`${
              props.tabItemClass ||
              "p-1 px-3 border border-eduBlack ease-in-out duration-200 md:text-[14px] text-[9px] font-body rounded capitalize cursor-pointer text-eduLightBlue"
            } ${
              index === activeTab && !tabItem.isDisabled
                ? props.activeTabClass || "bg-eduLightBlue text-white"
                : "opacity-100"
            } ${
              tabItem.isDisabled ? "cursor-not-allowed" : "hover:opacity-100"
            }`}
            key={index}
          >
            {tabItem.icon && (
              <>
                <FontAwesomeIcon
                  className={props.iconClass}
                  icon={tabItem.icon}
                />
                &nbsp;
              </>
            )}
            {tabItem.label}
          </div>
        ))}
      </div>
      <div className={props.componentWrapperClass || ""}>
        {props.options[activeTab].component()}
      </div>
    </React.Fragment>
  );
};
