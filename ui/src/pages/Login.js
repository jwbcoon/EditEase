import {useState, useEffect, forwardRef} from 'react';
import API from '../API_Interface/API_Interface';
import styles from './Login.module.css';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { ReactComponent as EditEaseLogo } from '../icons/editease-logo.svg';
import CredentialField from '../components/CredentialField';

const makeUserName = ({user_fName, user_mName, user_lName}) => {

    console.log(`making user name with: ${user_fName} : ${user_mName} : ${user_lName}`);
    const middleName = () => user_mName !== undefined && user_mName !== null  
                        ? `${user_mName.length === 1 ? user_mName[0] + '.' : user_mName}` 
                        : '';

    return `${user_fName} ${middleName()} ${user_lName}`;
};

const Login = forwardRef(function Login(props, ref) {
    const [userInput, setUserInput] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    let globalStyle = ref.current;

    useEffect(() => {
       globalStyle = ref.current;
    }, [ref.current])

    const handleInputChange = (event, field) => {
        console.log("handleInputChange called.");

        if(event.key === "Enter" && !authFailed) {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
        if (field === 'username')
            setUserInput(event.target.value);
        if (field === 'password') 
            setSecretInput(event.target.value);

        setAuthFailed(false);
    };

    useEffect(() => {
        if(!verifyUser || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            console.log(`user input is: ${userInput} and secret input is: ${secretInput}`);
            api.getLoginFromUsername(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    if(userInfo.data.status === "OK") {
                        const {username, password} = userInfo.data.user;
                        if (password === secretInput) {
                            props.setUser(userInfo.data.user.username);
                            return;
                        }
                    }
                    setVerifyUser(false);
                    setAuthFailed(true);
                });
        }

        async function postUserInfo() {
            console.log(`user input is: ${userInput} and secret input is: ${secretInput}`);
            if (userInput.length + secretInput.length > 0) {
                api.postLogin(userInput, secretInput)
                    .then(postInfo => {
                        console.log(`api returns user info and it is: ${JSON.stringify(postInfo)}`);
                        if(postInfo.data.status === "OK")
                            props.setOpenSignUp(false);
                        else {
                            setVerifyUser(false);
                            setAuthFailed(true);
                        }
                    });
            }
        }

        if (!openSignUp)
            getUserInfo();
        else
            postUserInfo();
    }, [verifyUser, userInput, secretInput]);

    return (
        <div className={styles['container']}>
            <span className={styles['theme-btn']} onClick={props.updateColorTheme}>Change Theme</span>
            <div className={styles['logo-box']}>
                <EditEaseLogo/>
            </div>
            <div className={styles['form']}>
            {
                !openSignUp
                ?
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e, 'username')}/>
                    <Divider/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e, 'password')}/>
                    <Divider/>
                    <Button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: '1px solid #000'
                            }}
                            variant="contained"
                            onClick={() => {setVerifyUser(true)}}
                          >Proceed</Button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>New here? Click here to sign up</span>
                </>
                :
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e, 'username')}/>
                    <Divider/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e, 'password')}/>
                    <Divider/>
                    <Button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: ' 1px solid #000'
                            }}
                            variant="contained"
                            onClick={() => {setVerifyUser(true)}}
                          >Submit</Button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>Click here to sign in</span>
                </>
            }
            </div>
        </div>
    );
});

export default Login;
