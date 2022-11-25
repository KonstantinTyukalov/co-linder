import { createAction, props } from "@ngrx/store";
import { Flat } from "../../dto/flat.dto";

export const getFlats = createAction('GET_FLATS');
export const getFlatsSuccess = createAction('GET_FLATS_SUCCESS', props<{ flats: Flat[] }>());
