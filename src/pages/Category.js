import React from 'react'
import Layout from '../components/layout/Layout'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.config'
// import { toast } from 'react-hot-toast'
import { collection, getDoc, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore'
import Spinner from '../components/Spinner'
import ListingItem from '../components/layout/ListingItem'

const Category = () => {
    const [listing, setListing] = useState('')
    const [lastFetchListing,setLastFetchListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams()

    // fetch listing
    useEffect(() => {
        const fetchListing = async () => {
            try {
                //reference
                const listingsRef = collection(db, 'listings')
                //query 
                const q = query(
                    listingsRef,
                    where("type", "==", params.categoryName),
                    orderBy("timestamp", "desc"),
                    limit(1)
                );
                //execute query
                const querySnap = await getDocs(q);
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchListing(lastVisible)
                const listings = [];
                querySnap.forEach((doc) => {
                    // console.log(doc.data());
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                });

                setListing(listings);
                setLoading(false);
            } catch (error) {
                // toast.error("Unable to fetch data")
                alert("Unable to fetch data")
            }
        };
        // fun call 
        fetchListing();
    }, [params.categoryName]);

    // loadmore pagination fun
    const fetchLoadMoreListing= async () => {
        try {
            //reference
            const listingsRef = collection(db, 'listings')
            //query 
            const q = query(
                listingsRef,
                where("type", "==", params.categoryName),
                orderBy("timestamp", "desc"),
                startAfter(lastFetchListing),
                limit(1)
            );
            //execute query
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchListing(lastVisible)
            const listings = [];
            querySnap.forEach((doc) => {
                // console.log(doc.data());
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListing((prevState) => [...prevState, ...listings]);
            setLoading(false);
        } catch (error) {
            // toast.error("Unable to fetch data")
            alert("Unable to fetch data")
        }
    };

    return (
        <Layout>
            <div className='mt-3 container-fluid'>
                <h1>
                    {params.categoryName === 'rent' ? "Places for Rent" : "Places for Sale"}
                </h1>
                {loading ? (
                    <Spinner />
                ) : listing && listing.length > 0 ? (
                    <>
                        <div>
                            {listing.map((list) => (
                                <ListingItem listing={list.data}
                                    id={list.id}
                                    key={list.id} />
                            ))}
                        </div>
                    </>
                ) : (
                    <p>No Listing For {params.categoryName}</p>
                )}
            </div>
            <div className='d-flex mt-4 mb-4' style={{justifyContent:"center"}}>
                {lastFetchListing && (
                    <button
                    className='btn btn-primary text-centre'
                    onClick={fetchLoadMoreListing}
                    >Load more</button>
                )}
            </div>
        </Layout>
    )
}

export default Category