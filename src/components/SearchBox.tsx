import { cn } from '@/utils/cn';
import React from 'react';

import { MdSearch } from "react-icons/md";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
    return (
        <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10", props.className)}>
            <input type="text" placeholder="Enter location..."
                className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 transition-all duration-200 h-full"
                value={props.value} onChange={props.onChange}
            />
            <button  className="px-4 py-2 bg-blue-500 rounded-r-md focus:outline-none h-full hover:bg-blue-600">
                <MdSearch />
            </button>
        </form>
    );
}