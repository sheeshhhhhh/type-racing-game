
const toFormData = (data: any) => {
    const formData = new FormData()
    for (const key in data) {
        if(data.hasOwnProperty(key)) {
            formData.append(key, data[key])
        }
    }
    return formData
}

export default toFormData