

const PhotosUploader = ({photos, photosLink, onChange, handleChange}) => {

    const addPhotoByLink = async (e) => {
        e.preventDefault()
        try {
            const { data: filename } = await axios.post("http://localhost:4000/uploads-by-link", { link: input.photosLink }, { withCredentials: true })
            onChange(prev => {
                return ({
                    ...prev,
                    photos: [...prev.photos, filename],
                    photosLink: ""
                })
            })
            alert("Photo uploaded successfully")
        } catch (error) {
            alert("Error uploading photo")
        }
    }

    const uploadPhoto = (e) => {
        const files = e.target.files
        const data = new FormData()
        for (let i = 0; i < files.length; i++) {
            data.append("photos", files[i]);
        }
        axios.post("http://localhost:4000/upload/", data, { headers: { "Content-Type": "multipart/form-data" } }, { withCredentials: true })
            .then(res => {
                const { data: filenames } = res;
                (prev => {
                    return ({
                        ...prev,
                        photos: [...prev.photos, ...filenames],
                    })
                })
            })
    }
    return (
        <>
            <h2 className="text-2xl mt-4">Photos</h2>
            <div className="flex gap-2">
                <input type="text" placeholder="Add using a link .... jpg" name="photosLink" value={photosLink} onChange={handleChange} />
                <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add photo</button>
            </div>

            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                {photos.length > 0 && photos.map((link, index) => (
                    <div key={index} className="h-32 flex">
                        <img className="rounded-2xl object-cover w-full" src={"http://localhost:4000/uploads/" + link} alt="" />
                    </div>
                ))}

                <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    )
}

export default PhotosUploader
