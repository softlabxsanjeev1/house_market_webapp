import React from 'react'
import { Link } from "react-router-dom"
import { FaBed } from 'react-icons/fa'
import { MdOutlineBathroom } from 'react-icons/md'


const ListingItem = ({ listing, id, onDelete , onEdit}) => {
    return (
        <>
            <div className='d-flex mt-4' style={{ alignItems: "center", justifyContent: "center" }}>
                <div className='card category-link' style={{ width: "800px", height: "250px" }}>
                    <Link to={`/category/${listing.type}/${id}`}>
                        <div className='row container p-2'>
                            <div className='col-md-5'>
                                <img src={listing.imageUrls[0]}
                                    className='img-thumbnail'
                                    alt={listing.name}
                                    height={200}
                                    width={300}
                                />
                            </div>
                            <div className='col-md-5'>
                                <p>{listing.location}</p>
                                <h2>{listing.name}</h2>
                                <p>
                                    Rs :{" "}
                                    {listing.offer
                                        ? listing.discountedPrice
                                        : listing.regularPrice}{" "}
                                    {listing.type === "rent" && "/ Month"}
                                </p>
                                <p>
                                    <FaBed />&nbsp;
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} Bedrooms`
                                        : "1 Bedroom"
                                    }
                                </p>
                                <p>
                                    <MdOutlineBathroom />&nbsp;
                                    {listing.bedrooms > 1
                                        ? `${listing.bathrooms} Bathrooms`
                                        : "1 Bathrooms"
                                    }
                                </p>                                
                            </div>
                        </div>
                    </Link>
                    <div className='d-flex'>
                        <div>
                            {onDelete && (
                                <button className='btn btn-danger'
                                    onClick={() => { onDelete(listing.id, listing.name) }}>
                                    Delete Listing
                                </button>
                            )}
                        </div>
                        <div>
                            {onEdit && (
                                <button className='btn btn-info ms-3'
                                    onClick={() => { onEdit(listing.id, listing.name) }}>
                                    Edit Listing
                                </button>
                            )}
                        </div>

                    </div>                   
                </div>
            </div>
        </>
    )
}

export default ListingItem