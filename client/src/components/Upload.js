import React, { useRef, useState } from 'react';
import { useUserContext } from '../utils/GlobalState'
import { useHistory } from 'react-router-dom';
// import API from '../utils/API'
import axios from 'axios';
import API from '../utils/API';

const Upload = () => {

    const [state, dispatch] = useUserContext();
    // console.log('state in upload', state)
    // const history = useHistory();
    // console.log('state in upload', state)

    const [fileState, setFileState] = useState({
        message: '',
        file: '',
        url: ''
    });

    const [artState, setArtState] = useState({
        title: '',
        postBody: '',
        tags: []
    });
    
    // console.log('artState', artState)

    const imgRef = useRef();
    const titleRef = useRef();
    const bodyRef = useRef();
    const tagsRef = useRef();
    const uploadedImg = useRef();

    // dynamic host for putting/getting images to/from bucket
    const host = window.location.host;

    const getImage = e => {
        e.preventDefault();
        const files = imgRef.current.files;
        // console.log(files);
        if (files && files.length > 0) {
            const file = files[0];
            setFileState({ ...fileState, file });
            const reader = new FileReader();
            const { current } = uploadedImg;
            current.file = file;
            reader.onload = e => {
                // console.log(e.target.result)
                current.src = e.target.result;
            };
            reader.readAsDataURL(file);
        };
    };

    // console.log('img upload state:', fileState);

    const uploadFile = e => {
        e.preventDefault();
        const { file } = fileState;
        setFileState({ ...fileState, message: 'Uploading...' });
        // console.log('file.type', file.type);
        const contentType = file.type;

        const generatePutUrl = `https://${host}/generate-put-url`;
        // console.log('generatePutUrl', generatePutUrl)
        const options = {
            params: {
                Key: `${state.username}/works/${Date.now()}_${file.name}`,
                ContentType: contentType
            },
            headers: {
                'Content-Type': contentType
            }
        };

        axios.get(generatePutUrl, options)
            .then(res => {
                // console.log('res.data', res.data)
                const { data } = res;
                // console.log('put url from res.data', data);

                axios.put(data, file, options)
                    .then((res) => {
                        // console.log('put file', res.config.params);
                        setFileState({ ...fileState, message: 'Upload Successful' });

                        const params = res.config.params;
                        const generateGetUrl = `https://${host}/generate-put-url`
                        const options = {params};

                        axios.get(generateGetUrl, options)
                            .then(res => {
                                const { data } = res;
                                const url = data.replace(/\?.*/, '');
                                // console.log(trimData);
                                setFileState({ ...fileState, url })

                                handlePost(url);
                            })
                    })
                    .catch(err => {
                        setFileState({ ...fileState, message: 'Something went wrong, try again' });
                        console.log('err', err);
                    });
            });
    };

    const handlePost = (url) => {
        const { title, postBody, tags } = artState;
        const { _id } = state;
        // console.log('_id in handlePost', _id)
        const newArt = {
            userId: _id,
            url,
            title,
            postBody,
            tags
        };

        API.postArt(newArt);
        dispatch({
            ...state,
            uploaded: true
        })
        uploadedImg.current.src = '';
        titleRef.current.value = '';
        bodyRef.current.value = '';
        tagsRef.current.value = '';
        // window.location.assign('gallery')
    }


    const handleChange = e => {
        e.preventDefault();
        const title = titleRef.current.value;
        const postBody = bodyRef.current.value;
        const tags = tagsRef.current.value.split(',');
        const prettyTags = tags.map(tag => {
            const trimTag = tag.trim();
            const regex = /\s+/g;
            const underscoreTag = trimTag.replace(regex, '_')
            return underscoreTag;
        });

        // console.log('prettyTags', prettyTags);

        setArtState({
            ...artState,
            title,
            postBody,
            tags: prettyTags
        })
    }
    
    return (
        <div className="container upload">
            <form class="upload-box">
                <div class="upload-info">
                <div>
                    <label htmlFor="upload">Choose an image</label>
                    <input id="upload-file" type="file" name="upload" accept="image/*" onChange={getImage} ref={imgRef} />
                </div>
                <div class="upload-mess">
                    {fileState.message}
                </div>
                <div>
                   <p> Title: </p>
                    <input type="text" name="title" ref={titleRef} onChange={handleChange} />
                </div>
                <div>
                   <p>Description:</p>
                    <textarea name="body" ref={bodyRef} onChange={handleChange} />
                </div>
                <div>
                    <p>Tags, separated by a comma:</p>
                    <input type="text" name="tags" ref={tagsRef} onChange={handleChange} />
                </div>
                <div>
                    <button onClick={uploadFile}>Submit</button>
                </div>
                </div>
                    <div class="upload-prev">
                        <img ref={uploadedImg} alt="preview" width="140px" />
                    </div>
            </form>
        </div>
    )
}

export default Upload;