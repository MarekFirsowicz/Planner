import { useEffect, useState } from "react"
import axios from "axios"


const useFetch = (url) =>{
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        const controller = new AbortController()
        const fetchData = async ()=>{
            setLoading(true)
            try {
                const res = await axios.get(url)
                const data = await res.data
                setData(data)
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("the fetch was aborted")
                  } else {
                    setLoading(false)
                    setError('Could not fetch the data')
                  }
            }
            setLoading(false)
        }
        fetchData()
        return () => {
            controller.abort()
          }
    },[url])
    
    const refetchData = async ()=>{
        setLoading(true)
        try {
            const res = await axios.get(url)
            setData(res.data)
        } catch (err) {
            setError(err)
        }
        setLoading(false)
    }    
    return {data, loading, error, refetchData}
}

export default useFetch