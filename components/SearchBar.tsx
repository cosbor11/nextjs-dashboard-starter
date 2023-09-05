import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar: React.FC<{ className?: string; textClassName?: string }> = ({ className = "", textClassName = "" }) => {
    return (
        <form className={`relative flex p-1.5 flex-1 ${className}`} action="#" method="GET">
            <label className={`sr-only ${textClassName}`} htmlFor="search-field">
                Search
            </label>
            <MagnifyingGlassIcon
                className={`pointer-events-none absolute inset-y-0 left-3 h-full w-5 ${textClassName}`}
                aria-hidden="true" />
            <input
                id="search-field"
                className={`block bg-transparent h-full w-full rounded-full border-none focus:border-1 py-0 pl-8 pr-0 focus:ring-1 focus:ring-gray-700 sm:text-sm ${textClassName} `}
                placeholder="Search..."
                type="search"
                name="search" />
        </form>
    );
}

export default SearchBar;
