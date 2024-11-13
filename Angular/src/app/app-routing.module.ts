import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ScheduleComponent} from "./schedule/schedule.component";

const routes: Routes = [
	{
		path : "",
		component : HomeComponent
	}, {
		path : "schedule",
		component : ScheduleComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
