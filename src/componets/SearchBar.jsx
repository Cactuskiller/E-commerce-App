
import { FiSearch, FiMic } from "react-icons/fi";
const SearchBar = () => (
  <div className="bg-white rounded-xl flex items-center px-5 py-2 shadow mt-4 w-[90%] mx-auto">
    <FiSearch className="w-5 h-5 text-gray-400 mr-2" />
    <input type="text" placeholder="Search any Product.." className="flex-1 bg-transparent outline-none text-gray-500 placeholder-gray-400" />
    <FiMic className="w-4 h-4 text-gray-400 ml-2" />
  </div>
);
export default SearchBar;