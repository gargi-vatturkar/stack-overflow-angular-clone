import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { PostsService } from '../http/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchValue = new FormControl();  
  constructor(private service: PostsService, private router: Router) { }

  ngOnInit(): void {
    this.searchValue.valueChanges.pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe(term => {
          this.service.setSearchValue(this.searchValue.value);
      });
  }

  onLogoClick(){
    this.router.navigate(["/list"])
  }

  onClickSearch(){  }

}
