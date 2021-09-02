import { Component, OnInit } from '@angular/core';
import { PostsService } from '../http/posts.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  postDetail = null;
  answerList = [];

  constructor(private service: PostsService) { }

  ngOnInit(): void {
    this.postDetail = this.service.getPostData();
    this.postDetail['asked_date'] = this.calculateDays(this.postDetail['creation_date']);
    this.postDetail['active_date'] = this.calculateDays(this.postDetail['last_activity_date']);
    this.postDetail['edited_date'] = this.calculateDays(this.postDetail['last_edit_date']);

    console.log(this.postDetail)
    if(this.postDetail.answer_count > 0){
      if(this.postDetail.answers.length > 10)
        this.answerList = this.postDetail.answers.slice(0, 10);
      else this.answerList = this.postDetail.answers;
    }
    
  }

  calculateDays(unixTime){
    const date = new Date(unixTime*1000);
    const current = new Date();

    let time = current.getTime() - date.getTime();
    let days = time / (1000 * 3600 * 24); //Diference in Days.
    if(Math.floor(days) == 0) return Math.ceil(time / (1000 * 3600));
    else return Math.floor(days);
  }

  onClickBack(){
    window.history.back();
  }

}
