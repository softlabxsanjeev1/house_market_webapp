import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { getDoc, doc } from 'firebase/firestore'
import { db } from "../firebase.config"
import { useParams, useSearchParams } from 'react-router-dom'
// import { toast } from "react-toastify"

const Contact = () => {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()
    const params = useParams()

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, "users", params.landlordId);
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                alert("Unable to fetch data")
                // toast.error("Unable to fetch data");
            }
        };
        getLandlord();
    }, [params.landlordId])
    return (
        <Layout>
            <div className='container d-flex flex-column mb-4 mt-4' style={{ width: "400px" }}>
                <h3 className='mb-4'>Contact Details</h3>
                {
                    landlord !== '' && (
                        <main>
                            <h4>Person Name :  {landlord?.name}</h4>
                            
                                <div className='form-floating'>
                                    <textarea
                                        className='form-control'
                                        placeholder='Leave a comment here'
                                        value={message}
                                        id='message'
                                        onChange={(e) => { setMessage(e.target.value) }}
                                    />
                                    <label htmlFor='floatingTextarea'>your message</label>
                                </div>
                                <a
                                    href={`mailto:${landlord.email}?Subject=${searchParams.get(
                                        "listingName"
                                    )}&body=${message}`}>
                                    <button className='btn btn-primary mt-2'>Send Message</button>
                                </a>
                           
                        </main>
                    )}
            </div>
        </Layout>
    )
}

export default Contact