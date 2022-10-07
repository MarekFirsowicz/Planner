import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import DataList from './DataList';
import Paginate from './Paginate';
import SearchBar from './Search';

const HR = () => {
    
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const[filter, setFilters] = useState('')
    const [sorter, setSorter] = useState('All')
    const [searcher, setSearcher] = useState('')
    //useFetch(`/employees/tester/tester?page=${page}&limit=20&sorter=${sorter}&searcher=${searcher}&employeer=FTE&`+filter+check)

    const {data, loading, error} = useFetch(`/employees/?page=${page}&limit=20&sorter=${sorter}&searcher=${searcher}&employeer=FTE&`+filter)

    

    /*
    const dt =()=>{
        let checks
        for (const [key, value] of Object.entries(check)) {
            checks+=(`&${key}=${value}`);
          }
        return checks          

    }*/

    
   
    useEffect(()=>{
        data&&setPages(data.pagination.pages)
    },[data])
    useEffect(()=>{
        setPage(1)
    },[filter])    
    
    return ( 
        <div className="wrapper">
            {error && <div>{error}</div>}
            {loading && <div>Loading...</div>}
            {data&&<SearchBar searcher={searcher}  setSearcher={setSearcher}/>}
            {pages>1&&<Paginate page={page} pages={pages} setPage={setPage}/>}
            
            {data&&<DataList sorter={sorter} setSorter={setSorter} filter={filter} setFilters={setFilters} data={data}/>}
            {pages>1&&<Paginate pagStyle={'bottomPag'} page={page} pages={pages} setPage={setPage}/>}
        </div>
     );
}
 
export default HR;