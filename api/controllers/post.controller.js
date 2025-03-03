import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);

    const minPrice = query.minPrice ? parseInt(query.minPrice) : 0;
    const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : 10000000;
    const bedroom = query.bedroom ? parseInt(query.bedroom) : undefined;

    try {
        const posts = await prisma.post.findMany({
            where: {
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                },
                city: query.city || undefined,
                bedroom: bedroom,
                type: query.type || undefined,
                property: query.property || undefined,
               
            }
        });

        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
};

export const getPost = async (req,res) =>{
    const id = req.params.id;
    try{
        const post= await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                },
            },
        });

        let userId;

        const token = req.cookies?.token;

        if (!token) {
            userId = null;
        }else{
            jwt.verify(token, process.env.JWT_SECRET_KEY, async(err,payload)=>{
                if(err){
                    userId = null;
                }else{
                    userId = payload.id;
                }
            });
        }

        const saved = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    postId:id,
                    userId,
                },
            },
        });

        res.status(200).json({ ...post, isSaved: saved ? true: false });
    }catch(err){
        console.log(err);
        res.status(500).json({ message:"Failed to get post" });
    }
}

export const addPost = async (req,res) =>{
    const body = req.body;
    const tokenUserId = req.userId;

    try{
        const newPost = await prisma.post.create({
            data:{
                ...body.postData,
                userId: tokenUserId,
                postDetail:{
                    create:body.postDetail,
                },
            },
        });
        res.status(200).json(newPost);
    }catch(err){
        console.log(err);
        res.status(500).json({ message:"Failed to create post" });
    }
}

export const updatePost = async (req,res) =>{
    try{

        res.status(200).json()
    }catch(err){
        console.log(err);
        res.status(500).json({ message:"Failed to update post" });
    }
}

export const deletePost = async (req,res) =>{
    const id = req.params.id;
    const tokenUserId =req.userId;

    try{
        const post = await prisma.post.findUnique({
            where: { id }
        });

        if(post.userId !== tokenUserId){
            return res.status(403).json({ message:"Not Authorized" });
        }

        await prisma.post.delete({
            where: { id },
        });

        res.status(200).json({ message:"Post deleted!" });
    }catch(err){
        console.log(err);
        res.status(500).json({ message:"Failed to delete post"});
    }
}