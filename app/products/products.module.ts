import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
import { ProductDetailsComponent } from './product-details.component';
import { ProductsComponent } from './products.component';
import { CheckoutComponent } from './checkout.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { OrderReceiptComponent } from './order-receipt.component';
import { ChannelPackComponent } from './channel-pack.component';
import { CompareDthComponent } from './compare-dth.component';
import { NgxImageZoomModule } from 'ngx-image-zoom'; 
import { User } from '../user';
import { FavoritesComponent } from './favorites.component';
import { ProductDetailAmpComponent } from './product-detail-amp.component';
import { StepCheckoutComponent } from './step-checkout.component'; 
const routes: Routes = [
  { path: 'compare-box', component: CompareDthComponent },
  { path: 'listing', component: ProductsComponent },
  { path: 'listing/:name', component: ProductsComponent },
  { path: 'channel-pack/:id', component: ChannelPackComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'step-checkout', component: StepCheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'order-receipt/:name', component: OrderReceiptComponent },
  { path: 'amp/:name', component: ProductDetailAmpComponent },
  { path: ':name', component: ProductDetailsComponent },
 // {path: '**', redirectTo: '/error/404'},
];

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    NgxImageZoomModule.forRoot(),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatInputModule,
    MatStepperModule
  ],
  declarations: [ProductsComponent, CartComponent, ProductDetailsComponent,CheckoutComponent, OrderReceiptComponent, ChannelPackComponent, CompareDthComponent, FavoritesComponent, ProductDetailAmpComponent, StepCheckoutComponent],
  providers : [ProductService,TodoService,User,AuthService]
})

export class ProductsModule { }
