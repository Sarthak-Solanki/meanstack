import { Post } from './post.model';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class PostService {
    private posts: Post[] = [];
    private postUpdated = new Subject<Post[]>();
    constructor(private http: HttpClient, private router: Router) {
    }
    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath,
                    };
                });
            })).
            subscribe((transformPost) => {
                this.posts = transformPost;
                this.postUpdated.next([...this.posts]);
            });
    }
    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append("title", title);

            postData.append("content", content);

            postData.append("image", image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
            }
        }
        const post: Post = { id: id, title: title, content: content, imagePath: null };
        this.http.put("http://localhost:3000/api/posts/" + id, postData).subscribe(response => console.log(response => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            const post: Post = {

                id: id,
                title: title,
                content: content,
                imagePath:response.imagePath,
            }
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.postUpdated.next([...this.posts]);
        }));
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title)

        //const post: Post = { id: null, title: title, content: content };
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe((responseData) => {
            //alert(responseData.message);
            const post: Post = {
                id: responseData.post.id,
                title: title,
                content: content,
                imagePath: responseData.post.imagePath,
            }
            const id = responseData.post.id;
            post.id = id;
            this.posts.push(post);
            this.postUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        })
    }

    deletePost(postId: string) {
        console.log(postId);
        this.http.delete('http://localhost:3000/api/posts/' + postId).
            subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postUpdated.next([...this.posts]);

                this.router.navigate(["/"]);
            }
            );
    }
}
