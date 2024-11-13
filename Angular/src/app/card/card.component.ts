import { Component, OnInit,Input } from '@angular/core';
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {Router} from "@angular/router";
import {StorageService} from "../storage.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
	@Input() card: any;
	public api = environment.baseURL;
	private colors = ["primary","accent","warn"];
	public data : any = {
		date : "",
		startTime : "",
		endTime : "",
		users : [],
		colors : []
	}
	public date:any;
	public startTime:any;
	public endTime : any;
	constructor(private storageService : StorageService,private snackbar : MatSnackBar,private router : Router,private https:HttpClient) {}

	ngOnInit(): void {
		let date = new Date(this.card.date);
		this.date = date.getDate() + "/" + (date.getMonth() + 1).toString() + "/" + date.getFullYear();
		this.data.date = this.card.date;

		let startTime = new Date(this.card.startTime);
		this.startTime = startTime.getHours() + ":" + (startTime.getMinutes().toString().length === 1 ? "0" + startTime.getMinutes().toString() : startTime.getMinutes().toString());
		this.data.startTime = this.card.startTime;

		let endTime = new Date(this.card.endTime)
		this.endTime = endTime.getHours() + ":" + (endTime.getMinutes().toString().length === 1 ? "0" + endTime.getMinutes().toString() : endTime.getMinutes().toString());
		this.data.endTime = this.card.endTime;

		for (let user of this.card.users) {
			let newUser = {
				...user
			}
			newUser['color'] = this.colors[this.getRandom()];
			this.data.users.push(newUser);
		}
	}
	getRandom(){
		return Math.floor(Math.random() * 3);
	}

	updateInterview() {
		this.storageService.setData(this.data,"Reschedule");
		this.storageService.setID(this.card._id);
		this.router.navigate(['/schedule']).then(() => {});
	}

	check() {
		return Date.parse(this.card.endTime) >= Date.now();
	}

	deleteInterview() {
		this.https.delete(`${this.api}/delete-interview/${this.card._id}`).subscribe((r :any)=>{
			if (r && r.error) {
				this.snackbar.open(r.error, '', {
					duration: 5 * 1000
				})
			} else {
				this.snackbar.open("Successfully Deleted Interview", '', {
					duration: 5 * 1000
				});
				window.location.reload();
			}
		});
	}
}
