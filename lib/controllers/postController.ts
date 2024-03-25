import { Request, Response } from 'express';
import { IPost } from '../modules/posts/model';
import PostService from '../modules/posts/service';
import UserService from '../modules/users/service';
import e = require('express');

export class PostController {

    private post_service: PostService = new PostService();
    private user_service: UserService = new UserService();

    public async createPost(req: Request, res: Response) {
        try{
            console.log("ESTOY EN CREATEPOST")
            // this check whether all the filds were send through the request or not
            console.log("title: "+ req.body.title);
            console.log("content: "+ req.body.body);
            console.log("author: "+ req.body.userId);

            if (req.body.title && req.body.body && req.body.userId){
                console.log("BIEN");
                const post_params:IPost = {
                    title: req.body.title,
                    content: req.body.body,
                    author: req.body.userId
                };
                console.log("title: "+ post_params.title);
                console.log("content: "+ post_params.content);
                console.log("author: "+ post_params.author);
                const post_data = await this.post_service.createPost(post_params);
                console.log("Se crea bien")
                 // Now, you may want to add the created post's ID to the user's array of posts
                await this.user_service.addPostToUser(req.body.userId, post_data._id); //
                console.log("Add Post to User");
                console.log(req.body.userId);
                console.log(post_data._id);
                return res.status(201).json({ message: 'Post created successfully', post: post_data });
            }else{            
                console.log("Missing fields");
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getPost(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                // Send success response
                return res.status(200).json({ data: post_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAll(req: Request, res: Response) {
        const post_filter = { };
        const post_data = await this.post_service.getAll(post_filter);
        return res.status(200).json(post_data);    
    }

    public async update_post(req: Request, res: Response) {
        try {
            console.log("Estoy en update post")
            if (req.params.id) {
                const post_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.post_service.filterPost(post_filter);
                if (!post_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found'});
                }
                console.log("si existen los datos");
                console.log("Autor: "+post_data.author)
                console.log("Content: "+post_data.content)
                console.log("Title: "+post_data.title)


    
                const post_params: IPost = {
                    //_id: req.params.id || post_data._id,
                    title: req.body.title || post_data.title,
                    content: req.body.body || post_data.content,
                    author: req.body.userId || post_data.author,
                };
                console.log("Autor2: "+req.body.userId)
                console.log("Content2: "+req.body.body)
                console.log("Title2: "+req.body.title)
                // Update user
                await this.post_service.updatePost(post_params);
                //get new user data
                const new_post_data = await this.post_service.filterPost(post_filter);
                console.log("Autor3: "+new_post_data.author)
                console.log("Content3: "+new_post_data.content)
                console.log("Title3: "+new_post_data.title)
                // Send success response
                return res.status(200).json({message: 'Successful'});
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deletePost(req: Request, res: Response) {
        try {
            if (req.params.id) {
                // Delete post
                const delete_details = await this.post_service.deletePost(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Post not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}