import { Component } from '@angular/core';
import { OrderModel } from 'src/app/models/order.model';
import { authStore } from 'src/app/redux/auth.state';
import { ordersStore } from 'src/app/redux/orders.state';
import { CartsService } from 'src/app/services/carts.service';
const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-pdf-receipt',
    templateUrl: './pdf-receipt.component.html',
    styleUrls: ['./pdf-receipt.component.css']
})

export class PdfReceiptComponent {

    constructor(private cartsService: CartsService) { }

    async generatePDF() {
        let theLastOrder: OrderModel = ordersStore.getState().theLastOrder;

        const user = authStore.getState().user;

        //* Getting last orders cart items: 
        const cartItems = await this.cartsService.getAllItemsByCart(theLastOrder?.cartId);
        const totalAmount = this.cartsService.getTotalCartAmount();

        if (!theLastOrder) return;

        let docDefinition = {
            content: [
                {
                    text: "Niv Yulevitch's Supermarket",
                    fontSize: 16,
                    alignment: 'center',
                    color: '#047886'
                },
                {
                    text: 'INVOICE',
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    decoration: 'underline'
                },
                {
                    text: 'Customer Details',
                    style: 'sectionHeader'
                },
                {
                    columns: [
                        [
                            {
                                text: user.firstName + ' ' + user.lastName,
                                bold: true
                            },
                            { text: user.username },
                            { text: user.street },
                            { text: user.city }
                        ],
                        [
                            {
                                text: `Order Date: ${new Date(theLastOrder.createdAt).toLocaleDateString('en-IL')}`,
                                alignment: 'right'
                            },
                            {
                                text: `Delivery Date: ${new Date(theLastOrder.deliveryDate).toLocaleDateString('en-IL')}`,
                                alignment: 'right'
                            },
                            {
                                text: `Credit Card: ${theLastOrder.creditCard4Digits}`,
                                alignment: 'right'
                            },
                            {
                                text: 'Bill No :' + theLastOrder._id,
                                alignment: 'right'
                            }
                        ]
                    ]
                },
                {
                    text: 'Delivery Details',
                    style: 'sectionHeader',
                    alignment: 'left'
                },
                {
                    columns: [
                        [
                            {
                                text: user.firstName + ' ' + user.lastName,
                                bold: true
                            },
                            { text: theLastOrder.deliveryStreet },
                            { text: theLastOrder.deliveryCity },
                        ],
                    ]
                },
                {
                    text: 'Order Details',
                    style: 'sectionHeader'
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            [{ text: 'Product', bold: true, fillColor: 'lightblue', fontSize: 16 }, { text: 'Price', bold: true, fillColor: 'lightblue', fontSize: 16 }, { text: 'Quantity', bold: true, fillColor: 'lightblue', fontSize: 16 }, { text: 'Amount', bold: true, fillColor: 'lightblue', fontSize: 16 }],
                            ...cartItems.map(c => ([c.product.productName, '$' + c.product.price, c.quantity, '$' + (c.product.price * c.quantity).toFixed(2)])),
                            [{ text: 'Total Amount', bold: true, fillColor: 'pink' }, { text: '', fillColor: 'pink' }, { text: '', fillColor: 'pink' }, { text: '$' + totalAmount.toFixed(2), bold: true, fillColor: 'pink' }]
                        ]
                    }
                },
                {
                    text: 'Additional Details',
                    style: 'sectionHeader'
                },
                {
                    margin: [0, 0, 0, 15],
                    ul: [
                        { text: 'Linkedin', color: 'blue', link: 'https://www.linkedin.com/in/niv-yulivitch/' },

                        { text: 'Github', color: 'blue', link: 'https://github.com/Niv-Yulevitch' }
                    ],
                },
                {
                    text: 'Terms and Conditions',
                    style: 'sectionHeader'
                },
                {
                    ul: [
                        'All orders are final.',
                        "Warranty of any product will be subject to the manufacturer's terms and conditions.",
                        'This is a system generated invoice.',
                    ],
                }
            ],
            styles: {
                sectionHeader: {
                    bold: true,
                    decoration: 'underline',
                    fontSize: 14,
                    margin: [0, 15, 0, 15]
                }
            }
        };

        pdfMake.createPdf(docDefinition).download();
    }
}