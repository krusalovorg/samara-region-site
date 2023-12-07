import React, { useState, useEffect, useRef } from 'react';
import Login from '../components/Login';
import FragmentPlaces from './FragmentPlaces';
import FragmentCategory from './FragmentCategory';
import FragmentRoutes from './FragmentRoutes';

function Admin() {
    const [fragment, setFragment] = useState('all');
    window.scrollTo(0, 0);
    return (
        <Login fragment={fragment} setFragment={setFragment}>
            <div className='px-[5%] w-full h-full'>
                {fragment == "place" ?
                    <FragmentPlaces setFragment={setFragment} />
                    : fragment == "category" ?
                        <FragmentCategory />
                        : fragment == "routes" ? <FragmentRoutes setFragment={setFragment} /> :
                            <></>
                }
            </div>
        </Login>
    )
}

export default Admin;