import { Subject } from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders, HttpHeaderResponse} from '@angular/common/http';
import {Observable, BehaviorSubject} from 'rxjs';
import {VisibleRegion} from '@ionic-native/google-maps/ngx';
import {Platform} from '@ionic/angular';
import {flatMap, tap} from 'rxjs/operators';


declare let cordova: any;
declare let FilePath: any;

@Injectable({
  providedIn: 'root'
})
export class  NatuClientService {

  readonly HOST = 'https://natusfera.gbif.es';
  // readonly HOST = 'http://192.168.1.35:8010/proxy';
  // readonly HOST = 'http://localhost:8010/proxy';
  changeUser:BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  private join_project: any[];
  private join_guide: any[];
  private readonly CLIENT_ID = 'bb33cb77797127cbb1ec5c9cdfe23ba0eec8a8837f5b06b2b8eb79fcea2f246a';

  constructor(
              public http: HttpClient,
              private platform: Platform
              ) {
    this.platform.ready().then(() => {
        this.readUser();
        this.join_project = JSON.parse( localStorage.getItem('join_project') ) || [];
        this.join_guide = JSON.parse( localStorage.getItem('join_guide') ) || [];

        this.changeUser.subscribe(user =>{
          this.user = user;
          console.log('Esto es en el servicio',this.user);
        })
      });
  }
  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Headers':'*'});
  readUser() {
    const userJSON = localStorage.getItem('user');
    if (userJSON) { 
      this.changeUser.next(JSON.parse(userJSON))
    }
  }
  writeUser(u: any) {
    this.user = u;
    localStorage.setItem('user', JSON.stringify(this.user));
    const userJSON = localStorage.getItem('user');
    this.changeUser.next(JSON.parse(userJSON))
  }
  rmUser() {
    localStorage.removeItem('user');
    localStorage.clear();
    this.user = null;
  }
  isJoined(id: string): Boolean {
    return this.join_project.indexOf(id) !== -1;
  }

  setJoinedList(listJoined: any) {
      this.join_project = listJoined;
      this.saveJoined();
  }
  private saveJoined(){
      localStorage.setItem('join_project', JSON.stringify(this.join_project))
  }
  addJoined(id: string) {
      this.join_project.push(id);
      this.saveJoined();
  }
  setJoinedGuideList(listJoined: any) {
    this.join_guide = listJoined;
    this.saveJoinedGuide();
  }
  private saveJoinedGuide(){
    localStorage.setItem('join_guide', JSON.stringify(this.join_project))
  }
  addJoinedGuide(id: string) {
    this.join_guide.push(id);
    this.saveJoinedGuide();
  }
  isGuideJoined(id: string): Boolean {
    return this.join_guide.indexOf(id) !== -1;
  }

  rmJoined(id: string) {
    const index = this.join_project.indexOf(id);
    if (index === -1) { return; }
    this.join_project.slice(index);
    localStorage.setItem('join_project', JSON.stringify(this.join_project));
  }


