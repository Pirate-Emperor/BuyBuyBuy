import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItemModel } from '../models/cart-item.model';
import { CartModel } from '../models/cart.model';
import { CartsAction, CartsActionType, cartsStore } from '../redux/carts.state';

@Injectable({
    providedIn: 'root'
})
export class CartsService {

    constructor(private http: HttpClient) { }

    //* Get all items that in the cart by caryId:
    async getAllItemsByCart(cartId: string): Promise<CartItemModel[]> {
        if (cartId) {
            const observable = this.http.get<CartItemModel[]>(environment.cartItemsByCartUrl + cartId);
            const itemsByCart = await firstValueFrom(observable);

            const action: CartsAction = { type: CartsActionType.FetchCartsItems, payload: itemsByCart };
            cartsStore.dispatch(action);
            return itemsByCart;
        }
        return [];
    };

    //* Add Item to cart:
    async addItemToCart(item: CartItemModel, userId: string): Promise<CartItemModel> {
        const observable = this.http.post<CartItemModel>(environment.cartItemsUrl + userId, item);
        return await firstValueFrom(observable);
    };

    //* Delete item from cart:
    async deleteItem(productId: string, cartId: string): Promise<void> {
        const observable = this.http.delete(environment.cartItemsUrl + productId + "/" + cartId);
        await firstValueFrom(observable);

        const action: CartsAction = { type: CartsActionType.DeleteItemFromCart, payload: productId };
        cartsStore.dispatch(action);
    };

    //* Delete all the Items from the cart:
    async deleteAllItemsByCart(cartId: string): Promise<void> {
        const observable = this.http.delete(environment.cartItemsUrl + cartId);
        await firstValueFrom(observable);

        const action: CartsAction = { type: CartsActionType.DeleteAllItemsFromCart };
        cartsStore.dispatch(action);
    };

    //* Get the open cart by userId:
    async getCartByUser(userId: string): Promise<CartModel> {
        const observable = this.http.get<CartModel>(environment.cartByUserUrl + userId);
        const cartByUser = await firstValueFrom(observable);

        const action: CartsAction = { type: CartsActionType.GetActiveCart, payload: cartByUser };
        cartsStore.dispatch(action);

        return cartByUser;
    };

    //* Go over all the cart items and calculate the total amount of the cart:
    getTotalCartAmount() {
        const cartItems = cartsStore.getState().cartItems;
        const total = cartItems.reduce((accumulator, currVal) => {
            return accumulator + (currVal.quantity * currVal.product.price)
        }, 0)

        return total;
    }
}
