import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile } from "firebase/auth"
import Layout from '../layout/Layout'
// import { toast } from 'react-hot-toast'
import { db } from '../../firebase.config'
import { BiEdit } from 'react-icons/bi'
import { MdDoneAll } from 'react-icons/md'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { BsArrowRightSquareFill } from 'react-icons/bs'
import ListingItem from './ListingItem'


const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [listings, setlistings] = useState(null)

    //useEffect for getting data
    useEffect(() => {
        const fetchUserListings = async () => {
            const listingRef = collection(db, 'listings')
            const q = query(listingRef, where('useRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setlistings(listings)
            setLoading(false)
            console.log(listings)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const { name, email } = formData;

    const logoutHandler = () => {
        auth.signOut();
        // toast.success("Successfully Logout")
        navigate("/")
    };

    // submit handler
    const onSubmit = async () => {
        try {
            if (auth.currentUser.display !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, { name });
                // toast.success("User Updated !");
            }
        } catch (error) {
            console.log(error);
            // toast.success("User Updated!")
        }
    }

    //onchange
    const onChangeHandler = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    //delete handler
    const onDelete = async (listingId) => {
        if (window.confirm('Are You Sure ! want to delete ?')) {
            await deleteDoc(doc, (db, 'listings', listingId))
            const updatedListings = listings.filter(
            (listing) => listing.id !== listingId
            );
            setlistings(updatedListings);
            alert("Listing deleted successfully");
        }
    };

    //edit handler
    const onEdit = (listingId) => {
        navigate(`/editlisting/${listingId}`)
    }
    return (
        <Layout>
            <div class='conatiner mt-4 w-150 d-flex justify-content-between'>
                <h4>Profile Details</h4>
                <button className='btn btn-danger' onClick={logoutHandler}>Logout</button>
            </div>

            <div className="card container mt-4" style={{ width: "400px" }}>
                <div className='card-header'>
                    <div className='d-flex justify-content-between'>
                        <p>User Personal Details</p>
                        <span style={{ cursor: "pointer" }}
                            onClick={() => {
                                changeDetails && onSubmit();
                                setChangeDetails(prevState => !prevState)
                            }}
                        >
                            {changeDetails ? <MdDoneAll color='green' /> : <BiEdit color='red' />}
                        </span>
                    </div>
                </div>
                {/* form section  */}
                <div className="card-body">
                    <form>
                        <div class="form-group">
                            <label for="">Name</label>
                            <input type="text" class="form-control" id="name"
                                placeholder="name"
                                value={name}
                                onChange={onChangeHandler}
                                disabled={!changeDetails}
                            />
                        </div>
                        <div class="form-group">
                            <label for="">Email address</label>
                            <input type="email" class="form-control"
                                id="email" aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={email}
                                onChange={onChangeHandler}
                                disabled={!changeDetails}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <div class='conatiner mt-4 w-150 d-flex ' style={{ justifyContent: "center" }}>
                <Link to='/create-listing'><BsArrowRightSquareFill />&nbsp;Sell or Rent your house</Link>
            </div>
            <div className='container'>
                {listings && listings?.length > 0 && (
                    <>
                        <h6>Your Listings</h6>
                        <div>
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    onEdit={() => onEdit(listing.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Profile