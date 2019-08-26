import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSub: Subscription;

  constructor(public postsService: PostService) { }
  // posts = [
  //   {title: 'this is 1st title', content: 'this is first post'},

  //   {title: 'this is 2nd title', content: 'this is second post'},

  //   {title: 'this is 3rd title', content: 'this is third post'},
  // ];
  isLoading = false;
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
  @Input() posts: Post[] = [];
  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }
  onDelete(postId:string){
    this.postsService.deletePost(postId); 

  }

}
