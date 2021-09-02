import { ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PostsService } from '../http/posts.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  page: number;

  totalPages;
  totalQuestions;
  postList = [];

  @ViewChild('loader') loader: ElementRef;

  constructor(private service: PostsService, private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  ngAfterViewInit() {
    this.loader.nativeElement.style.visibility = 'visible';
  }

  ngOnInit(): void {
    window.scrollTo(0, 0)

    // const elem = document.getElementById("loader");
    // if(elem) elem.setAttribute("style", "visibility: visible");

    this.activatedRoute.queryParamMap.subscribe(params => {
      this.page = Number(params.get('page') || 1);

      //let ind = (this.page - 1) * 10;
      if (!this.service.getList()[this.page]) {
        this.service.getQuestions(this.page);
        this.service.getListSub().subscribe(res => {

          //if(res.length % 10 == 0) this.postList = res.slice(ind, ind + 9);
          this.postList = res.length > 0 ? res[this.page] : [];
          console.log(this.postList)

          this.totalPages = [...Array(this.service.getPages())];
          this.totalQuestions = Number(this.service.getPages()) * 10;
        });
      }
      else {
        this.postList = this.service.getList()[this.page];
        this.totalPages = [...Array(this.service.getPages())];
        this.totalQuestions = Number(this.service.getPages()) * 10;
      }

      setTimeout(() => {
        this.loader.nativeElement.style.visibility = 'hidden';
      }, 1000)
    });
  }

  onClickTitle(post) {
    this.service.setPostData(post)
    this.router.navigate(["/details"]);
  }

  nextPage(page) {
    let pageNum;
    this.loader.nativeElement.style.visibility = 'visible';

    switch (page) {
      case 'next':
        pageNum = this.page + 1;
        break;
      case 'back':
        pageNum = this.page - 1;
        break;
      case 'first':
        pageNum = 1;
        break;
      case 'last':
        pageNum = this.totalPages.length;
        break;
    }

    window.scrollTo(0, 0)
    if (pageNum >= 1 && pageNum <= this.totalPages.length)
      this.router.navigate([""], { queryParams: { page: pageNum } });
  }

}