  register(body: any): Observable<Object> {
    return this.http.post(`${this.HOST}/users.json`, { user: body },{headers:this.headers})
        .pipe(
            tap((u:any) => {
             if (!u.errors) {
              const auth = btoa(`${body.username}:${body.password}`);
              const userData = {
                id: u['user_id'],
                name: body.login,
                email: body.username,
                created_at: new Date().toISOString(),
                picture: null,
                auth: auth
              };
              this.writeUser(userData);
             } 
            })
        );
  }
  loginEmail(body: any): Observable<Object> {
    const auth = btoa(`${body.username}:${body.password}`);
    const getName = (resp: Object) => this.http.get(`${this.HOST}/users/${resp['user_id']}.json`, {headers: {'Authorization': `Basic ${auth}` }} );
    let userData: any;
    return this.http.get(`${this.HOST}/observations/new.json`, {headers: {'Authorization': `Basic ${auth}` }} )
        .pipe(
            tap( u => {
              userData = {
                id: u['user_id'],
                email: body.username,
                auth: auth,
                name: body.username
              };
              this.writeUser(userData);
            }),
            flatMap( r => getName(r)),
            tap(u => {
              userData.name = u['login'];
              userData.picture = u['user_icon_url'];
              userData.created_at = u['created_at'];
              this.writeUser(userData);
            })
        );
  }
  loginOauth(token: string): Observable<any> {
    const getOauthName = () => this.http.get(`${this.HOST}/users/edit.json`, this.getHeaderAuth());
    return this.http.post(`${this.HOST}/oauth/assertion_token`,
        {
          format: 'json',
          client_id: this.CLIENT_ID,
          grant_type: 'google',
          assertion: token
        })
        .pipe(
            tap( u=>{
                localStorage.setItem('token', u['access_token']);
                console.log("Saved oauth ", u)
            }),
            flatMap( r=> getOauthName() ),
            tap(u=>{
                const userData = {
                    id: u.id,
                    email: u.email,
                    auth: localStorage.token,
                    oauth: true,
                    name: u.login,
                    fullname: u.name,
                    picture: u.user_icon_url,
                    picture_medium: u.medium_user_icon_url,
                    created_at: u.created_at_utc,
                    updated_at: u.updated_at_utc
                };
                this.writeUser(userData);
            })
        )
  }
  taxa(params: any = {} ):  Observable<any> {
      return this.http.get(`${this.HOST}/taxa.json`, { params });
  }
  taxaSearch(query: string):  Observable<any> {
      return this.http.get(`${this.HOST}/taxa/search.json`, { params : { q: query }});
  }
  userSearch(query: string):  Observable<any> {
      return this.http.get(`${this.HOST}/people/search.json`, { params : { q: query }});
  }
  getUser(query: string):  Observable<any> {
      return this.http.get(`${this.HOST}/people/${query}.json`);
  }
  getUserData(name: string) {
    return this.http.get(`${this.HOST}/users/${name}.json`);
  }
  // observations():  Observable<Object>{
  //   return this.http.get(`${this.HOST}/observations.json`);
  // }
  observations(query: String):  Observable<Object> {
    // @ts-ignore
    return this.http.get(`${this.HOST}/observations.json`, { params : { q: query}} );
  }
  // @ts-ignore
  observationsPhoto(page: number = 1, region: VisibleRegion = null, query = null):  Observable<HttpHeaderResponse<Object>> {
    const params: any = {
        'extra': 'observation_photos',
        // "hash[]": "species_guess",
        'page': region?1:page.toString(),
    };
    if (region) {
      // console.log("Region ", region)
      params.swlat = region.nearLeft.lat; // miny   location = { lat: coords.latitude, lng : coords.longitude };
      params.swlng = region.farLeft.lng; // minx
      params.nelat = region.farRight.lat; // maxy
      params.nelng = region.farRight.lng; // maxx
    }
    if(query && query.taxon_id){
        params.taxon_id= query.taxon_id;
    }
    return this.http.get(`${this.HOST}/observations.json`, {
      observe: 'response',
      params: params
    });
  }
  observationFilter(user){
    return this.http.get(`${this.HOST}/observations/${user.login}.json`);
  }
  observationSyncPhotos(id: string, photoCache, photoEdit, photoUpload) {
      // externalDataDirectory
      // if(photoCache.length != ph)
      // if(photoUpload){
      //     photoUpload.forEach( (n, index)=>{
      //
      //     });
      // }
  }
  private proyectosApi(data = {}):  Observable<Object> {
    return this.http.get(`${this.HOST}/projects.json`, { params : data });
  }
  proyectos():  Observable<Object> {
    return this.proyectosApi();
  }
  proyectosFeatured():  Observable<Object> {
    return this.proyectosApi({featured: true});
  }
  proyectosLocation(coords: Coordinates):  Observable<Object> {
    let data = coords?{latitude: coords.latitude, longitude: coords.longitude}: {};
    return this.proyectosApi(data);
  }
  proyectosSearch(q: string,page:number = 0):  Observable<any> {
    return this.http.get(`${this.HOST}/projects/search.json?page=${page}&utf8=✓&q=${q}&order_by=title&order=asc`);
  }
  proyectosJoined(name: string = this.user.name):  Observable<any> {
    return this.http.get(`${this.HOST}/projects/user/${name}.json`, this.getHeaderAuth());
  }
  putObservationProject(obsID: string, projectID: string):  Observable<any> {
    let body = {
        project_observation: {
            observation_id: obsID,
            project_id: projectID
        }
    };
    return this.http.post(`${this.HOST}/projects/project_observations.json`, body, this.getHeaderAuth());
  }
  guides(coords: Coordinates = null):  Observable<Object> {
    if(coords!=null) return this.guidesLocation(coords);
    return this.http.get(`${this.HOST}/guides.json`);
  }
  guidesJoined(user: string = this.user.name):  Observable<any> {
    return this.http.get(`${this.HOST}/guides/${user}.json`, this.getHeaderAuth());
  }
  guidesLocation(coords: Coordinates):  Observable<Object> {
    return this.http.get(`${this.HOST}/guides.json`, {params: {latitude: coords.latitude.toString(), longitude: coords.longitude.toString()}} );
  }
  joinGuide(id: String, join = true): Observable<Object> {
    if(join) return this.http.post(`${this.HOST}/guides/${id}/join.json`, {}, this.getHeaderAuth());
    else return this.http.delete(`${this.HOST}/guides/${id}/leave.json`, this.getHeaderAuth());
  }
  myGuides(){
    return this.http.get(`${this.HOST}/guides.json?by=you`, this.getHeaderAuth());
  }

