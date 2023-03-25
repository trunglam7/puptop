import React, {useCallback, useContext, useEffect, useState} from 'react'
import DogCard from './DogCard'
import {AiFillCloseCircle, AiFillHeart} from "react-icons/ai"
import { animated, useSpring } from '@react-spring/web'

import './VotingPlatform.css'
import { DogsContext } from '../App'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../backend/Firebase'
const VotingPlatform = ({ user }) => {

    const dogData = useContext(DogsContext);

    const [vote, setVote] = useState("");
    const [voteStorage, setVoteStorage] = useState(null);
    const [disableVote, setDisableVote] = useState(false);
    const [dog, setDog] = useState(voteStorage);


    const appearCard = useSpring({
        from: {opacity: 0},
        to: {opacity: 1},
        reset: false,
      })

    //function to update user's number of votes to keep track of current dog they are on
    const updateUserData = useCallback( async () => {
        const newUserData = {
          votes: voteStorage
        }
        await setDoc(doc(db, "users", user.uid), newUserData);
    }, [user.uid, voteStorage]);

    //initialize current state of dog
    useEffect(() => {
        const docRef = doc(db, "users", user.uid);
        const docCheck = async () => {
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()){
            setVoteStorage(docSnap.data().votes);
            setDog(docSnap.data().votes);
          }
        };
        docCheck().catch((err) => console.log(err));
    }, [user.uid])

    //functions to handle user choices
    function slideLeftHandler(swipe) {
        if(!swipe){
            setVote("animate-slide-left");
        }
        setVoteStorage(voteStorage + 1);
        setDisableVote(true);
        if(!swipe) {
            setTimeout(() => {
                setVote("");
                setDisableVote(false);
                if(dog + 1 >= dogData.length){
                    setDog(null);
                }
                else{
                    setDog(dog + 1);
                }
            }, 1000);
        }
        else{
            setVote("");
            setDisableVote(false);
            if(dog + 1 >= dogData.length){
                setDog(null);
            }
            else{
                setDog(dog + 1);
            }
        }
    }

    function slideRightHandler(swipe) {
        if(!swipe){
            setVote("animate-slide-right");
        }
        setVoteStorage(voteStorage + 1);
        setDisableVote(true);
        if(!swipe) {
            setTimeout(() => {
                setVote("");
                setDisableVote(false);
                if(dog + 1 >= dogData.length){
                    setDog(null);
                }
                else{
                    setDog(dog + 1);
                }
            }, 1000);
        }
        else{
            setVote("");
            setDisableVote(false);
            if(dog + 1 >= dogData.length){
                setDog(null);
            }
            else{
                setDog(dog + 1);
            }
        }
    }

    useEffect(() => {
        if(dog >= dogData.length){
            setDog(null);
        }
    }, [dog, dogData.length]);


    useEffect(() => {
        if(voteStorage != null){
            updateUserData();
        }
    }, [voteStorage, updateUserData]);


    return (
        <main>
            <animated.div style={appearCard}>
                <DogCard vote={vote} dog={dog} slideLeftHandler={slideLeftHandler} slideRightHandler={slideRightHandler}/>
            </animated.div>
            <div className='vote-buttons'>
                <button disabled={dog === null || disableVote ? true : false} className='left' onClick={() => slideLeftHandler()}><AiFillCloseCircle size={65} color="gray"/></button>
                <button disabled={dog === null || disableVote ? true : false} className='right' onClick={() => slideRightHandler()}><AiFillHeart size={65} color="pink"/></button>
            </div>
        </main>
    )
}

export default VotingPlatform