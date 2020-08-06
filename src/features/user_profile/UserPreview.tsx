import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {RootState} from "../../app/store";
import {getUserAsync} from "./userProfileSlice";
import styles from "./UserPreview.module.css";
import Popover from "react-tiny-popover";
import {User} from "../../data/resource/users";

interface UserPreviewProps {
    user_id: string;
    className?: string;
}

interface UserPreviewPopoverProps {
    user: User;
}

function UserPreviewPopover(props: UserPreviewPopoverProps) {
    return (
        <>
            {props.user.bio}
        </>
    )
}

export function UserPreview(props: UserPreviewProps) {
    const dispatch = useDispatch();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const user = useSelector((state: RootState) => state.user_profile.usersById[props.user_id])

    useEffect(() => {
        if (!user) {
            dispatch(getUserAsync(props.user_id))
        }
    }, [props.user_id, user, dispatch])

    if (!user) {
        return (
            <div className={styles.user_preview}>
                loading
            </div>
        );
    }

    return (
        <>
            <div className={styles.user_preview + ' ' + (props.className ? props.className : '')}>
                <img src={user.profilePicUrl}/>
                <div className={styles.content}>
                    <Popover isOpen={isPopoverOpen}
                             position={'top'} // preferred position
                             content={<UserPreviewPopover user={user}/>}>
                        <div onMouseEnter={() => setIsPopoverOpen(true)} onMouseLeave={() => setIsPopoverOpen(false)}>
                            <a href={`/users/${user.id}`}>
                                {user.username} <span className={styles.rating}>(1280)</span>
                            </a>
                        </div>
                    </Popover>
                </div>
            </div>
        </>

    )
}