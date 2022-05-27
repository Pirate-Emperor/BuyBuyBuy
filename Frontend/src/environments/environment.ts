// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,

    // auth: 
    emailAndIdNumberUniqueUrl: 'https://shopping-online-xzr1.onrender.com/api/auth/check-if-email-or-id-is-unique/',
    registerUrl: 'https://shopping-online-xzr1.onrender.com/api/auth/register/',
    loginUrl: 'https://shopping-online-xzr1.onrender.com/api/auth/login/',

    // categories: 
    categoriesUrl: 'https://shopping-online-xzr1.onrender.com/api/categories/',

    // products: 
    productsUrl: 'https://shopping-online-xzr1.onrender.com/api/products/',
    productsImageUrl: 'https://shopping-online-xzr1.onrender.com/shopping/images/',

    //carts
    cartByUserUrl: 'https://shopping-online-xzr1.onrender.com/api/cart-by-user/',  //to display when user's cart was createdAt 

    // cart items 
    cartItemsUrl: 'https://shopping-online-xzr1.onrender.com/api/items/',
    cartItemsByCartUrl: 'https://shopping-online-xzr1.onrender.com/api/items-by-cart/',  //to display all items in user's current cart

    //  orders: 
    ordersUrl: 'https://shopping-online-xzr1.onrender.com/api/orders/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
