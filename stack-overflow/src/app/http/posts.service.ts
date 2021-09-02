import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  pageSize = 10;
  pageNum = 1;
  hasMore = false;
  questionList = [];

  pages = new BehaviorSubject<any>(0);

  pageSub = new BehaviorSubject<any>([]);
  searchSubject = new BehaviorSubject<any>("");

  constructor(private http: HttpClient, private router: Router) { 
  }

  getList(){
    return this.questionList;
  }

  getListSub(): Observable<any>{
    //this.pageSub.next(this.questionList);
    return this.pageSub.asObservable();
  }

  setSearchValue(val){
    this.questionList = [];
    this.searchSubject.next(val);
    this.router.navigated = false;
    this.router.navigate(["/list"])
    //this.getQuestions();
  }

  getSearchValSub(): Observable<any>{
    return this.searchSubject.value;
  }

  getQuestions(page?){
    this.pageNum = (page && page > 0) ? page : 1;

    let url = "http://api.stackexchange.com/2.3/search/advanced?site=stackoverflow&pagesize=" + 
    this.pageSize + "&page=" + this.pageNum;

    if(this.searchSubject.value.length > 0) url += "&q=" + this.searchSubject.value;
    url += "&filter=!3uBTNwo_P8G1NlRz5"  //akd.8dfNG5r*hO";

    this.http.get(url).subscribe( res => {
      if(res['items'] && res['items'].length > 0){
        this.questionList[page] = res['items'];
        if(res['total'] && this.pages.value != res['total']) 
          this.pages.next(Math.ceil(res['total']/10));
      }

      else {
        this.questionList = [];
        this.pages.next(0)
      }

      if(res['has_more']) this.hasMore = true;
      
      this.pageSub.next([...this.questionList]);
    });
  }

  getPages(){
    return this.pages.value;
  }

  setPostData(api){
    localStorage.setItem("post", JSON.stringify(api));
  }

  getPostData(){
    return JSON.parse(localStorage.getItem("post"));
  }
}
