import { createStore } from "redux";
import { CategoryModel } from "../models/category.model";

//* Categories State - categories data needed in the application level: 
export class CategoriesState {
    public categories: CategoryModel[] = [];
    public selectedCategory: string = 'all';
}

//* Categories Action Type - any action which can be done on the above categories state
export enum CategoriesActionType {
    FetchCategories = "FetchCategories",
    SelectedCategory = "SelectedCategory"
}

//* Categories Action - any single object sent to the store during 'dispatch':
export interface CategoriesAction {
    type: CategoriesActionType;
    payload?: any;
}

//* Categories Reducer - the main function performing any action on categories state:
export function categoriesReducer(currentState = new CategoriesState(), action: CategoriesAction): CategoriesState {
    const newState = { ...currentState };

    switch (action.type) {
        case CategoriesActionType.FetchCategories:
            newState.categories = action.payload;
            break;

        case CategoriesActionType.SelectedCategory:
            newState.selectedCategory = action.payload;
            break;
    }

    return newState;
}

export const categoriesStore = createStore(categoriesReducer);