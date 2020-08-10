import React, {useEffect} from 'react';
import NavLink from './NavLink/NavLink';
import {NavDivider} from "./NavBar/NavDivider";
import {NavGroup} from "./NavBar/NavGroup";
import {NavHeader} from "./NavBar/NavHeader";
import {NavBar} from "./NavBar/NavBar";
import {useDispatch, useSelector} from "react-redux";
import {selectAuth} from "../auth/authSlice";
import {getUserAsync, selectUserProfile} from "../user_profile/userProfileSlice";
import {User} from "../../data/resource/users";

export function Navigation() {
    const authState = useSelector(selectAuth);
    const userState = useSelector(selectUserProfile);

    const dispatch = useDispatch();

    let user: User | undefined = undefined;
    if (authState.currentUser) {
        user = userState.usersById[authState.currentUser];
    }

    useEffect(() => {
        if (authState.currentUser) {
            if (!userState.usersById[authState.currentUser]) {
                dispatch(getUserAsync(authState.currentUser));
            }
        }
    }, [dispatch, authState.currentUser, userState.usersById])


    return (
        <NavBar>
            <NavGroup align={'left'}>
                <NavHeader>
                    <NavLink to={'/'} label="Bishop"/>
                </NavHeader>
                <NavDivider/>
                <NavLink to='/games/' label="Games"/>
                <NavLink to='/users/sVnqCf26BJhGJHQz' label="Test"/>
                <NavLink to='/users/UdhOzGh5bqwat0GN' label="Test2"/>
            </NavGroup>
            <NavGroup align={'right'}>
                <NavDivider/>
                {user ? (
                    <>
                        <NavLink to={`/users/${user.id}`} label={user.username}/>
                    </>
                ) : (
                    <>
                        <NavLink to='/login' label="Login"/>
                        <NavLink to='/register' label="Register"/>
                    </>
                )}
            </NavGroup>
        </NavBar>
    )
}
