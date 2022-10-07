const SearchBar = ({searcher, setSearcher}) => {
    return ( 
        <div className="searcher">
            <div className="searchDiv">
                <input 
                    value = {searcher}
                    type='text'
                    placeholder="search surname"
                    onChange={(e)=>setSearcher(e.target.value)}
                    
                />
                <button onClick={()=>setSearcher('')}><i className="fa-solid fa-xmark"></i></button>
            </div>
        </div>
     );
}
 
export default SearchBar;