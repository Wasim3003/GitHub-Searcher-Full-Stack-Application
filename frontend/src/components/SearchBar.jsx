import { useCallback } from "react";
import debounce from "lodash/debounce";

const SearchBar = ({ onSearch, value }) => {
  const debouncedSearch = useCallback(
    debounce((val) => {
      onSearch(val);
    }, 500),
    []
  );

  const handleChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <input
      className="search-input"
      placeholder="Search GitHub..."
      defaultValue={value}
      onChange={handleChange}
    />
  );
};

export default SearchBar;
