import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutesModule } from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PhoneNumberPipe } from './pipes/phone-number/phone-number.pipe'
import { BaseService } from "./services/base.service";

import { AppComponent }  from './app.component';
import { RegisterComponent }  from './components/register/register.component';
import { ForgotPasswordComponent }  from './components/forgot-password/forgot-password.component';
import { HeaderComponent }  from './components/share/header/header.component';
import { LeftMenuComponent }  from './components/share/left-menu/left-menu.component';
import { ConfirmationComponent }  from './components/share/confirmation/confirmation.component';
import { LoginComponent }  from './components/login/login.component';
import { HomeComponent }  from './components/home/home.component';
import { ValidationComponent }  from './components/validation/validation.component';
import { ResetPasswordComponent }  from './components/reset-password/reset-password.component';
import { ChangePasswordComponent }  from './components/change-password/change-password.component';
import { DashboardComponent }  from './components/dashboard/dashboard.component';
import { ProfileComponent }  from './components/profile/profile.component';
import { AssetComponent }  from './components/asset/asset.component';
import { TaskComponent }  from './components/task/task.component';
import { AppointmentComponent }  from './components/appointment/appointment.component';
import { OfficeComponent }  from './components/office/office.component';
import { CompanyComponent }  from './components/company/company.component';
import { CustomerComponent }  from './components/customer/customer.component';
import { TicketComponent }  from './components/ticket/ticket.component';
import { UserComponent }  from './components/user/user.component';
import { GroupComponent }  from './components/group/group.component';
import { ModuleComponent }  from './components/module/module.component';
import { CourseComponent }  from './components/education/course/course.component';
import { StudentComponent }  from './components/education/student/student.component';
import { CertificationComponent }  from './components/education/certification/certification.component';
import { InstructorComponent }  from './components/education/instructor/instructor.component';
import { TopicComponent }  from './components/education/topic/topic.component';
import { CourseReferenceComponent }  from './components/education/course-reference/course-reference.component';
import { DisciplineComponent }  from './components/education/discipline/discipline.component';

// Financial components
import { FinancialRegisterComponent }  from './components/financials/register/financial-register.component';
import { FinancialRegisterAddComponent }  from './components/share/financial-register-add/financial-register-add.component';
import { FinancialLedgerComponent }  from './components/financials/ledger/ledger.component';

// Insurance components
import { InsuranceCompanyComponent }  from './components/insurance/company/insurance-company.component';
import { InsuranceCustomerComponent }  from './components/insurance/customer/insurance-customer.component';

import { PhoneNumberFormatterDirective } from './directives/phone-number/phone-number.directive'
import { NumberOnlyFormatterDirective } from './directives/number-only/number-only.directive'
import { TagControlDirective } from './directives/tag-control/tag-control.directive'


@NgModule({
  // Providers
  providers: [
    BaseService,
    PhoneNumberPipe
  ],
  // Modules
  imports:      [
    BrowserModule,
    HttpModule,
    AppRoutesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,

    PhoneNumberFormatterDirective,
    NumberOnlyFormatterDirective,
    TagControlDirective,

    PhoneNumberPipe,

    RegisterComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    ValidationComponent,
    ResetPasswordComponent,
    DashboardComponent,
    ProfileComponent,
    ConfirmationComponent,
    AssetComponent,
    ChangePasswordComponent,
    LeftMenuComponent,
    TaskComponent,
    AppointmentComponent,
    OfficeComponent,
    CompanyComponent,
    CustomerComponent,
    TicketComponent,
    UserComponent,
    GroupComponent,
    FinancialRegisterComponent,
    FinancialRegisterAddComponent,
    FinancialLedgerComponent,
    InsuranceCompanyComponent,
    InsuranceCustomerComponent,
    CourseComponent,
    ModuleComponent,
    StudentComponent,
    CertificationComponent,
    InstructorComponent,
    TopicComponent,
    CourseReferenceComponent,
    DisciplineComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
