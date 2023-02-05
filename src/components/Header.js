import React, {useState} from 'react'
import {GrClose} from 'react-icons/gr'
import {CgMenuMotion} from 'react-icons/cg'

import './Header.css'
import RankingSideBar from './RankingSideBar'

const Header = () => {
    const [toggleRank, setToggleRank] = useState(false);

    //if ranking button (top-left) is pressed, toggle it
    const toggleRankHandler = () => {
        setToggleRank(!toggleRank);
    }

    return (
        <header>
            <button style={{"zIndex": toggleRank ? 1 : 0}} onClick={() => toggleRankHandler()} className='ranking-btn'>{toggleRank ? <GrClose size={40} /> : <CgMenuMotion size={40} color={'black'}/> }</button>
            <RankingSideBar toggleRank={toggleRank}/>
        </header>
    )
}

export default Header