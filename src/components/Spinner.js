import React from 'react'
import { useState, useEffect } from 'react'

const Spinner = () => {
    const [count, setCount] = useState(3)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);
      return () => clearInterval(interval)
    }, [count])
    return (
        <div>
            <div class=" d-flex flex-col "
                style={{ height: "100vh" }}>
                <h1 className='text-centre' style={{ textAlign: "center" }}>
                    redirecting to you in {count} second
                </h1>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Spinner