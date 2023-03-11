import React, { useContext, useState } from 'react'
import {GrAdd} from 'react-icons/gr'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../backend/Firebase'
import './Footer.css'
import { DogsContext } from '../App'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../backend/Firebase'

const Footer = () => {

    const dogData = useContext(DogsContext);

    const [loading, setLoading] = useState(false);
    const [finish, setFinish] = useState(false);
    const [reloading, setReloading] = useState(false);

    //function to handle submission of dogs
    //grabs the name and the file and sends it to the uploadFile function for further processing
    const submitDogHandler = () => {
        const dogName = document.getElementById('dog-name');
        const dogImage = document.getElementById('dog-image');

        if(dogName.value !== "" && dogImage.value !== ""){
            uploadFile(dogName.value, dogImage.files[0]);
        }
    }

    //function to handle showing dialog
    function addDogHandler(){
        const addDogDialog = document.getElementById('add-dog-dialog');
        const dogName = document.getElementById('dog-name');
        const dogImage = document.getElementById('dog-image');
        dogName.value = "";
        dogImage.value = "";

        addDogDialog.showModal();
    }

    function closeDialogHandler(){
        const addDogDialog = document.getElementById('add-dog-dialog');

        addDogDialog.close();
    }

    //function to upload image to Firebase storage and sends URL to uploadDog function for further processing
    function uploadFile(dogName, dogImage){
        const storageRef = ref(storage, `dog-images/${dogImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, dogImage);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if(progress < 100){
                setLoading(true);
                }
                else{
                setLoading(false);
                setFinish(true);
                setReloading(true);
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        uploadDog(dogName, downloadURL);
                    })
            }
        )
    }

    //updates the dog data by adding the new one
    function uploadDog(dogName, dogImage){
        const updateDogData = async () => {
            const newDogData = {
              dogs: [...dogData, {name: dogName, image: dogImage, score: 0}]
            }
            await setDoc(doc(db, "doglist", "doglist"), newDogData);
        };
        updateDogData().catch((err) => console.log(err));
    }


    if(loading){
        return (
            <p className='loading-block'>Loading...</p>
        )
    }

    if(finish){
        setTimeout(() => {
            window.location.reload(false);
        }, 5000)
    }

    return (
        <>
            <div className={reloading ? 'reloading-block' : 'reloading-block-hidden'}>Reloading...</div>
            <p className={finish ? 'finish-block' : 'finish-block-hidden'}>Dog Successfully Added</p>
            <footer>
                <dialog id="add-dog-dialog">
                    <form id='dog-form' method='dialog'>
                        <div>
                            <label htmlFor='dog-name'>Name</label>
                            <input id='dog-name' type='text' placeholder='Name' required/>
                        </div>
                        <div>
                            <label htmlFor='dog-photo'>Upload Photo</label>
                            <input id='dog-image' className='image-input' type='file' accept='image/*' required/>
                        </div>
                        <div className='btn-container'>
                            <button onClick={() => submitDogHandler()} className='submit-btn' type='button'>Submit</button>
                            <button onClick={() => closeDialogHandler()} className='submit-btn' type='button'>Cancel</button>
                        </div>
                    </form>
                </dialog>
                <button style={{color: 'black'}} onClick={() => addDogHandler()}><GrAdd size={40}/>Add</button>
            </footer>
        </>
    )
}

export default Footer