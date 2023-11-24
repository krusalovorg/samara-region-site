function Category({className, color}: {className?: string, color?: string}) {
    return (
        <h3 className={`text-[#2C2C2C] font-medium text-md mt-1 px-[10px] py-[7px] rounded-2xl w-fit ${className||""} ${color || "bg-[#FFEED5]"}`}>Достопримечательность</h3>
    )
}

export default Category;