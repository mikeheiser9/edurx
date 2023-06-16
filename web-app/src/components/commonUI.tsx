interface propsType {
  type: string;
  title: string;
  button?: string;
  clickHandle?: (a: string) => void;
  fields: JSX.Element;
}
export default function CommonUI(props: propsType): React.JSX.Element {
  const { type, title, button, clickHandle, fields } = props;
  return (
    <div className="flex justify-center bg-[#20201E] lg:w-1/4 rounded-2xl overflow-hidden">
      <div className="w-full flex flex-col">
        <div className="flex justify-center p-4 bg-primary">
          <label className="text-xl">{type}</label>
        </div>
        <div className="flex flex-col text-white items-center p-4 gap-2">
          <h1 className="text-white text-center tracking-wider text-4xl my-4 font-serif font-semibold">
            {title}
          </h1>
          <label className="opacity-60">Please make a selection</label>
        </div>
        {fields}
        {button}
      </div>
    </div>
  );
}
