interface propsType {
  type: string;
  title: string;
  button?: string;
  clickHandle?: (a: string) => void;
  fields: JSX.Element;
}
export default function CommonUI(props: propsType) {
  const { type, title, button, clickHandle, fields } = props;
  return (
    <div className="flex justify-center bg-black lg:w-1/3 rounded-2xl overflow-hidden">
      <div className="w-full flex flex-col">
        <div className="flex justify-center p-4 bg-[#FDCD26]">
          <label className="text-xl">{type}</label> 
        </div>
        <div className="flex flex-col text-white items-center p-4 gap-2">
          <label className="text-3xl">{title}</label>
          <label className="opacity-60">Please make a selection</label>
        </div>
        {fields}
        {button}
      </div>
    </div>
  );
}
