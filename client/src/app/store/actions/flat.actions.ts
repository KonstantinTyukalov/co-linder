import { createAction, props } from "@ngrx/store";
import { FlatComment } from "src/app/dto/flatComment.dto";
import { Flat } from "../../dto/flat.dto";
import { User } from "../../dto/user.dto";

export const getFlats = createAction('GET_FLATS');
export const getFlatsSuccess = createAction('GET_FLATS_SUCCESS', props<{ flats: Flat[] }>());

export const getFlatById = createAction('GET_FLAT_BY_ID', props<{ id: string }>());
export const getFlatByIdSuccess = createAction('GET_FLAT_BY_ID_SUCCESS', props<{ flat: Flat }>());

export const updateFlatComments = createAction('UPDATE_FLAT_COMMENTS', props<{ comment: FlatComment }>());

export const updateFlat = createAction('UPDATE_FLAT', props<{ flat: Flat, user: User }>());

export const updateFlatInterested = createAction('UPDATE_FLAT_INTERESTED', props<{ flat: Flat, user: User }>());

export const getFlatsByFilters = createAction('GET_FLATS_BY_FILTERS', props<{
    area: string;
    name: string;
    costMax: number
    costMin: number
    capacityMin: number;
    interestedMin: number;
    readyToLiveMin: number;
    readyToLiveMax: number;
    createdMin: Date;
}>());
