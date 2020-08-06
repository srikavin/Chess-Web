import {createAction} from "@reduxjs/toolkit";
import {ChessMove, Game, GameIdentifier} from "./games";
import {UserIdentifier} from "./users";

export const chessMoveEvent = createAction<{ game_id: GameIdentifier, player_id: UserIdentifier, move: ChessMove, state: Game }>("chess/move");
