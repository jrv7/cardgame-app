import {EntityInterface} from "~/composables/entity/Interface/EntityInterface";
import {oGame} from "~/composables/entity/Interface/GameInterface";
import {GameClass} from "~/composables/entity/Class/GameClass";
import {oGamePlayer} from "~/composables/entity/Interface/GamePlayerInterface";
import {GamePlayerClass} from "~/composables/entity/Class/GamePlayerClass";
import {oCard} from "~/composables/entity/Interface/CardInterface";
import {CardClass} from "~/composables/entity/Class/CardClass";
import {oGameFormat} from "~/composables/entity/Interface/GameFormatInterface";
import {DeckClass} from "~/composables/entity/Class/DeckClass";
import {oDeck} from "~/composables/entity/Interface/DeckInterface";

export type CommanderZoneType = {
    cmdZone: {
        commanderSummoned:boolean,
        commanderSummons:number,
        partnerSummoned:boolean,
        partnerSummons:number,
    },
    playerId:number
}

export type PlayerDeckType = {
    id:number,
    name:string,
    isValid:boolean,
    coverCard:oCard,
    primaryCard:oCard,
    secondary:oCard|null,
    gameFormat:oGameFormat,
    cards:oCard[]
}

export type CommanderType = {
    playerId:number,
    commander:oCard|CardClass,
    partner:oCard|null,
}

export type ExileType = {
    playerId:number,
    cards:oCard[]|null,
}

export type GraveyardType = {
    playerId:number,
    cards:oCard[]|null,
}

export type TableType = {
    playerId:number,
    cards:oCard[]|null,
}

export type oSession = {
    uid:string|null,
    game:oGame|null,
    playersReady:boolean,
    players:oGamePlayer[]|GamePlayerClass[],
    decks:oDeck[],
    playersCmdZones:CommanderZoneType[]|null,
    playersCommanders:CommanderType[]|null,
    playersExiles:ExileType[]|null,
    playersGraveyards:GraveyardType[]|null,
    playersTables:TableType[]|null,
    playersOrder:number[]
};

export interface SessionInterface extends EntityInterface {
    _uid:string|null;
    _game:GameClass|null;
    _playersReady:boolean;
    _players:GamePlayerClass[]|null;
    _decks:DeckClass[]|null,
    _playersCmdZones:CommanderZoneType[]|null;
    _playersCommanders:CommanderType[]|null;
    _playersExiles:ExileType[]|null;
    _playersGraveyards:GraveyardType[]|null;
    _playersTables:TableType[]|null;
    _playersOrder:number[];
}