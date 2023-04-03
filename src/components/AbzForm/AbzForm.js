import { useState, useEffect } from 'react';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
import './abzForm.scss';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import AbzServices from '../../services/AbzServices';

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'At least 2 letters')
        .max(60, 'No more than 60 letters')
        .required('Name is required'),
    email: Yup.string()
        .min(2, 'Email must contain at least 2 characters')
        .max(100, 'Email must not exceed 100 characters')
        .matches(
            /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Invalid email format'
        )
        .required('Email обязателен для заполнения'),
    phone: Yup.string()
        .matches(/^\+380\d{9}$/, 'Неверный формат номера телефона')
        .required('Номер телефона обязателен для заполнения'),
    position_id: Yup.string().required("Required"),
});

const AbzForm = ({getNewUser}) => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [position, setPosition] = useState();
    const [allPosition, setAllPosition] = useState([]);
    const [postToken, setPostToken] = useState(null);
    const [image, setImage] = useState(null)
    const [photoError, setPhotoError] = useState(false);
    const [photoErrorInfo, setPhotoErrorInfo] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    const { getPositions, getFormToken, postUser } = AbzServices();

    useEffect(() => {
        getAllPosition();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchPostToken = async () => {
            const data = await getFormToken();
            setPostToken(data);
        };
        fetchPostToken();
        // eslint-disable-next-line
    }, []);

    const getAllPosition = async () => {
        const positions = await getPositions();
        onPositionLoad(positions);
    };

    const onPositionLoad = (positions) => setAllPosition(positions);


    const viewPosition = (arr) =>
        arr.map((item) => (
            <FormControlLabel
                sx={{
                    height: "26px",
                    marginBottom: "7px"
                }}
                key={item.id}
                id={item.id}
                value={item.id}
                control={<Radio {...register('position_id')} />}
                className="color-primary"
                label={item.position}
            />
        ));

    const items = viewPosition(allPosition);

    const onSumbit = async (values) => {
        const data = new FormData();
        data.append("name", values.name)
        data.append("email", values.email)
        data.append("phone", values.phone)
        data.append("position_id", values.position_id)
        data.append("photo", image)

        const res = await postUser(data, postToken)
        console.log(res)
        getNewUser(res)
    }

    const checkImageDimensions = (file, minWidth, minHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                const width = img.width;
                const height = img.height;
                if (width < minWidth || height < minHeight) {
                    reject('error');
                } else {
                    resolve();
                }
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handlePhotoChange = async (event) => {
        setImage(null)
        setPhotoError(false)
        setPhotoErrorInfo('')
        const file = event.target.files[0];
        const fileType = String(file.type)
        if (fileType !== "image/jpeg" && fileType !== "image/jpg") {
            setPhotoError(true);
            setPhotoErrorInfo('Wrong photo format. Requires jpeg/jpg format');
        } else if (file.size > (5 * 1024 * 1024)) {
            setPhotoError(true)
            setPhotoErrorInfo('Max size 5MB');
        } else {
            try {
                await checkImageDimensions(file, 70, 70);
                setImage(file);
            } catch (error) {
                setPhotoError(true);
                setPhotoErrorInfo('Min 70x70 photo or more')
            }
        }
    };

    return (
        <div className="forms">
            <div className="container">
                <h2 className="forms__title">Working with POST request</h2>
                <form onSubmit={handleSubmit(onSumbit)}>
                    <TextField
                        sx={{ marginRight: '0px', position: '' }}
                        margin="normal"
                        className="forms__input"
                        id="name"
                        name="name"
                        label="Your name"
                        variant="outlined"
                        onInput={(e) => setName(e.target.value)}
                        fullWidth
                        {...register('name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name ? errors.name.message : "Enter your name"}
                    />
                    <TextField
                        sx={{
                            marginTop: '50px',
                        }}
                        margin="normal"
                        id="email"
                        label="Email"
                        className="forms__input forms__input_margin"
                        variant="outlined"
                        fullWidth
                        name="email"
                        onInput={(e) => setEmail(e.target.value)}
                        {...register('email')}
                        error={Boolean(errors.email)}
                        helperText={errors.email ? errors.email.message : "Email format: test@gmail.com"}
                    />
                    <TextField
                        sx={{
                            marginTop: '50px',
                        }}
                        margin="normal"
                        id="phone"
                        label="Phone"
                        className="forms__input forms__input_margin"
                        variant="outlined"
                        fullWidth
                        name="phone"
                        onInput={(e) => setPhone(e.target.value)}
                        {...register('phone')}
                        error={Boolean(errors.phone)}
                        helperText={errors.phone?.message}
                    />
                    <label htmlFor="number" className="forms__input_label">+38 (XXX) XXX - XX - XX</label>
                    <FormControl error={Boolean(errors.position_id)}>
                        <FormLabel component="legend"> Select your position </FormLabel>
                        <RadioGroup aria-label="position" name="position" onChange={(e) => setPosition(e.target.value)}>
                            {items}
                        </RadioGroup>
                        <FormHelperText style={{ color: '#d32f2f' }}>{errors.position_id?.message}</FormHelperText>
                    </FormControl>
                    <label htmlFor="photo" className="custom-file-upload" style={{ borderColor: photoError ? "rgba(203, 61, 64, 1)" : '#ccc' }}>
                        <div className="file__up" style={{ borderColor: photoError ? "rgba(203, 61, 64, 1)" : 'black' }}>Upload</div>
                        <input id="photo" type="file" name="photo"
                            accept="image/png, image/jpeg"
                            onChange={(e) => handlePhotoChange(e)}
                        />
                        <div className="file__text">{image ? image.name : "Upload your photo"}</div>
                    </label>
                    <span style={{ color: "rgba(203, 61, 64, 1)" }}>{photoErrorInfo ? photoErrorInfo : null}</span>
                    <button type="submit" disabled={(name && email && phone && position && image) ? false : true} className={(name && email && phone && position && image) ? "btn btn__active forms__btn" : "btn btn__disable forms__btn"}>
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AbzForm;