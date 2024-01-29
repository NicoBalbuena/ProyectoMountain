import style from "../Banner/Banner.module.css"

const Banner = () => {
    return (
        <div className={style.banner}>
            <div className={style.banner_info}>
                <h1>
                    Get out and stretch your imagination
                </h1>
                <h5>
                    Plan a different kind of getaway to uncover the hidden gems near you
                </h5>
                <button>
                    Explore Nearby
                </button>
            </div>
        </div>
    )
}

export default Banner;