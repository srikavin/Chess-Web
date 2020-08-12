import {useDispatch, useSelector} from "react-redux";
import {getUserAsync} from "./userProfileSlice";
import {RootState} from "../../app/store";
import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import styles from './UserProfile.module.css'
import {Tab, Tabs} from "../../components/Tabs/Tabs";

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import {RecentGames} from "../game/RecentGames";

dayjs.extend(relativeTime);

export interface UserProfileProps {
    user_id: string
}

function UserProfileImage(props: { url: string | undefined }) {
    return (
        <img className={styles.profile_image} src={props.url} alt=''/>
    )
}

function UserProfileRating(props: { name: string, rating: number, games: number }) {
    return (
        <div className={styles.rating}>
            <img src='https://via.placeholder.com/50' alt=''/> <p><b>{props.name}</b>
            <br/> {props.rating} ({props.games} games)</p>
        </div>
    )
}


export function UserProfile(props: UserProfileProps) {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user_profile.usersById[props.user_id])

    useEffect(() => {
        if (!user) {
            dispatch(getUserAsync(props.user_id))
        }
    }, [props.user_id, user, dispatch])

    return (
        <>
            {user ? (
                <div className={styles.container}>
                    <div className={styles.sidebar}>
                        <UserProfileImage url={user.profilePicUrl}/>

                        <div className={styles.ratings}>
                            <h2 className={styles.lined}>Ratings</h2>
                            <UserProfileRating name={"Bullet"} rating={1250} games={14}/>
                            <UserProfileRating name={"Blitz"} rating={1930} games={91}/>
                            <UserProfileRating name={"Classic"} rating={1152} games={5}/>
                            <UserProfileRating name={"Puzzles"} rating={1152} games={251}/>
                        </div>
                    </div>

                    <div className={styles.main_area}>
                        <h1>{user.username}</h1>
                        <small className={styles.lastSeen}>Last seen {dayjs(user.lastSeen).fromNow()}</small>

                        <h3 className={styles.lined}>About</h3>
                        <p className={styles.bio}>{user.bio}</p>

                        <h3 className={styles.lined}>Recent Games</h3>

                        <RecentGames userId={props.user_id}/>

                        <Tabs>
                            <Tab name={"Recent Games"}>

                            </Tab>
                            <Tab name={"Friends"}>
                                <UserProfileRoute/>
                            </Tab>
                        </Tabs>
                    </div>

                </div>
            ) : "loading"}
        </>
    )
}

export function UserProfileRoute() {
    let {id} = useParams();
    return (
        <UserProfile user_id={id}/>
    )
}