import Header from "./components/Header";
import Table from "./components/Table";
import React, {useEffect, useState} from "react";
import api from "./api.ts";
import type {UserDto} from "./types";
import debounce from "lodash.debounce"

function App() {
    const [inputValue, setInputValue] = useState<string>("");
    const [searchVal, setSearchVal] = useState<string>("");

    const [users, setUsers] = useState<UserDto[]>([]);
    const [markedUsers, setMarkedUsers] = useState<number[]>([]);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    }
    const [sort, setSort] = useState<Record<string, string>>({})
    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === "") {
            setSort({})
        } else {
            setSort({
                fullName: event.target.value
            });
        }
    }
    const debouncedSearch = debounce((value: string) => {
        setSearchVal(value);
    }, 500);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

    const handleOrderChange = (users: UserDto[]) => {
        api.changeOrder(users)
    }


    useEffect(() => {
        api.getSortsAndMarked()
            .then(data => {
                setSort(data.sort);
                setMarkedUsers(data.marked);

                api.getUsers({
                    query: "",
                    sort: data.sort,
                    page: page,
                }).then(data => {
                    setUsers(data.results);
                    setLoaded(true);
                })

            })
    }, []);

    useEffect(() => {
        if (loaded) {
            api.markUsers(markedUsers)
        }
    }, [markedUsers]);

    useEffect(() => {

        if (loaded) {
            console.log("load users")
            api.getUsers({
                query: searchVal,
                page,
                sort: sort
            }).then(data => {
                setUsers(data.results);
            })
        }
    }, [searchVal, sort]);

    useEffect(() => {
        if (loaded) {
            console.log("load users")
            api.getUsers({
                query: searchVal,
                page,
                sort: sort
            }).then(data => {
                setUsers(prevState => [...prevState, ...data.results]);
            })
        }
    }, [page]);

    return (
        <>
            <Header/>

            <section className={"p-[30px] h-[100%]"}>
                <div className="mx-auto rounded-[10px] bg-white shadow-md p-[20px]">
                    <div className="w-full flex justify-between">

                        <div className="basis-[65%] flex items-center gap-[4px]">
                            <input value={inputValue} onChange={handleInputChange} type="text"
                                   className={"transform delay-125 focus:outline-gray-300 outline-1 outline-gray-400 rounded-[5px] p-[5px] grow-1"}/>
                            <button
                                className={"rounded-[5px] delay-125 bg-blue-400 py-[5px] px-[15px] text-white cursor-pointer hover:opacity-95"}>Поиск
                            </button>
                        </div>


                        <div className="flex gap-2 items-center border-1 border-gray-300 px-[20px] rounded-[5px]">
                            <span>Сортировка по имени</span>
                            <select value={sort.fullName} onChange={handleSort} name="fullname">
                                <option value="">-- Выбрать--</option>
                                <option value="asc">А-Я</option>
                                <option value="desc">Я-А</option>
                            </select>
                        </div>

                    </div>

                    <Table
                        handleOrderChange={handleOrderChange}
                        handleLoadMore={handleLoadMore}
                        users={users}
                        setUsers={setUsers}
                        markedUsers={markedUsers}
                        setMarkedUsers={setMarkedUsers}
                    />


                </div>
            </section>
        </>

    )
}

export default App
