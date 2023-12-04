import SearchPanel from './components/SearchPanel';
import BlockSamara from './components/BlockSamara';
import Header from './components/Header';
import PlacesList from './components/PlacesList';
import { Place, getData } from './utils/backend';
import { useEffect, useState } from 'react';

function App() {
  const [places, setPlaces] = useState<Place[]>([]);

  async function loadPlaces() {
    const data = await getData("places");

    if (data) {
      setPlaces(data as Place[]);
    }
  }

  useEffect(()=>{
    loadPlaces();
  },[])

  return (
    <div className="w-screen min-h-screen h-full bg-[#FFFAF1]">
      <Header />
      <SearchPanel />
      <BlockSamara places={places} />
      <PlacesList places={places} />
    </div>
  );
}

export default App;
