import {CSS} from '@dnd-kit/utilities';
import {useSortable} from "@dnd-kit/sortable";
import {useEffect} from "react";

interface TableItemProps {
    id: number;
    fullName: string;
    handleCheckBox: (position: number) => void,
    isChecked: boolean
}

const TableRow = ({id, fullName, handleCheckBox, isChecked}: TableItemProps) => {
    useEffect(() => {
        console.log("changing checked",isChecked);
    }, [isChecked]);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center cursor-grab bg-white p-4 border rounded shadow-sm max-[1024px]:gap-[5px]"
        >
            <div className="basis-[5%] relative z-50">
                <input
                    name={fullName}
                    value={fullName}
                    checked={isChecked}
                    onChange={() => handleCheckBox(id)}
                    className={"p-[10px] cursor-pointer"} type="checkbox"/>
            </div>
            {/*<p className={"text-[20px] mr-[10px]"}>{id}</p>*/}
            <p className={"text-[20px]"}>{fullName}</p>
        </div>
    );
};

export default TableRow;