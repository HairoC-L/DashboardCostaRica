import { useState, useMemo } from "react";

export function useSearchPagination<T>(
    data: T[],
    itemsPerPage: number = 6,
    filterFn: (item: T, query: string) => boolean
) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((item) => filterFn(item, searchQuery));
    }, [data, searchQuery, filterFn]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    };

    return {
        searchQuery,
        setSearchQuery: handleSearch,
        currentPage,
        totalPages,
        currentItems,
        goToPage,
        nextPage,
        prevPage,
        totalItems: filteredData.length,
    };
}
