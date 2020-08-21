import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import styles from './Authentication.module.css'
import {Loader} from "../../components/Loader/Loader";
import {loginAsync, registerAsync, selectAuth} from "./authSlice";

export interface AuthenticationCommonProps {
    type: string;
    error: string | undefined;
    onSubmit: (username: string, password: string) => void;
    loading: boolean;
}

export function AuthenticationCommon(props: AuthenticationCommonProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (props.loading) {
        return (
            <div className={styles.authContainer}>
                <h1>{props.type}</h1>
                <Loader size='medium'/>
            </div>
        )
    }

    return (
        <div className={styles.authContainer}>
            <h1>{props.type}</h1>
            {props.error ? (<h3 className={styles.error}>{props.error}</h3>) : null}
            <form>
                <label htmlFor='username'>Username</label>
                <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)}/>

                <br/>

                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>

                <br/>

                <input type='submit' value={props.type} onClick={() => props.onSubmit(username, password)}/>
            </form>
        </div>
    )
}

export function LoginRoute() {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuth);

    return (
        <AuthenticationCommon type='Login'
                              error={authState.error}
                              onSubmit={(username, password) => dispatch(loginAsync(username, password))}
                              loading={authState.isLoading}/>
    )
}

export function RegisterRoute() {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuth);

    return (
        <AuthenticationCommon type='Register'
                              error={authState.error}
                              onSubmit={(username, password) => dispatch(registerAsync(username, password))}
                              loading={authState.isLoading}/>
    )
}