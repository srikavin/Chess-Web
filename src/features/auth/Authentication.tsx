import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../../components/Loader/Loader";
import {authFailure, loginAsync, registerAsync, selectAuth} from "./authSlice";

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
            <div className="container max-w-md mx-auto px-6 py-4 border-gray-500 border border-solid shadow-md rounded">
                <h1 className="text-3xl">{props.type}</h1>
                <div className="mx-auto center w-14 mt-4">
                    <Loader/>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto px-6 py-4 border-gray-500 border border-solid shadow-md rounded">
            <h1 className="text-3xl">{props.type}</h1>
            {props.error ? (
                <div className="text-white px-4 py-3 border-0 rounded relative my-4 bg-red-500">
                    <span className="inline-block align-middle mr-8">
                        <b className="capitalize" role="alert">{props.type} failed:</b> {props.error}
                    </span>
                </div>
            ) : null}
            <form className="grid grid-cols-1 gap-4 mt-4">
                <div className="block">
                    <label htmlFor='username'>Username</label>
                    <input type='text' className="mt-1 block w-full" id="username" value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                </div>


                <div className="block">
                    <label htmlFor='password'>Password</label>
                    <input type='password' className="mt-1 block w-full" id="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <input className="block w-min px-4 py-2 border-solid border-gray-300 border rounded" type='button'
                       value={props.type} onClick={() => props.onSubmit(username, password)}/>
            </form>
        </div>
    )
}

export function LoginRoute() {
    const dispatch = useDispatch();
    const authState = useSelector(selectAuth);

    useEffect(() => {
        dispatch(authFailure(undefined));
    }, [dispatch]);

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

    useEffect(() => {
        dispatch(authFailure(undefined));
    }, [dispatch]);

    return (
        <AuthenticationCommon type='Register'
                              error={authState.error}
                              onSubmit={(username, password) => dispatch(registerAsync(username, password))}
                              loading={authState.isLoading}/>
    )
}
