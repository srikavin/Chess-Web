import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {getRecentGamesAsync, getRecentGamesForUserAsync} from "../play_game/gameSlice";
import {Link} from "react-router-dom";
import {GameBoard} from "./GameBoard";
import {Game} from "../../data/resource/games";

import styles from './RecentGames.module.css'
import {UserIdentifier} from "../../data/resource/users";

interface GamePreviewProps {
    game: Game;
}

export function GamePreview(props: GamePreviewProps) {
    const game = props.game;

    return (
        <div
            className="border-solid border rounder border-black bg-gradient-to-b from-green-100 via-green-50 to-green-100 rounded">
            <Link to={`/games/${game.id}`}>
                <div className="flex gap-4">
                    <div className="w-60 h-60">
                        <GameBoard game_id={game.id} className={styles.previewBoard} validateMoves={false}
                                   allowMoves={false} orientation="white" isReadOnly={true}/>
                    </div>
                    <div className="mt-4">
                        <div className="flex">
                            <img className="inline-block w-14 h-14"
                                 src='data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
                                 alt=''/>
                            <div className="my-auto">
                                <div className="ml-2 text-lg">Blitz <span className="text-sm">5 + 0</span></div>
                                <div className="ml-2 text-sm">2 weeks ago</div>
                            </div>

                        </div>

                        <span className="text-red-700"><span className="text-md font-bold">{game.status}</span>.</span>
                        {/*<h2><b>Win</b> testUser vs. Test2</h2>*/}
                    </div>
                </div>
            </Link>
        </div>
    )
}

interface RecentGamesProps {
    userId?: UserIdentifier;
}

export function RecentGames(props: RecentGamesProps) {
    const dispatch = useDispatch();
    const games = useSelector((state: RootState) => state.game);

    useEffect(() => {
        if (props.userId) {
            dispatch(getRecentGamesForUserAsync(props.userId));
        } else {
            dispatch(getRecentGamesAsync());
        }
    }, [dispatch, props.userId]);

    const loaded = games.gamesById;

    const temp = [];

    for (const g in loaded) {
        if (loaded.hasOwnProperty(g)) {
            if (props.userId && loaded[g].playerBlack !== props.userId && loaded[g].playerWhite !== props.userId) {
                continue;
            }
            temp.push(loaded[g]);
        }
    }

    return (
        <div className="grid gap-3">
            {
                temp.map(e => {
                    return <GamePreview key={e.id} game={e}/>
                })
            }
        </div>
    );
}
