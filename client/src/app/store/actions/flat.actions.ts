import { createAction, props } from "@ngrx/store";
import { Flat } from "../../dto/flat.dto";

export const getFlats = createAction('GET_FLATS');
export const getFlatsSuccess = createAction('GET_FLATS_SUCCESS', props<{ flats: Flat[] }>());

export const getFlatById = createAction('GET_FLAT_BY_ID', props<{ id: string }>());
export const getFlatByIdSuccess = createAction('GET_FLAT_BY_ID_SUCCESS', props<{ flat: Flat }>());
