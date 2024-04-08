import {DeckType} from "~/composables/entity/DeckInterface";
import {PlayerType} from "~/composables/entity/PlayerInterface";
import {CardType} from "~/composables/entity/CardInterface";

export type GamePlayerType = {
    id:number,
    deck:DeckType,
    player:PlayerType
}

export type HashedCardType = {
    position:number,
    card:number,
    cardHash:string
}

export type CommanderZoneType = {
    commanderSummons:number,
    commanderSummoned:boolean,
    partnerSummons:number,
    partnerSummoned:boolean
}

export type GamePlayerDeckType = {
    playerId:number,
    deck:HashedCardType[]
}

export type GamePlayerHandType = {
    playerId:number,
    hand:HashedCardType[]
}

export type GamePlayerGraveyardType = {
    playerId:number,
    graveyard:HashedCardType[]
}

export type GamePlayerTableType = {
    playerId:number,
    table:CardType[]
}

export type GamePlayerExileType = {
    playerId:number,
    exile:HashedCardType[]
}

export type GamePlayerCmdZoneType = {
    playerId:number,
    cmdZone:CommanderZoneType
}

export type GamePlayerCommanderType = {
    playerId:number,
    commander:CardType,
    partner:CardType|null
}

export type GameSessionType = {
    uid:string,
    players:GamePlayerType[],
    thePile: {}[],
    pileLocked:boolean,
    gameTurn:number,
    playersDecks:GamePlayerDeckType[],
    playersHands:GamePlayerHandType[],
    playersOrder:number[],
    playersTables:GamePlayerTableType[],
    playersExiles:GamePlayerExileType[],
    playersCmdZones:GamePlayerCmdZoneType[],
    playersGraveyards:GamePlayerGraveyardType[],
    interactionCounter:number,
    playersCommanders:GamePlayerCommanderType[]
}

export type GameType = GameSessionType;

export type GameSessionPileType = {
    pileId:string,
    player:GamePlayerType,
    spell:CardType,
    target:any
}