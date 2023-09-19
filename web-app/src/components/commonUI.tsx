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
    <div className="flex justify-center bg-white lg:w-1/4 rounded-2xl overflow-hidden">
      <div className="w-full flex flex-col">
        <div className="flex justify-center p-4 bg-eduDarkGray">
          <label className="text-xl font-body">{type}</label>
        </div>
        <div className="flex flex-col text-white items-center p-4 gap-2">
          <h1 className="text-eduBlack text-center text-4xl my-4 font-semibold font-headers">
            {title}
          </h1>
        </div>
        {fields}
        {button}
      </div>
    </div>
  );
}
