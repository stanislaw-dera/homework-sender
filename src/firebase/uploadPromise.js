import { storage } from "./firebase";

const uploadAndGetURL = (file, path) => {
    return new Promise(function (resolve, reject) {
        var uploadTask = storage.ref().child(path).put(file);

        uploadTask.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                reject(error)
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}

export default uploadAndGetURL;