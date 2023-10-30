import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useField } from "formik";

interface SwitchProp {
  label: string;
  icon: IconProp;
}

interface Props {
  on: SwitchProp;
  off: SwitchProp;
  name: string;
}

export const ToggleSwitch = ({ on, off, name }: Props) => {
  const [field] = useField(name);

  return (
    <label
      className={`flex rounded-full focus:outline-none border-2 border-eduYellow focus:ring-offset-black bg-transparent items-center p-[.125rem] cursor-pointer ${
        field.value ? "flex-row-reverse !bg-eduLightBlue" : "flex-row"
      }`}
      htmlFor={name}
    >
      <input id={name} type="checkbox" className="appearance-none" {...field} />
      <span className="rounded-full flex-auto flex justify-center items-center bg-eduDarkBlue w-5 h-5 text-white">
        <FontAwesomeIcon
          icon={field.value ? on.icon : off.icon}
          className={`shadow-sm text-eduDarkBlue ${
            field.value ? "animate-fade-in-down" : "animate-scale-in"
          }`}
          size="xs"
        />
      </span>
      <span className={field.value ? "font-medium mx-2 flex-1 text-xs capitalize text-white" : "text-eduDarkBlue font-medium mx-2 flex-1 text-xs capitalize"}>
        {field.value ? on.label : off.label}
      </span>
    </label>
  );
};
