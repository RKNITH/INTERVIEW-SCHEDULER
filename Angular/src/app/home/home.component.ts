import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {Router} from "@angular/router";
import {StorageService} from "../storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	public api = environment.baseURL;

	public interviews :any = [];
	public pastInterviews : any = {tense : "Past",cards : []};
	public presentInterviews : any = {tense : "Present",cards : []};
	public futureInterviews : any= {tense : "Future",cards : []};
	public type: String = "Schedule";

	constructor(private storageService : StorageService,private https : HttpClient,private snackbar : MatSnackBar,private router : Router) {}

	ngOnInit(): void {
		this.https.get(`${this.api}/interviews`).subscribe((r:any) =>{
			if(r.error){
				this.snackbar.open( r.error,'',{
					duration: 5 * 1000,
				});
			} else if(r.statusCode === 200){
				let interviews = r.interviews;
				let now = Date.now();
				for(let interview of interviews) {
					if (Date.parse(interview.endTime.toString()) < now) {
						this.pastInterviews.cards.push(interview);
					}else if (Date.parse(interview.startTime.toString()) > now){
						this.futureInterviews.cards.push(interview);
					}else {
						this.presentInterviews.cards.push(interview);
					}
				}
			}
		});
		this.interviews.push(this.pastInterviews);
		this.interviews.push(this.presentInterviews);
		this.interviews.push(this.futureInterviews);
	}

	public createInterview() {
		this.storageService.setData(null,this.type);
		this.router.navigate(['/schedule']).then(r => {});
	}
}
