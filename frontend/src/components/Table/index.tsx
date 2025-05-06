import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor, TouchSensor
} from '@dnd-kit/core';
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import TableRow from "../TableRow";
import React, {useCallback, useEffect, useRef} from "react";
import type {UserDto} from "../../types";


interface TableProps {
    users:UserDto[],
    setUsers:React.Dispatch<React.SetStateAction<UserDto[]>>,
    markedUsers:number[],
    setMarkedUsers: React.Dispatch<React.SetStateAction<number[]>>,
    handleLoadMore:()=>void
}

const Table = ({markedUsers,setMarkedUsers,users,setUsers,handleLoadMore}:TableProps) => {

    const loadMore = useCallback(handleLoadMore,[])

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 6,
            },
        }),
    );

    const handleDragEnd = (event: any) => {
        const {active, over} = event;

        if (active.id !== over.id) {
            setUsers((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleCheckBox = (id: number) => {
        const hasMarked = markedUsers.find(el => el == id);
        if (hasMarked) {
            setMarkedUsers(prevState => prevState.filter(obj => obj !== id))
        } else {
            setMarkedUsers(prevState => [...prevState, id]);
        }
    }


    const lastItemRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            }
        );

        const currentElement = lastItemRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [users,loadMore]);


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={users.map(item => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div  className="table-items my-[30px] w-full flex flex-col gap-[10px]">
                    {users.map((item,index) => (
                        <React.Fragment key={item.id}>
                            <TableRow
                                isChecked={Boolean(markedUsers.find(el => el === item.id))}
                                handleCheckBox={handleCheckBox}
                                id={item.id}
                                fullName={item.fullName}
                            />
                            {/* Если это последний элемент — привязываем ref */}
                            {index === users.length - 1 && <div ref={lastItemRef} />}
                        </React.Fragment>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default Table;