  getGuideTaxa(id: string) {
    return this.http.get( `${this.HOST}/guide_taxa.json`, {params: { guide_id: id}} );
  }
  getProjectObservations(idProject: string) {
    return this.http.get( `${this.HOST}/observations/project/${idProject}.json`);
  }
  guidesSearch(q: string, page:number = 0): Observable<any> {
    return this.http.get(`${this.HOST}/guides/search.json?page=${page}&utf8=✓&q=${q}&order_by=title&order=asc`);
  }

  // User api

  getHeaderAuth() {
    if(localStorage.token){
        return {headers: {'Authorization': `Bearer ${localStorage.token}`}};
    }else {
        return {headers: {'Authorization': `Basic ${this.user.auth}`}};
    }
  }

  joinProject(id: String): Observable<Object> {
    return this.http.post(`${this.HOST}/projects/${id}/join.json`, {}, this.getHeaderAuth());
  }
  leaveProject(id: String): Observable<Object> {
    return this.http.delete(`${this.HOST}/projects/${id}/leave.json`, this.getHeaderAuth());
  }
  postObservation(body: any) {
    const data = {
        observation: body
    };
    return this.http.post(`${this.HOST}/observations.json`, data , this.getHeaderAuth());
  }
  updateObservation(id: string, body: any) {
      console.log("Update obs ", id);
    const data = {
        observation: body,
        ignore_photos: true
    };
    return this.http.put(`${this.HOST}/observations/${id}.json`, data , this.getHeaderAuth());
  }
  postObservationPhoto(id: string, photo: string) {
    const uploadFilePromise = (id, photo) => new Promise((resolve, reject) => {
          cordova.plugin.http.uploadFile(`${this.HOST}/observation_photos.json?observation_photo[observation_id]=${id}`, null, this.getHeaderAuth().headers,
              photo, 'file',
              (finish) => {
                  console.log('is finish all ', finish);
                  resolve(finish);
              }, error => {
                  console.log('is finish all ', error);
                  reject(error);
              });
      });
    //           const b64 = photo.substr('data:image/jpeg;base64,'.length);
    //           const img = this.base64toBlob(b64, 'image/jpeg');
    if(photo.indexOf("content:") !== -1){
        FilePath.resolveNativePath(photo, (photoFile)=>{
            return uploadFilePromise(id, photoFile);
        },(error)=>{
            console.log("Error file ", error);
        });
    }else{
        return uploadFilePromise(id, photo);
    }
  }
  deleteObservation(id: number){
      const options: any = this.getHeaderAuth();
      options.responseType = 'text';
      return this.http.delete(`${this.HOST}/observations/${id}`, options );
  }
  deleteObservationPhoto(id: number){
      const options: any = this.getHeaderAuth();
      options.responseType = 'text';
      return this.http.delete(`${this.HOST}/photos/${id}`, options );
  }

  getUserObservations() {
    return this.http.get( `${this.HOST}/observations/${this.user.name}.json`);

  }
  getObservationID(id: string) {
    return this.http.get( `${this.HOST}/observations/${id}.json`);
  }
  postCommentObservation(id: string, form: any) {
    const body = {
        comment: {
          parent_type: 'Observation',
          parent_id: id,
          body: form.msg
        }
    };
    return this.http.post(`${this.HOST}/comments.json`, body, this.getHeaderAuth());
  }
  postIdentification(id: string, form: any) {
    const body = {
      identification: {
        observation_id: id,
        taxon_id: form.taxo,
        body: form.body
      }
    };
    return this.http.post(`${this.HOST}/identifications.json`, body, this.getHeaderAuth());
  }
  getPlaces(query = ""): Observable<any>{
      return this.http.get(`${this.HOST}/places.json`, { params : { q: query }});
  }
  updates(): Observable<any>{
      const options: any = this.getHeaderAuth();
      options.responseType = 'text';
      return this.http.get(`${this.HOST}/users/new_updates`, options);
  }
  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }
  private postData(form: FormData) {
    // return this.http.post(`${this.HOST}/observation_photos.json`, form, headers);
  }

  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  b64toBlob(b64, onsuccess, onerror) {
    const img = new Image();

    img.onerror = onerror;

    img.onload = function onload() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(onsuccess);
    };

    img.src = b64;
  }
}
