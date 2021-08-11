// ----------------------------- authors CRUD ---------------------
import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

// To obtain authors.json file path
const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")

const blogPostsRouter = express.Router()

const getblogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeblogPosts = content => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(content))

// GET /blogPosts => returns the list of blogposts
blogPostsRouter.get("/", (request, response) => {
    const blogPosts = getblogPosts()
    response.send(blogPosts)
})

// GET /blogPosts /123 => returns a single blogpost
blogPostsRouter.get("/:aID", (request, response) => {
    const blogPosts = getblogPosts()
    const blogPost = blogPosts.find(b => b.id === request.params.aID)
    response.send(blogPost)
})

// POST /blogPosts => create a new blogpost
blogPostsRouter.post("/", (request, response) => {
    const newBlogPost = { ...request.body, id: uniqid(), createdAt: new Date()}
    const blogPosts = getblogPosts()
    blogPosts.push(newBlogPost)
    writeblogPosts(blogPosts)
    response.status(201).send({ id: newBlogPost.id })
})

// PUT /blogPosts /123 => edit the blogpost with the given id
blogPostsRouter.put("/:aID", (request, response) => {
    const blogPosts = getblogPosts()
    const updatedBlogPost = { ...request.body, id: request.params.aID }
    const remainingBlogPosts = blogPosts.filter(blogPost => blogPost.id !== request.params.aID)
    remainingBlogPosts.push(updatedBlogPost)

    writeblogPosts(remainingBlogPosts)
    response.send(updatedBlogPost)
})

// DELETE /blogPosts /123 => delete the blogpost with the given id
blogPostsRouter.delete("/:aID", (request, response) => {
    const blogPosts = getblogPosts()
    const remainingBlogPosts = blogPosts.filter(blogPost => blogPost.id !== request.params.aID)
        
    writeblogPosts(remainingBlogPosts)
    response.status(204).send()
})

export default blogPostsRouter