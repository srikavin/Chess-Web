import {useDispatch, useSelector} from "react-redux";
import {getUserAsync} from "./userProfileSlice";
import {RootState} from "../../app/store";
import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Tab, Tabs} from "../../components/Tabs/Tabs";

import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import {User} from "../../data/resource/users";
import {Loader} from "../../components/Loader/Loader";
import {RecentGames} from "../game/RecentGames";

dayjs.extend(relativeTime);

export interface UserProfileProps {
    user_id: string
}

function UserProfileImage(props: { url: string | undefined }) {
    return (
        <img className="object-contain min-w-full" src={props.url} alt=''/>
    )
}

function UserProfileRating(props: { name: string, rating: number, games: number }) {
    return (
        <div className="flex flex-auto flex-row space-x-2 my-2 shadow border">
            <img className="inline-block w-14 h-14"
                 src='data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
                 alt=''/>
            <div className="inline-block my-auto">
                <b className="block">{props.name}</b>
                {props.rating} ({props.games} games)
            </div>

        </div>
    )
}

export type PureUserProfileProps = {
    loading: true;
    error: string | undefined;
} | {
    loading: false | undefined;
    error: string | undefined;
    user: User
}

export function PureUserProfile(props: PureUserProfileProps) {
    if (props.error) {
        return (
            <>{props.error}</>
        )
    }

    if (props.loading || !props.user) {
        return (
            <Loader size="small"/>
        )
    }

    const user = props.user;

    return (
        <div className="container mx-auto flex justify-center md:items-start items-center flex-col md:flex-row gap-x-8">
            <div className="w-screen md:w-4/12 max-w-xs">
                <UserProfileImage url={user.profilePicUrl}/>

                <div className="">
                    <h2 className="lined text-lg font-bold mt-2">Ratings</h2>
                    <UserProfileRating name={"Bullet"} rating={1250} games={14}/>
                    <UserProfileRating name={"Blitz"} rating={1930} games={91}/>
                    <UserProfileRating name={"Classic"} rating={1152} games={5}/>
                    <UserProfileRating name={"Puzzles"} rating={1152} games={251}/>
                </div>
            </div>

            <div
                className="md:w-8/12 container rounded border p-4 shadow-sm">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <small className="text-sm italic">Last seen {dayjs(user.lastSeen).fromNow()}</small>

                <h3 className="lined text-lg font-bold mt-2">About</h3>
                <div className="ml-4 my-1">
                    {user.bio}
                </div>

                <h3 className="lined text-lg font-bold mt-2">Recent Games</h3>


                <Tabs>
                    <Tab name={"Recent Games"}>
                        <div className="ml-4 my-1 py-2">
                            <RecentGames userId={user.id}/>
                        </div>
                    </Tab>
                    <Tab name={"Friends"}>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}


export function UserProfile(props: UserProfileProps) {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user_profile.usersById[props.user_id])
    const loading = useSelector((state: RootState) => state.user_profile.isLoading)
    const error = useSelector((state: RootState) => state.user_profile.error)

    useEffect(() => {
        dispatch(getUserAsync(props.user_id))
    }, [props.user_id, dispatch])

    return (
        <PureUserProfile loading={loading} user={user} error={error}/>
    )
}

export function UserProfileRoute() {
    let {id} = useParams<Record<string, string>>();
    return (
        <UserProfile user_id={id}/>
    )
}
