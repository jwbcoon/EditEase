import {useState, useEffect, forwardRef} from 'react';
import { APIInterface as API } from '../interfaces/API_Interface.js';
import styles from './Login.module.css';

import { ReactComponent as EditEaseLogo } from '../icons/editease-logo.svg';
import CredentialField from '../components/CredentialField.js';

const Login = forwardRef(function Login(props, ref) {
    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    let globalStyle = ref.current;

    useEffect(() => {
       globalStyle = ref.current;
    }, [ref.current])

    function makeUserName({user_fName, user_mName, user_lName}) {

        console.log(`making user name with: ${user_fName} : ${user_mName} : ${user_lName}`);
        const middleName = () => user_mName !== undefined && user_mName !== null  
                            ? `${user_mName.length === 1 ? user_mName[0] + '.' : user_mName}` 
                            : '';

        return `${user_fName} ${middleName()} ${user_lName}`;
    };

    function handleInputChange(event) {
        console.log("handleInputChange called.");

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Enter") {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
    };

    useEffect(() => {

        if( ! verifyUser || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            console.log(`user input is: ${userInput}`);
            api.getLoginFromUsername(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    if( userInfo.data.status === "OK" ) {
                        props.setUser(userInfo.data.user.username);
                    } else  {
                        setVerifyUser(false);
                        setAuthFailed(true);
                    }
                });
        }

        getUserInfo();
    }, [verifyUser, props.setUser, userInput]);


    return (
        <div className={styles['container']}>
            <span className={styles['theme-btn']} onClick={props.updateColorTheme}>Change Theme</span>
            <header className={styles['logo-box']}>
                <EditEaseLogo/>
            </header>
            <main className={styles['form']}>
            {
                !openSignUp
                ?
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <div><span></span></div>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <div><span></span></div>
                    <button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: ' 1px solid #000'
                            }}
                            type={'button'}
                            onClick={() => {setVerifyUser(true)}}
                          >Proceed</button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>New here? Click here to sign up</span>
                </>
                :
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <div><span></span></div>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <div><span></span></div>
                    <button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: ' 1px solid #000'
                            }}
                            type={'button'}
                            onClick={() => {setVerifyUser(true)}}
                          >Submit</button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>Click here to sign in</span>
                </>
            }
            </main>
        </div>
    );
});

export default Login;
