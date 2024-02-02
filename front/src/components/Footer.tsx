import GerbLogo from '../assets/gerb.png';

function Footer() {
    return (
        <>
            <footer className="bg-[#1E4B40] dark:bg-gray-900 mt-[100px]">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a href="/" className="flex items-center">
                                <img src={GerbLogo} className="h-[128px] me-3" alt="FlowBite Logo" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            {/* <div>
                                <h2 className="mb-6 text-sm font-semibold text-[#2C2C2C] uppercase dark:text-white">Партнеры</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://nikoturs.ru/" target={"_blank"} className="hover:underline">Нико Турс</a>
                                    </li>
                                </ul>
                            </div> */}
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Разработчики</h2>
                                <ul className="text-white dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://github.com/krusalovorg" className="hover:underline ">krusalovorg</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/cheked" className="hover:underline">Misha</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Политика</h2>
                                <ul className="text-white dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://telegra.ph/Politika-konfidencialnosti-11-25-8" target={"_blank"} className="hover:underline">Политика конфиденциальности</a>
                                    </li>
                                    <li>
                                        <a href="https://telegra.ph/Usloviya-ispolzovaniya-11-25" target='_blank' className="hover:underline">Условия использования</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-white sm:mx-auto lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-white sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Чудеса Самарского края™</a>. Все права защищены.
                        </span>
                        <div className="flex mt-4 sm:justify-center sm:mt-0">
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;