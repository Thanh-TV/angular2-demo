import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ValidationComponent } from './components/validation/validation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AssetComponent } from './components/asset/asset.component';
import { TaskComponent } from './components/task/task.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { ChangePasswordComponent }  from './components/change-password/change-password.component';
import { OfficeComponent }  from './components/office/office.component';
import { CompanyComponent }  from './components/company/company.component';
import { CustomerComponent }  from './components/customer/customer.component';
import { TicketComponent }  from './components/ticket/ticket.component';
import { UserComponent }  from './components/user/user.component';
import { GroupComponent }  from './components/group/group.component';
import { ModuleComponent }  from './components/module/module.component';
import { StudentComponent }  from './components/education/student/student.component';
import { CourseComponent }  from './components/education/course/course.component';
import { CertificationComponent }  from './components/education/certification/certification.component';
import { InstructorComponent }  from './components/education/instructor/instructor.component';
import { TopicComponent }  from './components/education/topic/topic.component';
import { DisciplineComponent }  from './components/education/discipline/discipline.component';

// Financial components
import { FinancialRegisterComponent }  from './components/financials/register/financial-register.component';
import { FinancialLedgerComponent }  from './components/financials/ledger/ledger.component';

// Insurance components
import { InsuranceCompanyComponent }  from './components/insurance/company/insurance-company.component';
import { InsuranceCustomerComponent }  from './components/insurance/customer/insurance-customer.component';

declare var module: any;

declare global {
  interface NodeModule {
    dynamicImport(path: string): any;
  }
}

const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }, {
    path: 'login',
    component: LoginComponent
  }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'register',
    component: RegisterComponent
  }, {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }, {
    path: 'change-password',
    component: ChangePasswordComponent
  }, {
    path: 'Credentials/Validation',
    component: ResetPasswordComponent
  }, {
    path: 'dashboard',
    component: DashboardComponent
  }, {
    path: 'profile',
    component: ProfileComponent
  }, {
    path: 'asset',
    component: AssetComponent
  }, {
    path: 'tasks',
    component: TaskComponent
  }, {
    path: 'appointments',
    component: AppointmentComponent
  }, {
    path: 'offices',
    component: OfficeComponent
  }, {
    path: 'companies',
    component: CompanyComponent
  }, {
    path: 'customers',
    component: CustomerComponent
  }, {
    path: 'tickets',
    component: TicketComponent
  }, {
    path: 'users',
    component: UserComponent
  }, {
    path: 'groups',
    component: GroupComponent
  }, {
    path: 'financial/register',
    component: FinancialRegisterComponent
  }, {
    path: 'financial/ledgers',
    component: FinancialLedgerComponent
  }, {
    path: 'insurance/companies',
    component: InsuranceCompanyComponent
  }, {
    path: 'insurance/customers',
    component: InsuranceCustomerComponent
  }, {
    path: 'modules',
    component: ModuleComponent
  }, {
    path: 'education/courses',
    component: CourseComponent
  }, {
    path: 'education/students',
    component: StudentComponent
  }, {
    path: 'education/certifications',
    component: CertificationComponent
  }, {
    path: 'education/instructors',
    component: InstructorComponent
  }, {
    path: 'education/topics',
    component: TopicComponent
  }, {
    path: 'education/disciplines',
    component: DisciplineComponent
  },  {
    path: '**',
    redirectTo: '/'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(AppRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule {}
