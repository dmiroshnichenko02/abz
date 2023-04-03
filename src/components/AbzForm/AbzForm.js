import { useState, useEffect } from 'react';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@mui/material/TextField';
// style file
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
// Imported service to work with the useHttp hook
import AbzServices from '../../services/AbzServices';
// Picture to confirm the successful form
import successImage from '../../assets/img/success-image.svg';

// Validation scheme for fields using yup
const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'At least 2 letters')
        .max(60, 'No more than 60 letters')
        .required('Name is required'),
    email: Yup.string()
        .min(2, 'Email must contain at least 2 characters')
        .max(100, 'Email must not exceed 100 characters')
        .matches(
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            'Invalid email format'
        )
        .required('Email обязателен для заполнения'),
    phone: Yup.string()
        .matches(/^\+380\d{9}$/, 'Неверный формат номера телефона')
        .required('Номер телефона обязателен для заполнения'),
    position_id: Yup.string().required("Required"),
});

// Getting a prop
const AbzForm = ({ getNewUser }) => {
    // Component States
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [position, setPosition] = useState();
    const [allPosition, setAllPosition] = useState([]);
    const [postToken, setPostToken] = useState(null);
    const [image, setImage] = useState(null);
    const [photoError, setPhotoError] = useState(false);
    const [photoErrorInfo, setPhotoErrorInfo] = useState('');
    const [success, setSuccess] = useState(false);

    // We create a form from the react hook form and pull the necessary elements
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        // Set the check mode after blur
        mode: 'onBlur',
        // Connect in the form of a validation scheme
        resolver: yupResolver(validationSchema)
    });
    // We get the functions and values we need from the service
    const { getPositions, getFormToken, postUser, error, clearError } = AbzServices();

    // We will receive robot positions from the server when mounting the component
    useEffect(() => {
        getAllPosition();
        // eslint-disable-next-line
    }, []);

    // Get a token to send a post to the server
    useEffect(() => {
        const fetchPostToken = async () => {
            const data = await getFormToken();
            setPostToken(data);
        };
        fetchPostToken();
        // eslint-disable-next-line
    }, []);
    // The function that we call the method to get the positions
    const getAllPosition = async () => {
        const positions = await getPositions();
        onPositionLoad(positions);
    };
    // Let's put in the state the values of the positions that have already been received
    const onPositionLoad = positions => setAllPosition(positions);

    // Loop through the array of positions by creating a collection of elements
    const viewPosition = (arr) =>
        arr.map(item => (
            <FormControlLabel
            // Assign Direct Styles to the Styling Component
                sx={{
                    height: "26px",
                    marginBottom: "7px"
                }}
                key={item.id}
                id={item.id}
                value={item.id}
                // Let's register each position in the react hook form register
                control={<Radio {...register('position_id')} />}
                className="color-primary"
                label={item.position}
            />
        ));
    // Get into a variable all the necessary elements for further display in the component
    const items = viewPosition(allPosition);
    // Let's create the necessary function for the react hook form that will do the form submission
    const onSumbit = async (values) => {
        clearError()
        const data = new FormData();
        data.append("name", values.name)
        data.append("email", values.email)
        data.append("phone", values.phone)
        data.append("position_id", values.position_id)
        data.append("photo", image)
        // Send a request to the server with the post method by adding the previously received token
        const res = await postUser(data, postToken)
        // We will return the received data of the new user to the root component for transfer to another
        getNewUser(res)
        // Set the success of the form to the state
        setSuccess(true)
    }
    // Due to the inability to create validation via yup and react hook form , I created my own image validation. This function checks the height and width of the uploaded file.
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

    // The main function of photo validation, includes checking for file type, size and width with height
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
        <div className="forms" id="user-signUp">
            <div className="container">
                <h2 className="forms__title">{success ? "User successfully registered" : "Working with POST request"}</h2>
                {success ? <img className='forms__success_img' src={successImage} alt='Success' /> :
                    // We hang a send garter on the form through the react hook form
                    <form onSubmit={handleSubmit(onSumbit)}>
                        {/* Name field */}
                        <TextField
                            sx={{ marginRight: '0px', position: '' }}
                            margin="normal"
                            className="forms__input"
                            id="name"
                            name="name"
                            label="Your name"
                            variant="outlined"
                            // A binding was made via onInput with the normal state of the component for further interaction with the submit button, since onChange is used in the registration binding, and in react they work the same
                            onInput={(e) => setName(e.target.value)}
                            fullWidth
                            // Field Registration
                            {...register('name')}
                            // Show errors if any
                            error={Boolean(errors.name)}
                            // Shows help text
                            helperText={errors.name ? errors.name.message : "Enter your name"}
                        />
                        {/* Mail field */}
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
                            // State Binding
                            onInput={(e) => setEmail(e.target.value)}
                            // Field Registration
                            {...register('email')}
                            error={Boolean(errors.email)}
                            helperText={errors.email ? errors.email.message : "Email format: test@gmail.com"}
                        />
                        {/* Number field */}
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
                        {/* Position fields */}
                        <FormControl error={Boolean(errors.position_id)}>
                            <FormLabel component="legend"> Select your position </FormLabel>
                            {/* Binding the state */}
                            <RadioGroup aria-label="position" name="position" onChange={(e) => setPosition(e.target.value)}>
                                {items}
                            </RadioGroup>
                            <FormHelperText style={{ color: '#d32f2f' }}>{errors.position_id?.message}</FormHelperText>
                        </FormControl>
                        {/* File field */}
                        {/* Due to the limited interactions and styling of the field with the file, it was decided to hide it by overlaying other elements that are already styled on top of it. */}
                        <label htmlFor="photo" className="custom-file-upload" style={{ borderColor: photoError ? "rgba(203, 61, 64, 1)" : '#ccc' }}>
                            <div className="file__up" style={{ borderColor: photoError ? "rgba(203, 61, 64, 1)" : 'black' }}>Upload</div>
                            <input id="photo" type="file" name="photo"
                                accept="image/png, image/jpeg"
                                onChange={(e) => handlePhotoChange(e)}
                            />
                            <div className="file__text">{image ? image.name : "Upload your photo"}</div>
                        </label>
                        {/* Field error line with file */}
                        <span style={{ color: "rgba(203, 61, 64, 1)" }}>{photoErrorInfo ? photoErrorInfo : null}</span>
                        {/* Form submit button */}
                        <button type="submit" disabled={(name && email && phone && position && image) ? false : true} className={(name && email && phone && position && image) ? "btn btn__active forms__btn" : "btn btn__disable forms__btn"}>
                            Sign up
                        </button>
                        {/* Global form error in case status 409 */}
                        {error ? <div className='forms__error'>{error}</div> : null}
                    </form>
                }
            </div>
        </div>
    );
};

export default AbzForm;