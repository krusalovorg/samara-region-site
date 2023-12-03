import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import FragmentPlaces from './FragmentPlaces';
import FragmentCategory from './FragmentCategory';

function Admin() {
    const [fragment, setFragment] = useState('all');

    return (
        <Login fragment={fragment} setFragment={setFragment}>
            <div className='px-[5%] w-full h-full'>
                {fragment == "place" ?
                    <FragmentPlaces setFragment={setFragment} />
                    : fragment == "category" ?
                        <FragmentCategory/>
                        : <></>
                }
            </div>
        </Login>
    )
}

export default Admin;