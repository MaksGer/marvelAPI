import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthenticationFormComponent} from './authentication-form/authentication-form.component';
import {AuthGuard} from './auth.guard';
import {HeroesComponent} from './heroes/heroes.component';
import {ComicsComponent} from './comics/comics.component';
import {CreatorsComponent} from './creators/creators.component';
import {EventsComponent} from './events/events.component';
import {SeriesComponent} from './series/series.component';
import {StoriesComponent} from './stories/stories.component';
import {MainPageLayoutComponent} from './layouts/main-page-layout/main-page-layout.component';
import {LoginPageComponent} from './layouts/login-page/login-page.component';

const routes: Routes = [
	{
		path: '', component: MainPageLayoutComponent, canActivate: [AuthGuard], children: [
			{path: 'heroes', component: HeroesComponent},
			{path: 'comics', component: ComicsComponent},
			{path: 'creators', component: CreatorsComponent},
			{path: 'events', component: EventsComponent},
			{path: 'series', component: SeriesComponent},
			{path: 'stories', component: StoriesComponent},
		]
	},
	{
		path: '', component: LoginPageComponent, children: [
			{path: 'login', component: AuthenticationFormComponent}
		]
	},
	{path: '**', redirectTo: 'heroes'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule { }
