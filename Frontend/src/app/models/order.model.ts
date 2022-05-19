import { CartModel } from "./cart.model";
import { CityEnum } from "./city.enum";
import { UserModel } from "./user.model";

export class OrderModel {
    _id: string;
    finalPrice: number;
    deliveryCity: CityEnum;
    deliveryStreet: string;
    deliveryDate: Date;
    creditCard: number;
    creditCard4Digits: string;
    createdAt: Date;
    userId: string;
    user: UserModel;
    cartId: string;
    cart: CartModel;
}