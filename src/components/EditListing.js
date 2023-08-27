import React, { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Layout from '../components/layout/Layout'
import Spinner from '../components/Spinner'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { addDoc, collection, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore'

const EditListing = () => {
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(null)
    const params = useParams()
    const [geoLocationEnable, setGeoLocationEnable] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    });

    // destructure form data
    const
        { type, name, bedrooms, bathrooms, parking, furnished,
            address, offer, regularPrice, discountedPrice, images, latitude, longitude, } = formData


    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                setFormData({
                    ...formData,
                    useRef: user.uid,
                })
            })
        } else {
            navigate('/signIn')
        }
        //eslint-disable-next-line
    }, [])

    //useEffect to check login user
    useEffect(() => {
        if (listing && listing.useRef !== auth.currentUser.uid) {
            alert("You can no tedit this listing")
            navigate('/')
        }
        //eslint-disable-next-line
    }, [])

    // useEffect -2
    useEffect(() => {
        setLoading(true)
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({ ...docSnap.data() })
                setLoading(false);
            } else {
                navigate("/");
                alert("Listing Not Exist")
            }
        };
        fetchListing();
        //eslint-disable-next-line
    }, [])

    if (loading) {
        return <Spinner />
    }

    // mutate function
    const onChangeHandler = (e) => {
        let boolean = null;
        if (e.target.value === 'true') {
            boolean = true;
        }
        if (e.target.value === 'false') {
            boolean = false;
        }
        //files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }

        // text/booleans/number
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    };

    //  form submit
    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault();
        // console.log(formData);
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            alert("Discount price should be less than Regular price")
            return
        }
        if (images > 6) {
            setLoading(false)
            alert("Max 6 image can be Selected")
            return
        }
        let geoLocation = {}
        let location;
        if (geoLocationEnable) {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDO4Mq7pjfnk5EDA5q1B42LcGZY57eUOoQ`
            );
            const data = await response.json();
            console.log(data);
        } else {
            geoLocation.lat = latitude;
            geoLocation.lng = longitude;
            // location = address;
        }

        //store images to firebase Storage
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, 'images/' + fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
                    console.log('upload is' + progress + '% done')
                    switch (snapshot.state) {
                        case 'paused':
                            // console.log('Upload is paused')
                            break
                        case 'running':
                            // console.log('Upload is running');
                            break
                            default:
                                break
                    }
                },
                    (error) => {
                        reject(error);
                    },
                    //success
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        };
        const imageUrls = await Promise.all(
            [...images]
                .map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false);
            alert("Image not Uploaded");
            return;
        })
        // console.log(imageUrls);

        // save from data
        const formDataCopy =
        {
            ...formData,
            imageUrls,
            timestamp: serverTimestamp(),
            geoLocation
        }
        formData.location = address
        delete formDataCopy.images
        delete formDataCopy.address
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy);
        alert(" Listing Updated")
        setLoading(false);
        navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    };
    return (
        <Layout>
            <div style={{ marginLeft: "30%" }}>
                {/* form------------------------- */}
                <div className='container d-flex flex-column m-4' style={{ justifyContent: "center", }}>
                    <h3 className='mt-3 w-50 bg-dark p-2 ' style={{ textAlign: "center", color: "white" }}>Update Listing &nbsp;
                        <AiOutlineFileAdd />
                    </h3>
                    {/* sell rent button */}
                    <form className='w-50 bg-light p-4' style={{ backgroundColor: "#E5E4E2" }}>
                        <div className='d-flex flex-row mt-4'>
                            <div className='form-check'>
                                <input
                                    className='form-check-input'
                                    type='radio'
                                    value="rent"
                                    onChange={onChangeHandler}
                                    defaultChecked
                                    name='type'
                                    id='type'
                                />
                                <label className='form-check-label' htmlFor='type'>
                                    Rent
                                </label>
                            </div>
                            <div className='form-check ms-3'>
                                <input
                                    className='form-check-input'
                                    type='radio'
                                    value="sale"
                                    onChange={onChangeHandler}
                                    defaultChecked
                                    name='type'
                                    id='type'
                                />
                                <label className='form-check-label' htmlFor='type'>
                                    Sale
                                </label>
                            </div>
                        </div>

                        {/* name */}
                        <div className='mt-4 mb-3'>
                            <label htmlFor='name' className='form-label'>Name</label>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                value={name}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                        {/* bedrooms */}
                        <div className='mt-4 mb-3'>
                            <label htmlFor="bedrooms" className="form-label">
                                Bedrooms
                            </label>
                            <input
                                type='number'
                                className='form-control'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                        {/* bathrooms */}
                        <div className='mt-4 mb-3'>
                            <label htmlFor="bedrooms" className="form-label">
                                Bathrooms
                            </label>
                            <input
                                type='number'
                                className='form-control'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                        {/*  parking */}
                        <div className='mb-3'>
                            <label htmlFor='parking' className='form-label'>Parking :</label>
                            <div className='d-flex flex-row'>
                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        value={true}
                                        onChange={onChangeHandler}
                                        name='parking'
                                        id='parking'
                                    />
                                    <label className='form-check-label' htmlFor='yes'>Yes</label>
                                </div>
                                <div className='form-check ms-3'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        value={false}
                                        onChange={onChangeHandler}
                                        name='parking'
                                        id='parking'
                                        defaultChecked
                                    />
                                    <label className='form-check-label' htmlFor='yes'>No</label>
                                </div>
                            </div>
                        </div>
                        {/* furnished */}
                        <div>
                            <label className='form-label' htmlFor='furnished'>Furnished : </label>
                            <div className='d-flex flex-row'>
                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        value={true}
                                        onChange={onChangeHandler}
                                        name='furnished'
                                        id='furnished'
                                    />
                                    <label className='form-check-label' htmlFor='yes'>Yes</label>
                                </div>
                                <div className='form-check ms-3'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        value={false}
                                        onChange={onChangeHandler}
                                        name='furnished'
                                        id='furnished'
                                    />
                                    <label className='form-check-label' htmlFor='no'>No</label>
                                </div>
                            </div>
                        </div>

                        {/* address */}
                        <div className='mb-3'>
                            <label htmlFor='address'>Address :</label>
                            <textarea
                                className='form-control'
                                placeholder='Enter Your Address'
                                id='address'
                                value={address}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>
                        {/*  geoLocation */}
                        {!geoLocationEnable && (
                            <div className='mb-3'>
                                <div className='d-flex flex-row'>
                                    <div className='form-check'>
                                        <label className='form-check-label' htmlFor='yes'>
                                            Latitude
                                        </label>
                                        <input
                                            className='form-control'
                                            type='number'
                                            value={latitude}
                                            onChange={onChangeHandler}
                                            name="latitude"
                                            id='latitude'
                                        />
                                    </div>
                                    <div className='form-check ms-3'>
                                        <label className='form-check-label' htmlFor='no'>
                                            Longitude
                                        </label>
                                        <input
                                            className='form-control'
                                            type='number'
                                            value={longitude}
                                            onChange={onChangeHandler}
                                            name="longitude"
                                            id='longitude'
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* offers */}
                        <div className='mb-3'>
                            <label htmlFor='offer' className='form-label'>
                                Offer :
                            </label>
                            <div className='d-flex flex-row'>
                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='radio'
                                        value={true}
                                        onChange={onChangeHandler}
                                        name='offer'
                                        id='offer'
                                    />
                                    <label className='form-check-label' htmlFor='yes'>
                                        Yes
                                    </label>
                                </div>
                                <div className='form-check mx-4'>
                                    <input
                                        className='form-check-input '
                                        type='radio'
                                        value={false}
                                        onChange={onChangeHandler}
                                        name='offer'
                                        id='offer-no'
                                    />
                                    <label className='form-check-label' htmlFor='yes'>
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* regular price */}
                        <div className='mb-3 mt-4'>
                            <label htmlFor='regularPrice' className='form-label'>
                                Regular Price :
                            </label>
                            <div className='d-flex flex-row'>
                                <input
                                    type='number'
                                    className='form-control w-50'
                                    id='regularPrice'
                                    name='regularPrice'
                                    value={regularPrice}
                                    onChange={onChangeHandler}
                                    required
                                />
                                {type === 'rent' && <p className='ms-4 mt-2'>$ / Month</p>}
                            </div>
                        </div>

                        {/* offer */}
                        {offer && (
                            <div className='mb-3 mt-4'>
                                <label htmlFor='discountedPrice' className='form-label'>
                                    Discounted Price :
                                </label>
                                <input
                                    type='number'
                                    className='form-control w-50'
                                    id='discountPrice'
                                    name='discountPrice'
                                    value={discountedPrice}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>
                        )}

                        {/* files images */}
                        <div className='mb-3'>
                            <label className='form-label' htmlFor='images'>
                                select images :
                            </label>
                            <input
                                className='form-control'
                                type='file'
                                id='images'
                                name='images'
                                onChange={onChangeHandler}
                                max='6'
                                accept='.jpg,.png,.jpeg,.avif'
                                multiple
                                required
                            />
                        </div>
                        {/* submit btn */}
                        <div className='mb-3'>
                            <input
                                className='btn btn-primary w-100'
                                value="Update Listing"
                                onClick={onSubmitHandler}
                            />
                        </div>

                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default EditListing