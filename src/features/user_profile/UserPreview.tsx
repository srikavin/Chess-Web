import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {RootState} from "../../app/store";
import {getUserAsync} from "./userProfileSlice";
import styles from "./UserPreview.module.css";
import {UserIdentifier} from "../../data/resource/users";
import {Loader} from "../../components/Loader/Loader";
import {Skeleton} from "../../components/Skeleton/Skeleton";

export interface UserPreviewProps {
    user_id: string;
    className?: string;
}

export type PureUserPreviewProps = {
    loading: true
    className?: string;
} | {
    loading?: false;
    className?: string;
    user_id: UserIdentifier;
    username: string;
    profilePicUrl: string;
    bio: string;
}

export function PureUserPreview(props: PureUserPreviewProps) {
    if (props.loading) {
        return (
            <>
                <div className={styles.user_preview + ' ' + (props.className ? props.className : '')}>
                    <Loader size='medium'/>
                    <div className={styles.content}>
                        <Skeleton>
                            Loading Loading
                        </Skeleton>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.user_preview + ' ' + (props.className ? props.className : '')}>
                <img src={props.profilePicUrl} alt=''/>
                <div className={styles.content}>
                    <div>
                        <a href={`/users/${props.user_id}`}>
                            {props.username} <span className={styles.rating}>(1280)</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export function UserPreview(props: UserPreviewProps) {
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user_profile.usersById[props.user_id])

    useEffect(() => {
        if (!user && props.user_id) {
            dispatch(getUserAsync(props.user_id))
        }
    }, [props.user_id, user, dispatch])

    if (!user) {
        return (
            <PureUserPreview loading={true}/>
        )
    }

    return (
        <PureUserPreview className={props.className}
                         user_id={user.id}
                         username={user.username}
                         profilePicUrl={user.profilePicUrl}
                         bio={user.bio}/>
    );
}
