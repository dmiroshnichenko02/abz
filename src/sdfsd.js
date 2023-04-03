import { useState, useEffect, useMemo } from 'react';
import AbzServices from '../../services/AbzServices';
import * as Yup from 'yup'

import './abzForm.scss';

const AbzForm = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [position, setPosition] = useState();
    const [photo, setPhoto] = useState(null);
    const [allPosition, setAllPosition] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [postToken, setPostToken] = useState();

    const { getPositions, getFormToken } = AbzServices();

    useEffect(() => {
        getAllPosition();
    }, []);

    const getAllPosition = () => {
        getPositions()
            .then(onPositionLoad)
    }

    const token = useMemo(async () => {
        await getFormToken()
            .then(data => setPostToken(data))
    }, [])

    const onPositionLoad = (positions) => {
        setAllPosition(positions)
    }

    function viewPosition(arr) {
        const item = arr.map(item => {
            return (
                <label key={item.id}>
                    <input
                        type="radio"
                        name="position"
                        id={item.id}
                        value={item.position}
                        required
                        onChange={(e) => setPosition(e.target.id)}
                    />
                    {item.position}
                </label>
            )
        })
        return item
    }

    const items = viewPosition(allPosition);


    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Имя должно содержать минимум 2 символа')
            .max(60, 'Имя не должно превышать 60 символов')
            .required('Имя обязательно для заполнения'),
        email: Yup.string()
            .min(2, 'Email должен содержать минимум 2 символа')
            .max(100, 'Email не должен превышать 100 символов')
            .matches(
                /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                'Неверный формат email'
            )
            .required('Email обязателен для заполнения'),
        number: Yup.string()
            .matches(/^\+380\d{9}$/, 'Неверный формат номера телефона')
            .required('Номер телефона обязателен для заполнения'),
        photo: Yup.mixed()
            .required('Фотография обязательна для загрузки')
            .test(
                'fileSize',
                'Фотография не должна превышать 5 Мб',
                (value) => value && value.size <= 5 * 1024 * 1024
            )
            .test(
                'fileFormat',
                'Фотография должна быть в формате JPEG/JPG',
                (value) =>
                    value && ['image/jpeg', 'image/jpg'].includes(value.type)
            )
            .test(
                'fileResolution',
                'Минимальный размер фотографии 70x70px',
                async (value) => {
                    if (value instanceof File) {
                        const file = value;
                        const img = new Image();
                        const objectUrl = URL.createObjectURL(file);
                        img.src = objectUrl;
                        return new Promise((resolve) => {
                            img.onload = () => {
                                const { width, height } = img;
                                resolve(width >= 70 && height >= 70);
                                URL.revokeObjectURL(objectUrl);
                            };
                        });
                    }
                    return true;
                }
            )
    });

    return (
        <div className="forms">
            <div className="container">
                <h2 className="forms__title">Working with POST request</h2>
                <form>
                    <input
                        type="text"
                        id="name"
                        name='name'
                        placeholder="Your name"
                        className="forms__input"
                    />

                    <input
                        type="email"
                        id="email"
                        name='email'
                        placeholder="Email"
                        className="forms__input forms__input_margin"
                    />

                    <input
                        type="tel"
                        id="number"
                        name='number'
                        placeholder="Phone"
                        className="forms__input forms__input_margin"
                    />
                    <label htmlFor="number" className="forms__input_label">+38 (XXX) XXX - XX - XX</label>

                    <fieldset className="forms__radio">
                        <legend className="forms__position">Select your position</legend>
                        {items}
                    </fieldset>

                    <label htmlFor="file-upload" className="custom-file-upload">
                        <div className="file__up">Upload</div>
                        <input
                            id="file-upload"
                            type="file"
                            name='photo'
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <div className="file__text">
                            {selectedFile ? selectedFile.name : 'Upload your photo'}
                        </div>
                    </label>

                    <button type="submit" className="btn btn__disable forms__btn">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    )
}


