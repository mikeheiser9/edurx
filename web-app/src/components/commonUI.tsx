interface propsType{
    type:string,
    title:string,
    button?:string,
    clickHandle?:(a:string)=>void,
    fields:JSX.Element
}
export default function CommonUI(props:propsType){
    const {type,
        title,
        button,
        clickHandle,
        fields}=props
    return (
        <div className="flex justify-center ">
            <div>
            <div>
                    <label className="text-lg">{type}</label>
            </div>
            <div>
            <label className="text-xl">{title}</label>
            </div>
            {fields}
            {button}
            </div>
        </div>
    )
}