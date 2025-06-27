import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        newParams.set("sortBy", sortValue);
        setSearchParams(newParams);
    };

    return (
        <div className='mb-4 flex justify-end'>
            <select className="border p-2 rounded-md focus:outline-none" id="sort" value={searchParams.get("sortBy") || ""} onChange={handleSortChange}>
                <option value="">Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
            </select>
        </div>
    );
}

export default SortOptions