import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {environment} from "../../environments/environment";
import {MatLegacyChip as MatChip} from "@angular/material/legacy-chips";
import {StorageService} from "../storage.service";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

	public type : String = "Schedule";
	public api = environment.baseURL;
	public users : any = [];
	constructor(private storageService : StorageService,private route : ActivatedRoute,private router: Router,private https:HttpClient,private snackbar : MatSnackBar) {}

	ngOnInit(): void {
		this.type = this.storageService.getType();

		this.https.get(`${this.api}/get-all-users`).subscribe((r:any) =>{
			if(r.error){
				this.snackbar.open( r.error,'',{
					duration: 5 * 1000,
				});
			} else if(r.statusCode === 200){
				this.users = r.users;
				setTimeout(()=>{
					if (this.type === "Reschedule"){
						let data = this.storageService.getData();
						for(let user of data['users']){
							let el = document.getElementById("user"+user._id);
							if(el) {
								el.classList.add('mat-chip-selected');
							}
						}
						let dateEl :any = document.getElementById('date');
						if (dateEl) {
							dateEl.innerHTML = Date.parse(data.date);
						}
						let startTimeEl : any = document.getElementById('startTime');
						if (startTimeEl){
							startTimeEl.innerHTML = data.startTime;
						}
						let endTimeEl : any = document.getElementById('endTime');
						if (endTimeEl){
							endTimeEl.innerHTML = data.endTime;
						}
					}
				},100);
			}
		});
	}

	public schedule() {
		let dateEl :any = document.getElementById('date');
		let startTimeEl : any = document.getElementById('startTime');
		let endTimeEl : any = document.getElementById('endTime');
		let ids = [];
		for (let user of this.users){
			let el = document.getElementById("user"+user._id);
			if(el && el.classList.contains('mat-chip-selected')){
				ids.push(user._id);
			}
		}
		if(dateEl && startTimeEl && endTimeEl){
			let startTime = new Date(dateEl.value + " " + startTimeEl.value);
			let endTime  = new Date(dateEl.value + " " + endTimeEl.value);
			let date = new Date(dateEl.value);

			if(this.type === "Schedule") {
				this.https.post(`${this.api}/create-interview`, {
					date: date,
					startTime: startTime,
					endTime: endTime,
					ids: ids
				}).subscribe((r: any) => {
					if (r.error) {
						this.snackbar.open(r.error, '', {
							duration: 5 * 1000
						})
					} else if (r.statusCode === 201) {
						this.router.navigate(['/']).then(() => {
							this.snackbar.open(r.message, '', {
								duration: 5 * 1000
							})
						})
					}
				});
			}else{

				let id : any = this.storageService.getID();
				this.https.put(`${this.api}/update-interview/${id}`, {
					date: date,
					startTime: startTime,
					endTime: endTime,
					ids: ids
				}).subscribe((r: any) => {
					if (r && r.error) {
						this.snackbar.open(r.error, '', {
							duration: 5 * 1000
						})
					} else if (!r || r.statusCode === 204 ) {
						this.router.navigate(['/']).then(() => {
							this.snackbar.open("Successfully updated Interview", '', {
								duration: 5 * 1000
							});
						})
					}
				});
			}

		}else {
			this.snackbar.open("Element Not Detected",'',{
				duration: 5 * 1000,
			});
		}
	}

	public toggleSelection(chip: MatChip) {
		chip.toggleSelected();
	}
}
