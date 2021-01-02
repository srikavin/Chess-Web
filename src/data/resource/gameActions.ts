import {createAction} from "@reduxjs/toolkit";
import {ChessClock, ChessMove, Game, GameIdentifier} from "./games";
import {UserIdentifier} from "./users";

export const chessMoveEvent = createAction<{ game_id: GameIdentifier, player_id: UserIdentifier, move: ChessMove, state: Game }>("chess/move");
export const chessMoveEventError = createAction<{ error: string }>("chess/move_error");

export const chessJoinEvent = createAction<{ game_id: GameIdentifier, player_id: UserIdentifier, state: Game }>("chess/player_join");
export const chessJoinEventError = createAction<{ error: string }>("chess/player_join_error");

export const chessGameCreateEvent = createAction<{ error: string }>("chess/player_game_create");
export const chessGameCreateEventError = createAction<{ error: string }>("chess/player_game_create_error");

export const chessClockSync = createAction<{ game_id: GameIdentifier, clock: ChessClock }>("chess/clock_sync");
