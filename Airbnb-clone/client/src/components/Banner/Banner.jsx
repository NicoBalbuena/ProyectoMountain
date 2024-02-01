import style from "../Banner/Banner.module.css"

const Banner = () => {
    return (
        <div className={style.banner}>
            <div className="bg-black/80 flex items-center justify-center my-3 rounded-2xl max-w-md w-full px-3 backdrop-blur-lg">
                <div className="max-w-sm flex flex-col gap-4">
                    <h1 className="text-white font-bold text-2xl">
                        Get out and stretch your imagination
                    </h1>
                    <h5 className="text-white font-semibold text-lg">
                        Plan a different kind of getaway to uncover the hidden gems near you
                    </h5>
                 
                </div>

            </div>
        </div>
    )
}

export default Banner;