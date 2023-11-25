import Category from "./Category";

function Price({ price }: { price: number }) {
    return (
        <Category text={price > 0 ? `От ${price} р` : "Бесплатно"} color={price > 0 ? "bg-[#FFF57D]" :"bg-[#D2F881]"}/>
    )
}

export default Price;