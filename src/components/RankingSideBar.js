import React, { useContext } from 'react'
import './RankingSideBar.css'
import { DogsContext } from '../App'

const RankingSideBar = ({toggleRank}) => {

    const dogData = useContext(DogsContext);

    //dog ranking card component
    const DogRankingCard = ({placement, dogImage, dogName}) => {
        return(
            <div className='dog-ranking-card'>
                <b>{placement + 1}</b>
                <img src={dogImage} alt='dog avatar'/>
                <b>{dogName}</b>
            </div>
        )
    }

    //sort dog list based on score
    const sortedDogs = [...dogData].sort((a, b) => b.score - a.score);
    return (
        <div className={toggleRank ? 'ranking-side-container' : 'ranking-side-container hidden'}>
            <div className='ranking-container'>
                <h2>Ranking</h2>
                {sortedDogs.length ?
                    sortedDogs.map((dog, index) => <DogRankingCard key={index} placement={index} dogImage={dog.image} dogName={dog.name}/>) 
                    : <p className='rank-msg'>No Dogs Here</p>}
            </div>
        </div>
    )
}

export default RankingSideBar