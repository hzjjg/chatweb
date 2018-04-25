
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Room} from "./room";
@Injectable()
export class RoomService {
    _room: BehaviorSubject<Room>;

    get room () {
        return this._room;
    }
    constructor(
        private http: HttpClient
    ) {
        this._room = new BehaviorSubject(null);
    }

    get(roomNo: string) {
        return this.http.get(`/rooms/${roomNo}`).map((_room: Room) => {
            this._room.next(_room);
            return _room;
        })
    }

    fetchMembers(roomNo: string) {
        return this.http.get(`/rooms/${roomNo}/members`);
    }

    kickout(roomNo: string, userId: number) {
        return this.http.delete(`/rooms/${roomNo}/members/${userId}`)

    }
}