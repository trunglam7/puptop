import React, { useCallback, useContext, useEffect } from 'react'
import { animated, useSpring } from '@react-spring/web';
import "./DogCard.css"
import { DogsContext } from '../App'
import { db } from '../backend/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';

const DogCard = ({vote, dog, slideLeftHandler, slideRightHandler}) => {

  const dogData = useContext(DogsContext);
  const [slide, setSlide] = useState(null);
  const [ref, setRef] = useState(null);
  const [slideVote, setSlideVote] = useState(null);

  const threshold = 50;

  const animatedRef = useCallback(node => {
    if(node){
      setRef(node);
    }
  }, [])


  //Animation Setups
  const slideRight = useSpring({
    from: {rotate: 0, opacity: 1},
    to: {rotate: 45, opacity: 0.5},
    reset: true
  })

  const slideLeft = useSpring({
    from: {rotate: 0, opacity: 1},
    to: {rotate: -45, opacity: 0.5},
    reset: true
  })

  //Function to update dog's score
  const updateDogData = useCallback( async () => {
    const newDogData = {
      dogs: dogData
    }
    await setDoc(doc(db, "doglist", "doglist"), newDogData);
  }, [dogData]);

  //Manages updates of votes
  useEffect(() => {
    if(vote === "animate-slide-left" || slideVote === 'left'){
      dogData[dog].score -= 1;
      updateDogData();
      if(slideVote){
        slideLeftHandler('swipe');
      }
    }
    if(vote === "animate-slide-right" || slideVote === 'right'){
      dogData[dog].score += 1;
      updateDogData();
      if(slideVote){
        slideRightHandler('swipe');
      }
    }
  }, [vote, slideVote, dog, dogData, updateDogData, slideLeftHandler, slideRightHandler]);

  //Manages animation
  useEffect(() => {
    let startingPoint = null;
    let offsetX = null;

    if(ref)
    {
      ref.addEventListener('pointerdown', (e) => {
        startingPoint = e.clientX;
      })

      ref.addEventListener('pointermove', (e) => {
        if(!startingPoint) return;
        offsetX = e.clientX - startingPoint;
        ref.style.transform = `translateX(${offsetX}px)`;
        if(offsetX > threshold){
          setSlide('right');
        }
        else if(offsetX < -threshold){
          setSlide('left');
        }
        else{
          setSlide(null);
        }
      })

      ref.addEventListener('pointerleave', () => {
        startingPoint = null;
        ref.style.transform = '';
        setSlide(null);
      })

      ref.addEventListener('pointerup', () => {
        if(offsetX > threshold){
          setSlideVote('right');
        }
        else if (offsetX < -threshold){
          setSlideVote('left');
        }
        else{
          setSlideVote(null);
        }
        startingPoint = null;
        ref.style.transform = '';
        setSlide(null);
      })

      ref.addEventListener('drag', (e) => {
        e.preventDefault();
      })
    }
  },[ref, slide])

  //If no more dogs exist
  if(dog === null || !dogData[dog]){
    return (
      <b>No More Dogs To Vote</b>
    )
  }

  return (
    <div className='dog-wrapper' ref={animatedRef}>
      <animated.div style={slide === 'left' ? slideLeft : slide === 'right' ? slideRight : null}>
        <div className={slideVote ? "Dog" : "Dog " + vote} style={{backgroundImage: `url(${dogData[dog].image})`}}>
          <p>{dogData[dog].name}</p>
        </div>
      </animated.div>
    </div>
  )
}

export default DogCard