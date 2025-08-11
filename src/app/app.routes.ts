import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutComponent } from './components/about/about.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SuccessComponent } from './pages/success/success.component';
import { FailComponent } from './pages/fail/fail.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'about', component: AboutComponent },
    { path: 'orders', component: OrdersComponent, canActivate: [ authGuard ] },
    { path: 'summary', component: OrderSummaryComponent, canActivate: [ authGuard ] },
    { path: 'profile', component: ProfileComponent, canActivate: [ authGuard ] },
    { path: 'login', component: LoginComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'failed', component: FailComponent },
    { path: '**', component: HomeComponent }
];
