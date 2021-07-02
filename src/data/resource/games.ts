import {Identifier} from "../identifier";
import axiosInstance, {_v} from "../_common";
import {UserIdentifier} from "./users";
import {ChessWebsocketTypes, sendWebsocketMessage} from "../websocket";
import {PieceType} from "chess.js";

export type ChessPosition =
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'
    | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2'
    | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3'
    | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4'
    | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5'
    | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6'
    | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7'
    | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8';

export enum GameVisibility {
    PUBLIC = "PUBLIC",
    UNLISTED = "UNLISTED",
}

export enum PlayerColor {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export enum GameStatus {
    IN_PROGRESS_WHITE = "IN_PROGRESS_WHITE",
    IN_PROGRESS_BLACK = "IN_PROGRESS_BLACK",
    ENDED_DRAW = "ENDED_DRAW",
    ENDED_WHITE_WINS = "ENDED_WHITE_WINS",
    ENDED_BLACK_WINS = "ENDED_BLACK_WINS",
    WAITING = "WAITING"
}

export class GameStatusUtils {
    static hasEnded(status: GameStatus) {
        return status === GameStatus.ENDED_BLACK_WINS || status === GameStatus.ENDED_DRAW || status === GameStatus.ENDED_WHITE_WINS;
    }
}

export interface Game {
    id: string;
    initialFen: string;
    currentFen: string;
    playerWhite: UserIdentifier;
    playerBlack: UserIdentifier;
    visibility: GameVisibility;
    status: GameStatus;
    moves?: Array<ChessMove>;
    clock?: ChessClock
}

export interface ChessClock {
    whiteTimeLeft: number;
    blackTimeLeft: number;
    /**
     * Epoch time
     */
    lastMoveTime: number;
    /**
     * Epoch time
     */
    referenceTime: number;
    currentActive: PlayerColor;
}

export interface ChessMove {
    source: ChessPosition;
    end: ChessPosition;
    promotion?: Exclude<PieceType, 'p' | 'k'>;
}


function normalizeGame<T extends Game>(game: T): T {
    return game;
}

function normalizeGames<T extends Game>(games: Array<T>): Array<T> {
    return games;
}

export const GameApi = {
    async getGameById(id: GameIdentifier): Promise<Game> {
        let req = await axiosInstance.get(_v('/games/:id', {id}));

        return normalizeGame(req.data);
    },
    async getRecentGames(limit = 100, user?: UserIdentifier): Promise<Array<Game>> {
        let req = await axiosInstance.get('/games/', {params: {limit, ...(user ? {user} : {})}});

        return normalizeGames(req.data);
    },
    async joinGame(id: GameIdentifier) {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_JOIN_GAME, {id})
    },
    async createAndJoinGame() {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_CREATE_GAME, {})
    },
    async makeMove(id: GameIdentifier, move: ChessMove) {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_MAKE_MOVE, {id, move});
    },
    async syncClock(id: GameIdentifier) {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_REQUEST_CLOCK_SYNC, {id});
    },
    subscribeGame(id: GameIdentifier) {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_GAME_LISTEN, {id});
    },
    endSubscribeGame(id: GameIdentifier) {
        sendWebsocketMessage(ChessWebsocketTypes.CLIENT_GAME_STOP_LISTEN, {id});
    }
}

export type GameIdentifier = Identifier;
