import { Tooltip } from "@material-tailwind/react";

function Category({ className, color, text, description }: { className?: string, color?: string, text?: string, description?: string }) {
    return (
        <>
            <Tooltip
                content={
                    <div className="w-80">
                        <p className="font-normal opacity-80 text-blue-gray">
                        {description}
                        </p>
                    </div>
                }
                style={{ zIndex: 100 }}
                placement="top"
                className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 text-black"
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                }}
            >
                <h3 className={`text-[#2C2C2C] font-medium text-md mt-1 px-[10px] py-[7px] rounded-2xl w-fit cursor-pointer ${className || ""} ${color || "bg-[#FFEED5]"}`}>{text}</h3>
            </Tooltip>
        </>
    )
}

export default Category;