const Paginate = ({page, pages, setPage, pagStyle}) => {

    let pagination;
    const recordsNo = 5 
    if(pages<=recordsNo){
        pagination = [...Array(pages)].map((el, index)=>{
            return <button onClick={()=>setPage(index+1)} key={index+1} disabled={page===index+1}>{index+1}</button>
        })
    }else{
        const startValue = Math.floor((page-1)/recordsNo)*recordsNo;
        pagination =(
            <>
                {[...Array(recordsNo)].map((el, index)=>{
            return <button onClick={()=>setPage(startValue+index+1)} key={startValue+index+1} disabled={page===startValue+index+1}>{startValue+index+1}</button>
            })}

            <button>...</button>
            <button onClick={()=>setPage(pages)}>{pages}</button>
            </>
        )

        if(page>recordsNo){
            if(pages-page>=recordsNo){
                pagination =(
                    <>
                    <button onClick={()=>setPage(1)}>{1}</button>
                    <button>...</button>
                    <button onClick={()=>setPage(startValue)}>{startValue}</button>
                        {[...Array(recordsNo)].map((el, index)=>{
                    return <button onClick={()=>setPage(startValue+index+1)} key={startValue+index+1} disabled={page===startValue+index+1}>{startValue+index+1}</button>
                    })}
        
                    <button>...</button>
                    <button onClick={()=>setPage(pages)}>{pages}</button>
                    </>
                )
            } else{
                let leftAmount = pages-page+recordsNo
                pagination =(
                    <>
                    <button onClick={()=>setPage(1)}>{1}</button>
                    <button>...</button>
                    <button onClick={()=>setPage(startValue)}>{startValue}</button>
                        {[...Array(leftAmount)].map((el, index)=>{
                    return <button 
                            style={pages < startValue+index+1?{display:'none'}:null} 
                            onClick={()=>setPage(startValue+index+1)} 
                            key={startValue+index+1} disabled={page===startValue+index+1}>{startValue+index+1}
                            </button>
                    })}
                    </>
                )
            }
        }
    }

    return ( 
        
        <div className={`paginate ${pagStyle}`}>
            <button disabled={page===1} onClick={()=>setPage(page => page-1)} className='prev'>&#171;</button>
            {pagination}
            <button disabled={page===pages} onClick={()=>setPage(page => page+1)} className='next'>&#187;</button> 
            {/*<button onClick={()=>{setChecks('&shiftName=B1')}}>x</button>*/}               
        </div>
        
     );
}
 
export default Paginate;