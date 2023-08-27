import React from 'react'
import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { getAuth } from 'firebase/auth'
import { useNavigate, Link, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'

import SwipeCore, { EffectCoverflow, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

// configure
SwipeCore.use([EffectCoverflow, Pagination])

const Listing = () => {
    const [listing, setListing] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data());
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    if (loading) {
        return <Spinner />
    }
    return (
        <Layout>
            <div className='container mt-4 d-flex' style={{ justifyContent: "center" }}>
                <div class="card mb-2" style={{ width: "600px" }}>
                    <div className='card-header'>
                        {listing.imageUrls === undefined ? (
                            <Spinner />
                        ) : (
                            <Swiper
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={1}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true
                                }}
                                pagination={true}
                                className="mySwipe"
                            >
                                {listing.imageUrls.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={listing.imageUrls[index]}
                                            height={400}
                                            width={800}
                                            alt={listing.name}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                    <div class="card-body">
                        <h3>{listing.name}</h3>
                        <h6>
                            Price :{" "}
                            {listing.offer ? listing.discountedPrice : listing.regularPrice} / Rs
                        </h6>
                        <p>Property For : {listing.type === "rent" ? "Rent" : "Sale"}</p>
                        <p>
                            {listing.offer && (
                                <span>
                                    {listing.regularPrice - listing.discountedPrice} Discount
                                </span>
                            )}
                        </p>
                        <p>
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"
                            }

                        </p>
                        <p>
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"
                            }
                        </p>
                        <p>{listing.parking ? 'Parking spot' : "no spot for parking"}</p>
                        <p>{listing.furnished ? 'furnished house' : "not furnished"}</p>
                        <Link className='btn btn-success'
                            to={`/contact/${listing.useRef}?listingName=${listing.name}`}>
                            Contact Landlord
                        </Link>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Listing