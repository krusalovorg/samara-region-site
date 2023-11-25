import Category from "./Category";
import Price from "./Price";

function ExcursionItem({ data }: { data: any }) {
    return (
        <div
            className="rounded-3xl min-w-[350px] max-w-[350px] w-[350px] bg-[#FFBD7B] cursor-pointer"
            onClick={() => { }}
        >
            <div className="relative">
                <img
                    src={data?.image}
                    className='w-full h-auto rounded-3xl'
                    style={{
                        objectFit: "cover",
                        aspectRatio: "1/1"
                    }}
                />
                <div className="absolute right-[20px] bottom-[20px]">
                    <Price price={data?.price || 0} />
                </div>

                <div className="absolute left-[20px] top-[20px] flex flex-row gap-x-[12px]">
                    {
                        data?.categorys && data?.categorys?.map((item: string) => (
                            <Category text={item} />
                        ))
                    }
                </div>
            </div>
            <div className='px-[20px] pt-[15px] pb-[20px]'>
                <h1 className='text-[#2C2C2C] font-bold spacing-[0px] text-2xl'>
                    {data?.title}
                </h1>
                <h2 className='text-[#2C2C2C] font-medium mt-[20px] spacing-[0px] text-lg'>
                    Интересная прогулка по территории искуственного замка. Экслюзивный вход внутрь.
                </h2>
                <h2 className='text-[#2C2C2C] font-medium mt-[20px] spacing-[0px] text-lg'>
                    Длительность: 2 часа
                </h2>
            </div>
        </div>
    )
}

export default ExcursionItem;