import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
	public data : any;
	public type : String = "Schedule";
	public ID : any;
	constructor() {}

	public setData(data : any=null,type : String) : void{
		this.data = data;
		this.type = type;
	}

	public setID(ID: any){
		this.ID = ID;
	}
	public getData() : any{
		return this.data;
	}

	getType() :String{
		return this.type;
	}

	getID() {
		return this.ID;
	}
}
