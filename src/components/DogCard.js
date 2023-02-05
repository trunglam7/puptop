import React, { useCallback, useContext, useEffect } from 'react'
import "./DogCard.css"
import { DogsContext } from '../App'
import { db } from '../backend/Firebase';
import { doc, setDoc } from 'firebase/firestore';

const DogCard = ({vote, dog}) => {

  const dogData = useContext(DogsContext);

  const updateDogData = useCallback( async () => {
    const newDogData = {
      dogs: dogData
    }
    await setDoc(doc(db, "doglist", "doglist"), newDogData);
  }, [dogData]);

  useEffect(() => {

    if(vote === "animate-slide-left"){
      dogData[dog].score -= 1;
      updateDogData();
    }
  
    if(vote === "animate-slide-right"){
      dogData[dog].score += 1;
      updateDogData();
    }
  }, [vote, dog, dogData, updateDogData]);
  

  
  if(dog === null || !dogData[dog]){
    return (
      <b>No More Dogs To Vote</b>
    )
  }


  return (
    <div className={"Dog " + vote} style={{backgroundImage: `url(${dogData[dog].image})`}}>
        <p>{dogData[dog].name}</p>
    </div>
  )
}

export default DogCard