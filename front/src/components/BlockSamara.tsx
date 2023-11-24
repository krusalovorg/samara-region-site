import ImageCard1 from '../assets/buti1.jpg';
import ImageCard2 from '../assets/buti2.jpg';
import ImageCard3 from '../assets/buti3.jpg';
import ImageCard4 from '../assets/buti4.jpg';
import ImageCard5 from '../assets/buti5.jpg';
import ImageCard6 from '../assets/buti6.jpg';
// import ImageCard7 from './assets/buti7.jpg';
// import ImageCard8 from './assets/buti8.jpg';

function BlockSamara() {
    return (
        <>
            <section
                className='w-full min-h-screen bg-[#D2F881] rounded-[50px] py-[3%] px-[5%] flex flex-row'
            >
                <div className='w-1/2 h-full'>
                    <h1 style={{
                        color: "#2C2C2C",
                        fontWeight: "bold",
                        fontSize: 'calc(90px + 7 * ((100vw - 720px) / 1280))',
                        width: "auto",
                        letterSpacing: -4
                    }}>
                        Самарская Область
                    </h1>
                    <h2 style={{
                        color: "#2C2C2C",
                        fontWeight: "normal",
                        fontSize: 'calc(30px + 7 * ((100vw - 720px) / 1280))',
                        maxWidth: "75%"
                    }}>
                        текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст текст
                    </h2>
                </div>
                <div className='w-1/2 grid grid-cols-2 gap-x-10 gap-y-10'>
                    {[ImageCard1, ImageCard2, ImageCard3, ImageCard4, ImageCard5, ImageCard6,].map((image) => (
                        <img
                            className='w-auto rounded-3xl'
                            src={image}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}

export default BlockSamara;